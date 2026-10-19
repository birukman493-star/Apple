import React, { useState } from 'react';
import { 
  FiSearch, FiEye, FiPrinter, FiDownload, FiBox, FiCheckCircle 
} from 'react-icons/fi';

export default function Orders({ orders = [], setOrders, products = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Calculate subtotal
  const calculateSubtotal = (items) => 
    items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Filter logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Update status action
  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
    }
  };

  // CSV Export
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
            <select 
              className="filter-select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
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

              return (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: '#0071e3' }}>{o.id}</td>
                  <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {o.items.map((item, i) => {
                        const matchedProduct = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                        const itemImage = matchedProduct?.imageMain || item.image;

                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                              {itemImage ? (
                                <img src={itemImage} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <FiBox size={12} style={{ color: '#94a3b8' }} />
                              )}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                              {item.name} <span style={{ color: '#64748b' }}>x{item.quantity}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '12px' }}>{o.date}</td>
                  <td style={{ fontWeight: 700 }}>${finalTotal.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${o.paymentStatus === 'Paid' ? 'published' : 'draft'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={o.orderStatus} 
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="filter-select"
                      style={{ height: '32px', fontSize: '12px', fontWeight: 700 }}
                    >
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

      {/* Invoice Modal */}
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

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>Items Summary</h4>
                <table style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      <th style={{ background: '#f1f5f9', padding: '10px' }}>Product</th>
                      <th style={{ background: '#f1f5f9', padding: '10px' }}>Qty</th>
                      <th style={{ background: '#f1f5f9', padding: '10px' }}>Price</th>
                      <th style={{ background: '#f1f5f9', padding: '10px', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => {
                      const matchedProduct = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                      const itemImage = matchedProduct?.imageMain || item.image;

                      return (
                        <tr key={idx}>
                          <td style={{ padding: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {itemImage ? (
                                  <img src={itemImage} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <FiBox size={16} color="#94a3b8" />
                                )}
                              </div>
                              <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px' }}>{item.quantity}</td>
                          <td style={{ padding: '10px' }}>${item.price.toLocaleString()}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>${(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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