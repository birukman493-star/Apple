import React, { useState, useEffect, useCallback } from 'react';
import {
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiEye,
  FiCheck,
  FiXCircle,
  FiSmartphone,
  FiDollarSign,
  FiRefreshCw
} from 'react-icons/fi';

const API_BASE = "http://localhost:5000/api";

export default function Payments({ orders = [] }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gatewayFilter, setGatewayFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/payments/admin/transactions`, {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Fallback to orders if transactions table has no entries yet
  const displayedTx = transactions.length > 0
    ? transactions
    : orders.map((o, idx) => ({
        paymentId: idx + 1,
        transactionReference: o.paymentReference || `APL-TXN-${o.id}`,
        gateway: o.paymentMethod || 'card',
        amount: o.totalAmount || (o.items?.reduce((s, i) => s + (i.price * i.quantity), 0) + (o.shippingCost || 0)),
        currency: 'USD',
        status: o.paymentStatus === 'Paid' ? 'successful' : 'pending',
        orderNumber: o.id,
        customerName: o.customerName,
        customerEmail: o.email,
        paymentDate: o.date
      }));

  const filtered = displayedTx.filter((t) => {
    const matchesSearch =
      t.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGateway =
      gatewayFilter === 'All' || t.gateway?.toLowerCase() === gatewayFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'All' || t.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesGateway && matchesStatus;
  });

  const totalCollected = displayedTx
    .filter((t) => t.status === 'successful' || t.status === 'Paid')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const pendingCount = displayedTx.filter(
    (t) => t.status === 'pending' || t.status === 'Pending'
  ).length;

  // Manual verify / approve action
  const handleVerifyPayment = async (paymentId, targetStatus) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/payments/admin/verify/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: targetStatus, notes: "Verified via Admin Dashboard" })
      });

      if (res.ok) {
        setToastMsg(`Transaction successfully marked as '${targetStatus}'!`);
        setTimeout(() => setToastMsg(''), 3500);
        fetchTransactions();
        if (selectedTx && selectedTx.paymentId === paymentId) {
          setSelectedTx(prev => ({ ...prev, status: targetStatus }));
        }
      }
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  const getGatewayBadge = (gateway) => {
    const g = (gateway || 'card').toLowerCase();
    if (g === 'telebirr') return { label: 'Telebirr', bg: '#e0f2fe', color: '#0369a1' };
    if (g === 'chapa') return { label: 'Chapa', bg: '#f3e8ff', color: '#7e22ce' };
    if (g === 'cbe_birr') return { label: 'CBE Birr', bg: '#fae8ff', color: '#86198f' };
    if (g === 'bank_transfer') return { label: 'Bank Transfer', bg: '#dcfce7', color: '#15803d' };
    if (g === 'cod') return { label: 'Cash on Delivery', bg: '#fef3c7', color: '#b45309' };
    return { label: 'Credit Card', bg: '#e0e7ff', color: '#4338ca' };
  };

  return (
    <div className="content-view">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Payments & Gateway Transactions</h1>
          <p>Monitor multi-channel payment gateways, verify bank transfers, and audit transactions.</p>
        </div>
        <button
          className="secondary-btn"
          onClick={fetchTransactions}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FiRefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
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
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Revenue Verified</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '8px 0' }}>
            ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '12px', fontWeight: 600 }}>
            <FiCheckCircle size={14} /> Confirmed in MySQL Database
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Pending Verifications</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: pendingCount > 0 ? '#b45309' : '#0f172a', margin: '8px 0' }}>
            {pendingCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px' }}>
            <FiClock size={14} /> Bank slips & Cash on Delivery awaiting review
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Supported Gateways</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '10px 0 6px' }}>
            Telebirr • Chapa • CBE Birr • Banks
          </div>
          <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
            ● Configured & Sandbox Ready
          </div>
        </div>
      </div>

      {/* Table & Filtering */}
      <div className="table-container">
        <div className="table-toolbar">
          <div className="filter-group">
            <div className="search-container" style={{ width: '280px' }}>
              <FiSearch size={16} />
              <input
                type="text"
                placeholder="Search reference, order, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
            >
              <option value="All">All Gateways</option>
              <option value="telebirr">Telebirr</option>
              <option value="chapa">Chapa</option>
              <option value="cbe_birr">CBE Birr</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Credit Card</option>
              <option value="cod">Cash on Delivery</option>
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="successful">Successful / Paid</option>
              <option value="pending">Pending Verification</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Showing {filtered.length} transactions
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Transaction Reference</th>
              <th>Order Ref</th>
              <th>Customer</th>
              <th>Gateway</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const gw = getGatewayBadge(t.gateway);
              const isSuccess = t.status === 'successful' || t.status === 'Paid';
              const isPending = t.status === 'pending' || t.status === 'Pending';

              return (
                <tr key={t.transactionReference || t.paymentId}>
                  <td style={{ fontWeight: 700, color: '#0071e3', fontFamily: 'monospace' }}>
                    {t.transactionReference}
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.orderNumber}</td>
                  <td>
                    <div>{t.customerName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{t.customerEmail}</div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: gw.bg,
                      color: gw.color,
                      textTransform: 'uppercase'
                    }}>
                      {gw.label}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`status-badge ${isSuccess ? 'published' : isPending ? 'draft' : 'cancelled'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '12px' }}>
                    {t.paymentDate ? String(t.paymentDate).slice(0, 10) : 'Today'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        className="icon-btn"
                        onClick={() => setSelectedTx(t)}
                        title="View Details"
                      >
                        <FiEye size={14} />
                      </button>

                      {isPending && (
                        <button
                          className="icon-btn"
                          style={{ color: '#16a34a' }}
                          onClick={() => handleVerifyPayment(t.paymentId, 'successful')}
                          title="Verify & Mark Paid"
                        >
                          <FiCheck size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '640px' }}>
            <div className="modal-header">
              <h3>Transaction Details</h3>
              <button className="close-btn" onClick={() => setSelectedTx(null)}>×</button>
            </div>
            <div className="modal-body" style={{ gap: '18px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Reference:</span>
                  <strong style={{ fontFamily: 'monospace', color: '#0071e3' }}>{selectedTx.transactionReference}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Order:</span>
                  <strong>{selectedTx.orderNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Customer:</span>
                  <span>{selectedTx.customerName} ({selectedTx.customerEmail})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Amount:</span>
                  <strong style={{ fontSize: '16px' }}>${Number(selectedTx.amount).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Gateway:</span>
                  <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{selectedTx.gateway}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Status:</span>
                  <span className={`status-badge ${selectedTx.status === 'successful' ? 'published' : 'draft'}`}>
                    {selectedTx.status}
                  </span>
                </div>
              </div>

              {selectedTx.paymentDetails && (
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 8px' }}>Gateway Metadata / Bank Verification</h4>
                  <pre style={{ fontSize: '11px', background: '#f8fafc', padding: '10px', borderRadius: '8px', overflowX: 'auto', margin: 0 }}>
                    {JSON.stringify(selectedTx.paymentDetails, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              {selectedTx.status !== 'successful' ? (
                <button
                  type="button"
                  className="primary-btn"
                  style={{ background: '#16a34a' }}
                  onClick={() => handleVerifyPayment(selectedTx.paymentId, 'successful')}
                >
                  ✓ Approve & Mark Paid
                </button>
              ) : <div></div>}
              <button type="button" className="secondary-btn" onClick={() => setSelectedTx(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
