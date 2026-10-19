import React from 'react';
import { FiLogOut, FiShield, FiArrowLeft } from 'react-icons/fi';

export default function Logout({ onConfirmLogout, onCancel }) {
  const handleLogout = () => {
    // Clear any local storage tokens or session storage if used
    localStorage.removeItem('adminAuthToken');
    sessionStorage.clear();
    
    if (onConfirmLogout) {
      onConfirmLogout();
    } else {
      // Default fallback redirect or reload
      window.location.href = '/';
    }
  };

  return (
    <div className="content-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div className="modal-content" style={{ width: '460px', textAlign: 'center', margin: 'auto' }}>
        <div className="modal-header" style={{ justifyContent: 'center', position: 'relative' }}>
          <h3>Sign Out of Apple Admin</h3>
        </div>

        <div className="modal-body" style={{ alignItems: 'center', padding: '40px 32px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '8px' 
          }}>
            <FiLogOut size={28} />
          </div>

          <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Are you sure you want to exit?</h4>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', maxWidth: '320px' }}>
            You will need to re-authenticate with your administrator credentials and two-factor authentication to access the store database again.
          </p>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', marginTop: '10px' }}>
            <FiShield size={16} color="#10b981" />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>Active Secure Session Encrypted</span>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center', gap: '12px' }}>
          <button 
            type="button" 
            className="secondary-btn" 
            onClick={onCancel || (() => window.history.back())}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <FiArrowLeft size={14} /> Cancel
          </button>
          <button 
            type="button" 
            className="primary-btn" 
            onClick={handleLogout}
            style={{ flex: 1, background: '#ef4444', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)' }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}