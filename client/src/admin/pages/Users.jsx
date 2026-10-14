// Users.jsx
import React from 'react';
export default function Users() {
  return (
    <div className="content-view">
      <div className="view-header">
        <h1>Customer Directory</h1>
        <p>Manage registered Apple Store user accounts and permissions.</p>
      </div>
      <div className="table-container">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td style={{ fontWeight: 600 }}>Administrator</td><td>admin@apple.com</td><td>Super Admin</td><td><span className="status-badge published">Active</span></td></tr>
            <tr><td style={{ fontWeight: 600 }}>John Doe</td><td>john@example.com</td><td>Customer</td><td><span className="status-badge published">Active</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
