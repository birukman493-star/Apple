import React, { useState } from 'react';
import { 
  FiShoppingCart, FiSearch, FiFilter, FiEye, FiPrinter, 
  FiDownload, FiCheckCircle, FiClock, FiTruck, FiXCircle, FiPackage 
} from 'react-icons/fi';

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock comprehensive orders state
  const [orders, setOrders] = useState([
    {
      id: 'ORD-9821',
      customerName: 'Alex Johnson',
      email: 'alex.j@example.com',
      phone: '+1 (555) 234-5678',
      date: '2026-10-14',
      items: [
        { name: 'iPhone 17 Pro Max', quantity: 1, price: 1199 },
        { name: 'MagSafe Silicone Case', quantity: 1, price: 49 }
      ],
      shippingCost: 0,
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      shippingAddress: '123 Apple Blossom St, Cupertino, CA 95014'
    },
    {
      id: 'ORD-9820',
      customerName: 'Sarah Connor',
      email: 's.connor@skyline.io',
      phone: '+1 (555) 987-6543',
      date: '2026-10-14',
      items: [
        { name: 'MacBook Pro 16"', quantity: 1, price: 2499 }
      ],
      shippingCost: 15,
      paymentStatus: 'Paid',
      orderStatus: 'Shipped',
      shippingAddress: '456 Cyberdyne Way, Los Angeles, CA 90001'
    },
    {
      id: 'ORD-9819',
      customerName: 'Michael Ross',
      email: 'mross@pearsonhardman.com',
      phone: '+1 (555) 456-7890',
      date: '2026-10-13',
      items: [
        { name: 'Apple Watch Ultra 2', quantity: 1, price: 799 },
        { name: 'Trail Loop Band', quantity: 2, price: 99 }
      ],
      shippingCost: 0,
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      shippingAddress: '789 Manhattan Ave, New York, NY 10021'
    },
    {
      id: 'ORD-9818',
      customerName: 'Jessica Pearson',
      email: 'jessica@pearson.law',
      phone: '+1 (555) 321-0987',
      date: '2026-10-13',
      items: [
        { name: 'AirPods Pro 2', quantity: 1, price: 249 }
      ],
      shippingCost: 10,
      paymentStatus: 'Refunded',
      orderStatus: 'Cancelled',
      shippingAddress: '500 Park Avenue, New York, NY 10022'
    },
  ]);

  // Calculations for subtotal, final total
  const calculateSubtotal = (items) => items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Filter logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Status badge styling helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'published';
      case 'Shipped': return 'published';
      case 'Processing': return 'draft';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'cancelled';
      default: return '';
    }
  };

  // Update order status function
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
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
      calculateSubtotal(o.items) + o.shippingCost
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

  // Print Details
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="content-view">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Orders Management</h1>
          <p>Track customer purchases, fulfillment stages, and review comprehensive invoice details.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="secondary-btn" onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FiDownload size={14} /> Export CSV
          </button>
        </div>
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
              <th>Customer Name</th>
              <th>Date</th>
              <th>Items Count</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Order Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => {
              const subtotal = calculateSubtotal(o.items);
              const finalTotal = subtotal + o.shippingCost;
              const totalItemsCount = o.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: '#3b82f6' }}>{o.id}</td>
                  <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                  <td style={{ color: '#64748b' }}>{o.date}</td>
                  <td>{totalItemsCount} items</td>
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
                      style={{ height: '30px', fontSize: '11px', fontWeight: 700 }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" style={{ display: 'inline-flex' }} onClick={() => setSelectedOrder(o)} title="View Order Details">
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>Order Invoice & Details ({selectedOrder.id})</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            
            <div className="modal-body" style={{ gap: '20px' }}>
              {/* Customer & Shipping info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Customer Contact</h4>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{selectedOrder.customerName}</p>
                  <p style={{ fontSize: '13px', color: '#334155' }}>{selectedOrder.email}</p>
                  <p style={{ fontSize: '13px', color: '#334155' }}>{selectedOrder.phone}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Shipping Address</h4>
                  <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>{selectedOrder.shippingAddress}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Order Date: {selectedOrder.date}</p>
                </div>
              </div>

              {/* Ordered Products Table */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>Ordered Items</h4>
                <table style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      <th style={{ background: '#f1f5f9', padding: '10px' }}>Product</th>
                      <th style={{ background: '#f1f5f9', padding: '10px' }}>Qty</th>
                      <th style={{ background: '#f1f5f9', padding: '10px' }}>Unit Price</th>
                      <th style={{ background: '#f1f5f9', padding: '10px', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '10px', fontWeight: 600 }}>{item.name}</td>
                        <td style={{ padding: '10px' }}>{item.quantity}</td>
                        <td style={{ padding: '10px' }}>${item.price.toLocaleString()}</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>${(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', paddingRight: '8px' }}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Subtotal: <span style={{ fontWeight: 700, color: '#0f172a', marginLeft: '20px' }}>${calculateSubtotal(selectedOrder.items).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Shipping Cost: <span style={{ fontWeight: 700, color: '#0f172a', marginLeft: '20px' }}>{selectedOrder.shippingCost === 0 ? 'Free' : `$${selectedOrder.shippingCost}`}</span>
                </div>
                <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 800, marginTop: '4px', borderTop: '1px solid #e2e8f0', paddingTop: '8px', width: '220px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Final Total:</span>
                  <span style={{ color: '#2563eb' }}>${(calculateSubtotal(selectedOrder.items) + selectedOrder.shippingCost).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="secondary-btn" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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