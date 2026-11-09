import React, { useState } from 'react';
import { FiSearch, FiEye, FiPrinter, FiDownload, FiBox } from 'react-icons/fi';

export default function Orders({ orders = [], setOrders, products = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const calculateSubtotal = (items) => 
    items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (order.paymentReference && order.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || (order.paymentMethod && order.paymentMethod.toLowerCase() === paymentFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusChange = async (orderId, newStatus, isPayment = false) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, [isPayment ? 'paymentStatus' : 'orderStatus']: newStatus } : o);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, [isPayment ? 'paymentStatus' : 'orderStatus']: newStatus }));
    }

    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(isPayment ? { paymentStatus: newStatus } : { orderStatus: newStatus })
      });
      if (res.ok) {
        setToastMsg(`Order ${orderId} ${isPayment ? 'payment' : 'order'} status successfully updated to "${newStatus}"!`);
        setTimeout(() => setToastMsg(''), 3500);
      }
    } catch (err) {
      console.error("Failed to persist status:", err);
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'Date', 'Payment Status', 'Order Status', 'Total'];
    const rows = orders.map(o => [
      o.id,
      `"${o.customerName}"`,
      o.email,
      o.date,
      o.paymentStatus,
      o.orderStatus,
      calculateSubtotal(o.items) + (o.shippingCost || 0)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'apple_store_orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="content-view">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Orders Management</h1>
          <p>Track customer purchases, update order statuses, and review invoice details.</p>
        </div>
        <button className="secondary-btn" onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FiDownload size={14} /> Export CSV
        </button>
      </div>

      {toastMsg && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '12px 18px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)'
        }}>
          <span style={{ fontSize: '16px' }}>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <div className="filter-group">
            <div className="search-container" style={{ width: '280px' }}>
              <FiSearch size={16} />
              <input 
                type="text" 
                placeholder="Search ID or Customer..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select className="filter-select" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
              <option value="All">All Payment Methods</option>
              <option value="telebirr">Telebirr</option>
              <option value="chapa">Chapa</option>
              <option value="cbe_birr">CBE Birr</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Credit/Debit Card</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Showing {filteredOrders.length} orders
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Ordered Products</th>
              <th>Method</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => {
              const finalTotal = calculateSubtotal(o.items) + (o.shippingCost || 0);
              const methodKey = (o.paymentMethod || 'card').toLowerCase();
              return (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: '#0071e3' }}>
                    <div>{o.id}</div>
                    {o.paymentReference && (
                      <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>{o.paymentReference}</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {o.items.map((item, i) => {
                        const matchedProduct = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                        const itemImage = matchedProduct?.imageMain || item.image;
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                              {itemImage ? <img src={itemImage} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiBox size={12} style={{ color: '#94a3b8' }} />}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                              {item.name} <span style={{ color: '#64748b' }}>x{item.quantity}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: methodKey === 'telebirr' ? '#e0f2fe' : methodKey === 'chapa' ? '#f3e8ff' : methodKey === 'bank_transfer' ? '#dcfce7' : methodKey === 'cbe_birr' ? '#fae8ff' : '#f1f5f9',
                      color: methodKey === 'telebirr' ? '#0369a1' : methodKey === 'chapa' ? '#7e22ce' : methodKey === 'bank_transfer' ? '#15803d' : methodKey === 'cbe_birr' ? '#86198f' : '#334155'
                    }}>
                      {methodKey.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '12px' }}>{o.date}</td>
                  <td style={{ fontWeight: 700 }}>${finalTotal.toLocaleString()}</td>
                  <td>
                    <select
                      value={o.paymentStatus}
                      onChange={(e) => handleStatusChange(o.id, e.target.value, true)}
                      className="filter-select"
                      style={{ height: '30px', fontSize: '11px', fontWeight: 700, padding: '2px 8px' }}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                  <td>
                    <select value={o.orderStatus} onChange={(e) => handleStatusChange(o.id, e.target.value, false)} className="filter-select" style={{ height: '32px', fontSize: '12px', fontWeight: 700 }}>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" style={{ display: 'inline-flex' }} onClick={() => setSelectedOrder(o)} title="View Invoice">
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '680px' }}>
            <div className="modal-header">
              <h3>Order Invoice ({selectedOrder.id})</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            <div className="modal-body" style={{ gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Customer Contact</h4>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{selectedOrder.customerName}</p>
                  <p style={{ fontSize: '12px', color: '#334155' }}>{selectedOrder.email}</p>
                  <p style={{ fontSize: '12px', color: '#334155' }}>{selectedOrder.phone}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Shipping Address</h4>
                  <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>{selectedOrder.shippingAddress}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Date: {selectedOrder.date}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button type="button" className="secondary-btn" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiPrinter size={14} /> Print Invoice
              </button>
              <button type="button" className="primary-btn" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}