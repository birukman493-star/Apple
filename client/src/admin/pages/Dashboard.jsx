import React from 'react';
import { FiShoppingBag, FiDollarSign, FiUsers, FiLayers, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard({ products = [], orders = [], sections = [] }) {
  const totalRevenue = orders.reduce((acc, o) => {
    const sub = o.items.reduce((s, i) => s + (i.price * i.quantity), 0);
    return acc + sub + (o.shippingCost || 0);
  }, 0);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const publishedSections = sections.filter(s => s.status === 'Published').length;

  return (
    <div className="content-view">
      <div className="view-header">
        <h1>Store Performance Overview</h1>
        <p>Real-time analytics, inventory metrics, and store activity summary.</p>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Revenue</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiDollarSign size={18} /></div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>${totalRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, marginTop: '4px' }}>+12.4% from last month</div>
        </div>

        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Orders</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiShoppingBag size={18} /></div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>{totalOrders}</div>
          <div style={{ fontSize: '11px', color: '#0369a1', fontWeight: 600, marginTop: '4px' }}>Active store fulfillment</div>
        </div>

        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Catalog Products</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiTrendingUp size={18} /></div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>{totalProducts}</div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>In sync with frontend store</div>
        </div>

        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>CMS Sections</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiLayers size={18} /></div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>{publishedSections} Published</div>
          <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, marginTop: '4px' }}>Active on website pages</div>
        </div>
      </div>

      {/* Recent Orders Preview Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Recent Store Orders</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700, color: '#3b82f6' }}>{o.id}</td>
                <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                <td style={{ color: '#64748b' }}>{o.date}</td>
                <td><span className="status-badge published">{o.paymentStatus}</span></td>
                <td><span className="status-badge draft">{o.orderStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}