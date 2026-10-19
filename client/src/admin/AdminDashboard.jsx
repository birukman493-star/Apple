import React, { useState } from 'react';
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Shared synchronized database states
  const [products, setProducts] = useState([
    { id: 'PRD-01', name: 'iPhone 17 Pro', category: 'iPhone', price: 999, stock: 45, status: 'Published', imageMain: '' },
    { id: 'PRD-02', name: 'MacBook Pro 16"', category: 'Mac', price: 2499, stock: 12, status: 'Published', imageMain: '' }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'ORD-9821',
      customerName: 'Alex Johnson',
      email: 'alex.j@example.com',
      phone: '+1 (555) 234-5678',
      date: '2026-10-14',
      items: [{ name: 'iPhone 17 Pro', quantity: 1, price: 999 }],
      shippingCost: 0,
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      shippingAddress: '123 Apple Blossom St, Cupertino, CA 95014'
    }
  ]);

  const [sections, setSections] = useState([
    { id: 'SEC-01', title: 'iPhone 17 Pro Spotlight', targetPage: 'iPhone page', status: 'Published' }
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard products={products} orders={orders} sections={sections} />;
      case 'products': return <Products products={products} setProducts={setProducts} />;
      case 'sections': return <Sections sections={sections} setSections={sections} products={products} />;
      case 'orders': return <Orders orders={orders} setOrders={setOrders} products={products} />;
      case 'payments': return <Payments orders={orders} />;
      case 'users': return <Users orders={orders} />;
      case 'settings': return <Settings />;
      case 'logout': return <Logout onCancel={() => setActiveTab('dashboard')} />;
      default: return <Dashboard products={products} orders={orders} sections={sections} />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-main">
        {renderContent()}
      </div>
    </div>
  );
}