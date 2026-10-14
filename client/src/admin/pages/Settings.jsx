import React, { useState } from 'react';
import { 
  FiSettings, FiSliders, FiShield, FiBell, FiDatabase, 
  FiSave, FiLock, FiServer, FiCheckCircle, FiRefreshCw, FiAlertCircle 
} from 'react-icons/fi';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('store');
  const [saveStatus, setSaveStatus] = useState('');

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Apple Store Online',
    contactEmail: 'admin@apple.com',
    contactPhone: '+1 (800) 692-7753',
    currency: 'USD ($)',
    country: 'United States',
    address: 'One Apple Park Way, Cupertino, CA 95014'
  });

  // Website Global Settings State
  const [websiteSettings, setWebsiteSettings] = useState({
    announcementText: 'Get $200–$650 in credit when you trade in iPhone 11 or higher.',
    showAnnouncement: true,
    maintenanceMode: false,
    defaultTheme: 'light'
  });

  // Security State
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: true
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    newOrders: true,
    paymentAlerts: true,
    lowStock: true,
    customerRegistrations: false
  });

  const handleSave = (sectionName) => {
    setSaveStatus(`${sectionName} saved successfully!`);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="content-view">
      <div className="view-header">
        <h1>Admin Settings</h1>
        <p>Manage your store preferences, global website configurations, security, and system health.</p>
      </div>

      {saveStatus && (
        <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiCheckCircle size={16} /> {saveStatus}
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'store', label: 'Store Settings', icon: <FiSettings size={15} /> },
          { id: 'website', label: 'Website Config', icon: <FiSliders size={15} /> },
          { id: 'security', label: 'Security & Access', icon: <FiShield size={15} /> },
          { id: 'notifications', label: 'Notifications', icon: <FiBell size={15} /> },
          { id: 'system', label: 'System & Database', icon: <FiDatabase size={15} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`primary-btn ${activeTab === tab.id ? '' : 'secondary-btn'}`}
            style={{ 
              height: '38px', 
              background: activeTab === tab.id ? '#0f172a' : '#ffffff', 
              color: activeTab === tab.id ? '#ffffff' : '#334155',
              borderColor: activeTab === tab.id ? '#0f172a' : '#cbd5e1'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Store / General Settings */}
      {activeTab === 'store' && (
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>General & Store Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Store Name</label>
              <input 
                type="text" 
                value={storeSettings.storeName}
                onChange={e => setStoreSettings({...storeSettings, storeName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input 
                type="email" 
                value={storeSettings.contactEmail}
                onChange={e => setStoreSettings({...storeSettings, contactEmail: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input 
                type="text" 
                value={storeSettings.contactPhone}
                onChange={e => setStoreSettings({...storeSettings, contactPhone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Default Currency</label>
              <select 
                value={storeSettings.currency}
                onChange={e => setStoreSettings({...storeSettings, currency: e.target.value})}
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Business Address</label>
              <input 
                type="text" 
                value={storeSettings.address}
                onChange={e => setStoreSettings({...storeSettings, address: e.target.value})}
              />
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="primary-btn" onClick={() => handleSave('Store Settings')}>
              <FiSave size={15} /> Save Store Changes
            </button>
          </div>
        </div>
      )}

      {/* 2. Website Settings */}
      {activeTab === 'website' && (
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Global Website Configuration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Global Announcement Banner Text</label>
              <input 
                type="text" 
                value={websiteSettings.announcementText}
                onChange={e => setWebsiteSettings({...websiteSettings, announcementText: e.target.value})}
              />
            </div>
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="announcementToggle"
                checked={websiteSettings.showAnnouncement}
                onChange={e => setWebsiteSettings({...websiteSettings, showAnnouncement: e.target.checked})}
              />
              <label htmlFor="announcementToggle" style={{ cursor: 'pointer' }}>Show Announcement Banner on Store Header</label>
            </div>
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="maintenanceToggle"
                checked={websiteSettings.maintenanceMode}
                onChange={e => setWebsiteSettings({...websiteSettings, maintenanceMode: e.target.checked})}
              />
              <label htmlFor="maintenanceToggle" style={{ cursor: 'pointer', color: websiteSettings.maintenanceMode ? '#dc2626' : 'inherit' }}>
                Enable Website Maintenance Mode (Locks public customer access)
              </label>
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="primary-btn" onClick={() => handleSave('Website Settings')}>
              <FiSave size={15} /> Save Website Config
            </button>
          </div>
        </div>
      )}

      {/* 3. Security & Admin Account */}
      {activeTab === 'security' && (
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Administrator Security & Password</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={securitySettings.currentPassword}
                onChange={e => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={securitySettings.newPassword}
                onChange={e => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={securitySettings.confirmPassword}
                onChange={e => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})}
              />
            </div>
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="tfaToggle"
                checked={securitySettings.twoFactorAuth}
                onChange={e => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
              />
              <label htmlFor="tfaToggle" style={{ cursor: 'pointer' }}>Require Two-Factor Authentication (2FA) for Admin Login</label>
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="secondary-btn" style={{ color: '#dc2626', borderColor: '#fca5a5' }} onClick={() => alert('Signed out of all other active sessions.')}>
              <FiLock size={14} /> Sign out of all other sessions
            </button>
            <button className="primary-btn" onClick={() => handleSave('Security Settings')}>
              <FiSave size={15} /> Update Password
            </button>
          </div>
        </div>
      )}

      {/* 4. Notifications */}
      {activeTab === 'notifications' && (
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Email & Dashboard Alert Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="notif1"
                checked={notifications.newOrders}
                onChange={e => setNotifications({...notifications, newOrders: e.target.checked})}
              />
              <label htmlFor="notif1" style={{ cursor: 'pointer' }}>Notify me immediately when a new customer order is placed</label>
            </div>
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="notif2"
                checked={notifications.paymentAlerts}
                onChange={e => setNotifications({...notifications, paymentAlerts: e.target.checked})}
              />
              <label htmlFor="notif2" style={{ cursor: 'pointer' }}>Send payment gateway transaction & refund alerts</label>
            </div>
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="notif3"
                checked={notifications.lowStock}
                onChange={e => setNotifications({...notifications, lowStock: e.target.checked})}
              />
              <label htmlFor="notif3" style={{ cursor: 'pointer' }}>Alert when product inventory falls below 10 units</label>
            </div>
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="notif4"
                checked={notifications.customerRegistrations}
                onChange={e => setNotifications({...notifications, customerRegistrations: e.target.checked})}
              />
              <label htmlFor="notif4" style={{ cursor: 'pointer' }}>Email digest on new customer registrations</label>
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="primary-btn" onClick={() => handleSave('Notification Preferences')}>
              <FiSave size={15} /> Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* 5. System & Database Health */}
      {activeTab === 'system' && (
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>System Health & MySQL Database</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>Backend API Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '14px' }}>
                <FiCheckCircle size={16} /> Online & Responsive
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>MySQL Database Connection</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '14px' }}>
                <FiServer size={16} /> Connected (Pool Active)
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>Last Successful Backup</div>
              <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px' }}>
                Today, 04:00 AM
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <button className="primary-btn" onClick={() => alert('Database backup generated successfully.')}>
              <FiDatabase size={15} /> Backup Database Now
            </button>
            <button className="secondary-btn" onClick={() => alert('System cache cleared.')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiRefreshCw size={14} /> Clear System Cache
            </button>
          </div>
        </div>
      )}
    </div>
  );
}