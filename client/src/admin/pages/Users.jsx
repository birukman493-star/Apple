import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiTrash2, FiUser } from 'react-icons/fi';

const API_URL = "http://localhost:5000/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem("adminToken") || localStorage.getItem("token");

  // Load users from MySQL via Express API
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load users from database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Delete user handler
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    
    setError('');
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/auth/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }

      // Refresh list
      loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
    }
  };

  // Filter logic for search bar
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  return (
    <div className="content-view">
      <div className="view-header">
        <h1>User Management</h1>
        <p>View, manage, and audit registered customer and administrator accounts dynamically.</p>
      </div>

      {error && (
        <div role="alert" style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', marginBottom: '16px', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <div className="search-container" style={{ width: '280px' }}>
            <FiSearch size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            {loading ? 'Loading...' : `Total Users: ${filteredUsers.length}`}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Registered Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  Loading users from database...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 700, color: '#3b82f6' }}>{user.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#0f172a' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <FiUser size={14} />
                      </div>
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.role === 'admin' ? 'published' : 'draft'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '12px' }}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="icon-btn" 
                      onClick={() => handleDeleteUser(user.id)} 
                      title="Delete User"
                      style={{ color: '#ef4444' }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}