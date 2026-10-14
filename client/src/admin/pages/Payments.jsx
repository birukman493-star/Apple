import React from 'react';
import { FiCreditCard, FiDollarSign, FiArrowUpRight } from 'react-icons/fi';

export default function Payments() {
  return (
    <div className="content-view">
      <div className="view-header">
        <h1>Modern Payment Gateway Analytics</h1>
        <p>Secure transaction tracking, gateway distributions, and payout settlements.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon blue"><FiDollarSign size={22} /></div>
            <span className="badge-pill success">Secure 256-bit</span>
          </div>
          <div className="metric-title">Processed Volume</div>
          <div className="metric-value">$1,248,500</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon green"><FiCreditCard size={22} /></div>
            <span className="badge-pill success">99.8% Success</span>
          </div>
          <div className="metric-title">Apple Pay Transactions</div>
          <div className="metric-value">842</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon purple"><FiArrowUpRight size={22} /></div>
            <span className="badge-pill success">Instant Payout</span>
          </div>
          <div className="metric-title">Net Settlement</div>
          <div className="metric-value">$1,192,400</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Recent Gateway Transactions</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Gateway</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700 }}>TXN-88391</td>
              <td>Apple Pay</td>
              <td>David Miller</td>
              <td style={{ fontWeight: 700 }}>$1,599.00</td>
              <td><span className="status-badge published">Successful</span></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>TXN-88390</td>
              <td>Credit Card (Visa ending 4242)</td>
              <td>Emma Watson</td>
              <td style={{ fontWeight: 700 }}>$249.00</td>
              <td><span className="status-badge published">Successful</span></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>TXN-88389</td>
              <td>Apple Pay</td>
              <td>Chris Evans</td>
              <td style={{ fontWeight: 700 }}>$999.00</td>
              <td><span className="status-badge published">Successful</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}