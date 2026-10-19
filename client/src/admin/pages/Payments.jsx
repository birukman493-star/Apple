import React from 'react';
import { FiDollarSign, FiCreditCard, FiShield, FiCheckCircle } from 'react-icons/fi';

export default function Payments({ orders = [] }) {
  const totalCollected = orders.filter(o => o.paymentStatus === 'Paid').reduce((acc, o) => {
    return acc + o.items.reduce((sum, i) => sum + (i.price * i.quantity), 0) + (o.shippingCost || 0);
  }, 0);

  return (
    <div className="content-view">
      <div className="view-header">
        <h1>Payments & Transactions</h1>
        <p>Monitor payment gateways, transaction statuses, and secure checkout revenue.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Paid Transactions</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '8px 0' }}>${totalCollected.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '12px', fontWeight: 600 }}>
            <FiCheckCircle size={14} /> Apple Pay & Credit Card Secured
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Gateway</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '8px 0' }}>Apple Pay Commerce SDK</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Status: <span style={{ color: '#166534', fontWeight: 700 }}>Online & Operational</span></div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Transaction History</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Order Ref</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Gateway</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => {
              const amount = o.items.reduce((sum, i) => sum + (i.price * i.quantity), 0) + (o.shippingCost || 0);
              return (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: '#3b82f6' }}>TXN-882{idx}</td>
                  <td style={{ fontWeight: 600 }}>{o.id}</td>
                  <td>{o.customerName}</td>
                  <td style={{ fontWeight: 700 }}>${amount.toLocaleString()}</td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FiCreditCard size={14} /> Apple Pay</span></td>
                  <td><span className={`status-badge ${o.paymentStatus === 'Paid' ? 'published' : 'cancelled'}`}>{o.paymentStatus}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}