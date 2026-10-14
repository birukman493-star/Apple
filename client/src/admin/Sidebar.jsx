import React from 'react';
import { 
  FiGrid, FiBox, FiLayers, FiShoppingCart, 
  FiCreditCard, FiUsers, FiGlobe, FiSettings, FiLogOut, FiChevronRight 
} from 'react-icons/fi';

export default function Sidebar({ activeTab, setActiveTab }) {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiGrid size={18} /> },
    { id: 'products', label: 'Products', icon: <FiBox size={18} /> },
    { id: 'categories', label: 'Categories', icon: <FiLayers size={18} /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingCart size={18} /> },
    { id: 'payments', label: 'Payments', icon: <FiCreditCard size={18} /> },
    { id: 'customers', label: 'Customers', icon: <FiUsers size={18} /> },
  ];

  const contentNav = [
    { id: 'sections', label: 'Website Sections', icon: <FiGlobe size={18} /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings size={18} /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="sidebar-header">
          <span className="apple-logo"></span>
          <div className="sidebar-title">
            <h2>Apple Admin</h2>
            <p>Manage Your Store</p>
          </div>
        </div>

        <div className="sidebar-nav">
          {mainNav.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {activeTab === item.id && <FiChevronRight size={14} />}
            </button>
          ))}

          <div className="nav-section-title">Content</div>
          {contentNav.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {activeTab === item.id && <FiChevronRight size={14} />}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={() => alert('Logged out successfully!')}>
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}