import React, { useState } from 'react';
import { 
  FiSearch, FiMail, FiPhone, FiPlus, FiEye, 
  FiEdit2, FiTrash2, FiMapPin, FiShoppingBag, FiUserCheck 
} from 'react-icons/fi';

export default function Users({ orders = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Managed Customers / Users State
  const [users, setUsers] = useState([
    {
      id: 'USR-101',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      phone: '+1 (555) 234-5678',
      address: '123 Apple Blossom St, Cupertino, CA 95014',
      role: 'Customer',
      status: 'Active',
      joinedDate: '2025-11-12'
    },
    {
      id: 'USR-102',
      name: 'Sarah Connor',
      email: 's.connor@skyline.io',
      phone: '+1 (555) 987-6543',
      address: '456 Cyberdyne Way, Los Angeles, CA 90001',
      role: 'Customer',
      status: 'Active',
      joinedDate: '2026-01-20'
    },
    {
      id: 'USR-103',
      name: 'Michael Ross',
      email: 'mross@pearsonhardman.com',
      phone: '+1 (555) 456-7890',
      address: '789 Manhattan Ave, New York, NY 10021',
      role: 'VIP Customer',
      status: 'Active',
      joinedDate: '2026-03-15'
    },
    {
      id: 'USR-104',
      name: 'Jessica Pearson',
      email: 'jessica@pearson.law',
      phone: '+1 (555) 321-0987',
      address: '500 Park Avenue, New York, NY 10022',
      role: 'Customer',
      status: 'Inactive',
      joinedDate: '2026-04-02'
    }
  ]);

  const initialFormState = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'Customer',
    status: 'Active',
    joinedDate: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormState);

  // Synchronize metric calculations dynamically from the global Orders array
  const getUserMetrics = (email) => {
    const userOrders = orders.filter(
      o => o.email && o.email.toLowerCase() === email.toLowerCase()
    );

    const totalSpent = userOrders.reduce((sum, o) => {
      const subtotal = o.items.reduce((iSum, item) => iSum + (item.price * item.quantity), 0);
      return sum + subtotal + (o.shippingCost || 0);
    }, 0);

    return {
      ordersCount: userOrders.length,
      totalSpent,
      userOrders
    };
  };

  // Open Modal for Create or Edit
  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({ 
        ...initialFormState, 
        id: `USR-${Math.floor(100 + Math.random() * 900)}` 
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? formData : u));
    } else {
      setUsers([...users, formData]);
    }
    handleCloseModal();
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this customer profile?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="content-view">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Customer & User Management</h1>
          <p>Integrated directory tracking registered users, live order totals, and customer status.</p>
        </div>
        <button className="primary-btn" onClick={() => handleOpenModal()}>
          <FiPlus size={16} /> Add New Customer
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="filter-group">
            <div className="search-container" style={{ width: '300px' }}>
              <FiSearch size={16} />
              <input 
                type="text" 
                placeholder="Search name, email, or phone..." 
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Showing {filteredUsers.length} accounts
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact Details</th>
              <th>Account Type</th>
              <th>Total Orders</th>
              <th>Lifetime Spend</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const metrics = getUserMetrics(user.email);

              return (
                <tr key={user.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Joined {user.joinedDate}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#0071e3', fontWeight: 600, fontSize: '13px' }}>{user.email}</span>
                      <span style={{ color: '#64748b', fontSize: '12px' }}>{user.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge draft">{user.role}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {metrics.ordersCount} {metrics.ordersCount === 1 ? 'order' : 'orders'}
                  </td>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>
                    ${metrics.totalSpent.toLocaleString()}
                  </td>
                  <td>
                    <span className={`status-badge ${user.status === 'Active' ? 'published' : 'draft'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        className="icon-btn" 
                        onClick={() => setSelectedUser({ ...user, ...metrics })} 
                        title="View Profile & Orders"
                      >
                        <FiEye size={14} />
                      </button>
                      <button 
                        className="icon-btn" 
                        onClick={() => handleOpenModal(user)} 
                        title="Edit Customer"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button 
                        className="icon-btn" 
                        onClick={() => handleDeleteUser(user.id)} 
                        title="Delete Profile" 
                        style={{ color: '#ef4444' }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Customer Full Profile & Orders Modal */}
      {selectedUser && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '600px' }}>
            <div className="modal-header">
              <h3>Customer Profile & Activity</h3>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
            </div>

            <div className="modal-body" style={{ gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800 }}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{selectedUser.name}</h4>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Account ID: {selectedUser.id} • {selectedUser.role}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#fafafa', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Lifetime Spend</span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0071e3', marginTop: '4px' }}>
                    ${selectedUser.totalSpent.toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#fafafa', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Store Orders</span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                    {selectedUser.ordersCount} Completed
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiMail size={16} color="#0071e3" /> <strong>Email:</strong> {selectedUser.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiPhone size={16} color="#0071e3" /> <strong>Phone:</strong> {selectedUser.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiMapPin size={16} color="#0071e3" /> <strong>Address:</strong> {selectedUser.address || 'N/A'}
                </div>
              </div>

              {/* Linked Orders Overview */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Linked Orders History</h4>
                {selectedUser.userOrders.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedUser.userOrders.map(o => (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                        <div>
                          <strong style={{ color: '#0071e3' }}>{o.id}</strong> • {o.date}
                        </div>
                        <div style={{ fontWeight: 700 }}>
                          ${(o.items.reduce((s, i) => s + (i.price * i.quantity), 0) + (o.shippingCost || 0)).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', color: '#94a3b8', italic: 'true' }}>No recorded orders for this customer yet.</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="primary-btn" onClick={() => setSelectedUser(null)}>Close Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '520px' }}>
            <div className="modal-header">
              <h3>{editingUser ? 'Edit Customer Profile' : 'Add New Customer'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. John Appleseed" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="john@apple.com" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="+1 (555) 000-0000" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Account Role</label>
                    <select 
                      value={formData.role} 
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="Customer">Customer</option>
                      <option value="VIP Customer">VIP Customer</option>
                      <option value="Store Admin">Store Admin</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Shipping Address</label>
                  <input 
                    type="text" 
                    placeholder="Street Address, City, State, ZIP" 
                    value={formData.address} 
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                  />
                </div>

                <div className="form-group">
                  <label>Account Status</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="secondary-btn" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="primary-btn">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}