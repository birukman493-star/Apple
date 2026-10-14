import React, { useState } from 'react';
import Sidebar from './SideBar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Users from './pages/Users';
import Sections from './pages/Sections';
import Settings from './pages/Settings';
import { FiSearch, FiBell, FiMoon } from 'react-icons/fi';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([
    { id: 'PROD-101', name: 'iPhone 17 Pro', category: 'iPhone', price: 999, status: 'Published', navVisibility: true, stock: 120 },
    { id: 'PROD-102', name: 'MacBook Pro 16"', category: 'Mac', price: 2499, status: 'Published', navVisibility: true, stock: 45 },
    { id: 'PROD-103', name: 'iPad Pro M4', category: 'iPad', price: 1099, status: 'Published', navVisibility: true, stock: 80 },
    { id: 'PROD-104', name: 'Apple Watch Ultra 2', category: 'Watch', price: 799, status: 'Published', navVisibility: true, stock: 65 },
    { id: 'PROD-105', name: 'Apple Vision Pro', category: 'Vision', price: 3499, status: 'Draft', navVisibility: false, stock: 15 },
    { id: 'PROD-106', name: 'AirPods Pro 2', category: 'AirPods', price: 249, status: 'Published', navVisibility: true, stock: 200 }
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard products={products} />;
      case 'products': return <Products products={products} setProducts={setProducts} />;
      case 'categories': return <Products products={products} setProducts={setProducts} />;
      case 'orders': return <Orders />;
      case 'payments': return <Payments />;
      case 'customers': return <Users />;
      case 'sections': return <Sections products={products} setProducts={setProducts} />;
      case 'settings': return <Settings />;
      default: return <Dashboard products={products} />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-main">
        <header className="admin-header">
          <div className="search-container">
            <FiSearch size={16} />
            <input type="text" placeholder="Search products, orders, settings..." />
          </div>
          <div className="header-actions">
            <button className="icon-btn"><FiBell size={16} /></button>
            <button className="icon-btn"><FiMoon size={16} /></button>
            <div className="admin-profile">
              <div className="avatar">
                AD
                <span className="status-dot"></span>
              </div>
              <div className="admin-info">
                <span className="admin-name">Administrator</span>
                <span className="admin-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>
        {renderContent()}
      </div>
    </div>
  );
}