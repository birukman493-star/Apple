import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sections from './pages/Sections';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import './AdminDashboard.css';

import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiArrowLeft, FiLogIn } from 'react-icons/fi';

const API_URL = "http://localhost:5000/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Shared synchronized database states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const isAdmin = Boolean(user && user.role === "admin" && token);

  const getToken = () => localStorage.getItem("adminToken") || localStorage.getItem("token");

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const [prodRes, ordRes, secRes] = await Promise.all([
        fetch(`${API_URL}/products?status=all`, { headers, credentials: "include" }),
        fetch(`${API_URL}/orders`, { headers, credentials: "include" }),
        fetch(`${API_URL}/admin/website-sections`, { headers, credentials: "include" })
      ]);

      // Detect unauthorized responses and force re‑login
      if ([prodRes, ordRes, secRes].some(r => r.status === 401)) {
        console.warn("Unauthorized – clearing tokens");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin", { replace: true });
        return;
      }

      const [prodData, ordData, secData] = await Promise.all([
        prodRes.json().catch(() => []),
        ordRes.json().catch(() => []),
        secRes.json().catch(() => [])
      ]);

      if (Array.isArray(prodData)) {
        setProducts(prodData);
      }
      if (Array.isArray(ordData)) {
        setOrders(ordData);
      }
      if (Array.isArray(secData)) {
        setSections(secData);
      }
    } catch (err) {
      console.error("Failed to load initial admin data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard products={products} orders={orders} sections={sections} setActiveTab={setActiveTab} />;
      case 'products': return <Products products={products} setProducts={setProducts} />;
      case 'sections': return <Sections sections={sections} setSections={setSections} products={products} />;
      case 'orders': return <Orders orders={orders} setOrders={setOrders} products={products} />;
      case 'payments': return <Payments orders={orders} />;
      case 'users': return <Users orders={orders} />;
      case 'settings': return <Settings />;
      case 'logout': return <Logout onCancel={() => setActiveTab('dashboard')} />;
      default: return <Dashboard products={products} orders={orders} sections={sections} setActiveTab={setActiveTab} />;
    }
  };

  const [redirect, setRedirect] = useState(false);

  // Redirect when not admin
  useEffect(() => {
    if (!isAdmin) {
      setRedirect(true);
    }
  }, [isAdmin]);

  // Effect to perform navigation when redirect flag is set
  useEffect(() => {
    if (redirect) {
      navigate('/signin', { replace: true });
    }
  }, [redirect, navigate]);

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-main">
        {renderContent()}
      </div>
    </div>
  );
}