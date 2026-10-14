import React from 'react';
import { FiBox, FiCheckCircle, FiClock, FiTag, FiTrendingUp, FiShoppingBag, FiUsers } from 'react-icons/fi';

export default function Dashboard({ products }) {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Published').length;
  const draftProducts = products.filter(p => p.status === 'Draft').length;
  const categoriesCount = new Set(products.map(p => p.category)).size;

  return (
    <div className="content-view">
      <div className="view-header">
        <h1>Dashboard Overview</h1>
        <p>Real-time analytics and store performance for your Apple Store.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon blue"><FiBox size={22} /></div>
            <span className="badge-pill success">Live DB</span>
          </div>
          <div className="metric-title">Total Products</div>
          <div className="metric-value">{totalProducts}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon green"><FiCheckCircle size={22} /></div>
            <span className="badge-pill success">Published</span>
          </div>
          <div className="metric-title">Active Products</div>
          <div className="metric-value">{activeProducts}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon purple"><FiClock size={22} /></div>
            <span className="badge-pill warning">Draft</span>
          </div>
          <div className="metric-title">Inactive Products</div>
          <div className="metric-value">{draftProducts}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon orange"><FiTag size={22} /></div>
            <span className="badge-pill success">Active</span>
          </div>
          <div className="metric-title">Categories</div>
          <div className="metric-value">{categoriesCount}</div>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon blue"><FiShoppingBag size={22} /></div>
            <span className="badge-pill success">+14% this week</span>
          </div>
          <div className="metric-title">Total Store Orders</div>
          <div className="metric-value">1,482</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon green"><FiTrendingUp size={22} /></div>
            <span className="badge-pill success">+22% revenue</span>
          </div>
          <div className="metric-title">Monthly Revenue</div>
          <div className="metric-value">$849,200</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon purple"><FiUsers size={22} /></div>
            <span className="badge-pill success">Active</span>
          </div>
          <div className="metric-title">Registered Customers</div>
          <div className="metric-value">12,450</div>
        </div>
      </div>
    </div>
  );
}