import React, { useCallback, useEffect, useState } from "react";
import {
  FiSettings,
  FiSliders,
  FiShield,
  FiBell,
  FiDatabase,
  FiSave,
  FiLock,
  FiServer,
  FiCheckCircle,
  FiRefreshCw,
  FiAlertCircle,
  FiSun,
  FiMoon,
  FiCreditCard,
} from "react-icons/fi";



const API_URL = "http://localhost:5000/api";

const DEFAULTS = {
  store: {
    storeName: "Apple Store Online",
    contactEmail: "",
    contactPhone: "",
    currency: "USD ($)",
    country: "United States",
    address: "",
  },
  website: {
    announcementText: "",
    showAnnouncement: true,
    maintenanceMode: false,
    defaultTheme: "light",
  },
  notifications: {
    newOrders: true,
    paymentAlerts: true,
    lowStock: true,
    customerRegistrations: false,
  },
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("store");
  const [saveStatus, setSaveStatus] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    api: "Checking...",
    database: "Checking...",
  });

  const [storeSettings, setStoreSettings] = useState(DEFAULTS.store);
  const [websiteSettings, setWebsiteSettings] = useState(DEFAULTS.website);
  const [notifications, setNotifications] = useState(DEFAULTS.notifications);

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("admin-theme") === "dark";
  });

  const [gateways, setGateways] = useState([]);
  const [gatewaysLoading, setGatewaysLoading] = useState(false);

  const fetchGateways = async () => {
    setGatewaysLoading(true);
    try {
      const data = await request("/payments/admin/gateways");
      if (Array.isArray(data)) {
        setGateways(data);
      }
    } catch (err) {
      console.error("Failed to load gateways in settings:", err);
    } finally {
      setGatewaysLoading(false);
    }
  };

  const updateGatewaySetting = async (key, updates) => {
    try {
      await request(`/payments/admin/gateways/${key}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      showMessage(`Updated settings for '${key}'.`);
      fetchGateways();
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

const getToken = () => {
    return localStorage.getItem("adminToken") || localStorage.getItem("token");
  };

  const request = async (path, options = {}) => {
    const token = getToken();

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed (${response.status})`
      );
    }

    return data;
  };

  const showMessage = (message, type = "success") => {
    setSaveStatus(message);
    setStatusType(type);
  };

  const loadSettings = useCallback(async () => {
    setLoading(true);

    try {
      const data = await request("/settings");

      if (data.store) {
        setStoreSettings({
          ...DEFAULTS.store,
          ...data.store,
        });
      }

      if (data.website) {
        setWebsiteSettings({
          ...DEFAULTS.website,
          ...data.website,
        });
      }

      if (data.notifications) {
        setNotifications({
          ...DEFAULTS.notifications,
          ...data.notifications,
        });
      }
    } catch (error) {
      console.error("Settings load error:", error);
      showMessage(
        `Could not load saved settings: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    document.documentElement.dataset.adminTheme = darkMode
      ? "dark"
      : "light";

    localStorage.setItem("admin-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const saveSection = async (section, values) => {
    setSaving(true);
    setSaveStatus("");

    try {
      await request(`/settings/${section}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      showMessage(
        `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully.`
      );
    } catch (error) {
      console.error("Settings save error:", error);
      showMessage(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } =
      securitySettings;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("Fill in all password fields.", "error");
      return;
    }

    if (newPassword.length < 8) {
      showMessage("New password must contain at least 8 characters.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("New passwords do not match.", "error");
      return;
    }

    // This requires a dedicated, secure backend endpoint.
    setSaving(true);

    try {
      await request("/settings/security/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      setSecuritySettings((previous) => ({
        ...previous,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      showMessage("Password updated successfully.");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const checkSystem = async () => {
    setSystemStatus({ api: "Checking...", database: "Checking..." });

    try {
      const result = await request("/health");

      setSystemStatus({
        api: "Online",
        database:
          result.database === "connected"
            ? "Connected"
            : result.database || "API responded",
      });
    } catch (error) {
      console.error("System health check failed:", error);

      setSystemStatus({
        api: "Unavailable",
        database: "Not verified",
      });
    }
  };

  useEffect(() => {
    if (activeTab === "system") {
      checkSystem();
    } else if (activeTab === "payments") {
      fetchGateways();
    }
  }, [activeTab]);

  const tabs = [
    { id: "store", label: "Store Settings", icon: <FiSettings /> },
    { id: "payments", label: "Payment Gateways", icon: <FiCreditCard /> },
    { id: "website", label: "Website Config", icon: <FiSliders /> },
    { id: "security", label: "Security & Access", icon: <FiShield /> },
    { id: "notifications", label: "Notifications", icon: <FiBell /> },
    { id: "system", label: "System & Database", icon: <FiDatabase /> },
  ];

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid var(--settings-border, #d1d5db)",
    borderRadius: "9px",
    background: "var(--settings-input-bg, #fff)",
    color: "var(--settings-text, #111827)",
    boxSizing: "border-box",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  };

  const cardStyle = {
    padding: "24px",
    border: "1px solid var(--settings-border, #e5e7eb)",
    borderRadius: "14px",
    background: "var(--settings-card-bg, #fff)",
    color: "var(--settings-text, #111827)",
  };

  const saveButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 17px",
    border: "none",
    borderRadius: "9px",
    background: "#111827",
    color: "#fff",
    cursor: saving ? "wait" : "pointer",
    opacity: saving ? 0.65 : 1,
  };

  const toggleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 0",
  };

  return (
    <div className="content-view settings-page">
      <div
        className="view-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>Admin Settings</h1>
          <p>
            Manage store preferences, website configuration, security,
            notifications, and system health.
          </p>
        </div>

        <button
          type="button"
          className="secondary-btn"
          onClick={() => setDarkMode((previous) => !previous)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "9px",
          }}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </div>

      {saveStatus && (
        <div
          role="status"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "13px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            color: statusType === "error" ? "#b91c1c" : "#166534",
            background: statusType === "error" ? "#fef2f2" : "#dcfce7",
          }}
        >
          {statusType === "error" ? <FiAlertCircle /> : <FiCheckCircle />}
          {saveStatus}
          <button
            type="button"
            onClick={() => setSaveStatus("")}
            style={{ marginLeft: "auto", background: "transparent", border: 0, cursor: "pointer" }}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div
        role="tablist"
        aria-label="Settings sections"
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          borderBottom: "1px solid var(--settings-border, #e5e7eb)",
          paddingBottom: "12px",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
              padding: "10px 13px",
              borderRadius: "9px",
              border: "1px solid",
              borderColor: activeTab === tab.id ? "#111827" : "#d1d5db",
              background: activeTab === tab.id ? "#111827" : "transparent",
              color: activeTab === tab.id ? "#fff" : "var(--settings-text, #374151)",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={cardStyle}>Loading saved settings...</div>
      ) : (
        <>
          {activeTab === "store" && (
            <section style={cardStyle}>
              <h2>General & Store Information</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                  gap: "18px",
                  marginTop: "20px",
                }}
              >
                <label style={fieldStyle}>
                  Store Name
                  <input
                    style={inputStyle}
                    value={storeSettings.storeName}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, storeName: e.target.value })
                    }
                  />
                </label>

                <label style={fieldStyle}>
                  Contact Email
                  <input
                    type="email"
                    style={inputStyle}
                    value={storeSettings.contactEmail}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, contactEmail: e.target.value })
                    }
                  />
                </label>

                <label style={fieldStyle}>
                  Contact Phone
                  <input
                    style={inputStyle}
                    value={storeSettings.contactPhone}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, contactPhone: e.target.value })
                    }
                  />
                </label>

                <label style={fieldStyle}>
                  Default Currency
                  <select
                    style={inputStyle}
                    value={storeSettings.currency}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, currency: e.target.value })
                    }
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="ETB (Br)">ETB (Br)</option>
                  </select>
                </label>

                <label style={fieldStyle}>
                  Country
                  <input
                    style={inputStyle}
                    value={storeSettings.country}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, country: e.target.value })
                    }
                  />
                </label>

                <label style={fieldStyle}>
                  Business Address
                  <input
                    style={inputStyle}
                    value={storeSettings.address}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, address: e.target.value })
                    }
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                <button
                  type="button"
                  style={saveButtonStyle}
                  disabled={saving}
                  onClick={() => saveSection("store", storeSettings)}
                >
                  <FiSave /> {saving ? "Saving..." : "Save Store Changes"}
                </button>
              </div>
            </section>
          )}

          {activeTab === "payments" && (
            <section style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h2>Payment Gateways & Providers</h2>
                  <p>Configure which payment methods are available to customers at checkout, toggle sandbox test modes, and update instructions.</p>
                </div>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={fetchGateways}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FiRefreshCw size={14} className={gatewaysLoading ? "spin" : ""} /> Refresh
                </button>
              </div>

              {gatewaysLoading && <p>Loading gateway configurations...</p>}

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
                {gateways.map((gw) => (
                  <div
                    key={gw.gatewayKey}
                    style={{
                      background: "var(--settings-bg, #f8fafc)",
                      border: "1px solid var(--settings-border, #e2e8f0)",
                      borderRadius: "14px",
                      padding: "20px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <strong style={{ fontSize: "16px", color: "var(--settings-text, #0f172a)" }}>{gw.name}</strong>
                          {gw.badge && (
                            <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", background: "#e0f2fe", color: "#0369a1" }}>
                              {gw.badge}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>{gw.description}</p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={gw.isActive}
                            onChange={(e) => updateGatewaySetting(gw.gatewayKey, { isActive: e.target.checked })}
                          />
                          <strong>{gw.isActive ? "Active in Store" : "Disabled"}</strong>
                        </label>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #e2e8f0" }}>
                      <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", marginBottom: "8px" }}>
                          <input
                            type="checkbox"
                            checked={gw.isTestMode}
                            onChange={(e) => updateGatewaySetting(gw.gatewayKey, { isTestMode: e.target.checked })}
                          />
                          <span>Sandbox / Test Mode (Safe Testing)</span>
                        </label>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          Mode: <strong style={{ color: gw.isTestMode ? "#b45309" : "#166534" }}>{gw.isTestMode ? "Sandbox (Test)" : "Live Production"}</strong>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "4px" }}>
                          Customer Instructions:
                        </label>
                        <input
                          style={{ ...inputStyle, fontSize: "12px", padding: "8px 10px" }}
                          defaultValue={gw.instructions || ""}
                          onBlur={(e) => updateGatewaySetting(gw.gatewayKey, { instructions: e.target.value })}
                          placeholder="Instructions displayed to customer..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "website" && (
            <section style={cardStyle}>
              <h2>Global Website Configuration</h2>

              <label style={{ ...fieldStyle, marginTop: "20px" }}>
                Announcement Banner Text
                <input
                  style={inputStyle}
                  value={websiteSettings.announcementText}
                  onChange={(e) =>
                    setWebsiteSettings({
                      ...websiteSettings,
                      announcementText: e.target.value,
                    })
                  }
                />
              </label>

              <label style={toggleStyle}>
                <input
                  type="checkbox"
                  checked={websiteSettings.showAnnouncement}
                  onChange={(e) =>
                    setWebsiteSettings({
                      ...websiteSettings,
                      showAnnouncement: e.target.checked,
                    })
                  }
                />
                Show announcement banner on the storefront
              </label>

              <label style={toggleStyle}>
                <input
                  type="checkbox"
                  checked={websiteSettings.maintenanceMode}
                  onChange={(e) =>
                    setWebsiteSettings({
                      ...websiteSettings,
                      maintenanceMode: e.target.checked,
                    })
                  }
                />
                Enable maintenance mode
              </label>

              <label style={{ ...fieldStyle, maxWidth: "300px", marginTop: "15px" }}>
                Default Admin Theme
                <select
                  style={inputStyle}
                  value={websiteSettings.defaultTheme}
                  onChange={(e) =>
                    setWebsiteSettings({
                      ...websiteSettings,
                      defaultTheme: e.target.value,
                    })
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                <button
                  type="button"
                  style={saveButtonStyle}
                  disabled={saving}
                  onClick={() => saveSection("website", websiteSettings)}
                >
                  <FiSave /> {saving ? "Saving..." : "Save Website Config"}
                </button>
              </div>
            </section>
          )}

          {activeTab === "security" && (
            <section style={cardStyle}>
              <h2>Administrator Security</h2>
              <p>Update the administrator password securely.</p>

              <div style={{ ...fieldStyle, maxWidth: "480px", marginTop: "20px" }}>
                <label style={fieldStyle}>
                  Current Password
                  <input
                    type="password"
                    autoComplete="current-password"
                    style={inputStyle}
                    value={securitySettings.currentPassword}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </label>

                <label style={fieldStyle}>
                  New Password
                  <input
                    type="password"
                    autoComplete="new-password"
                    style={inputStyle}
                    value={securitySettings.newPassword}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </label>

                <label style={fieldStyle}>
                  Confirm New Password
                  <input
                    type="password"
                    autoComplete="new-password"
                    style={inputStyle}
                    value={securitySettings.confirmPassword}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <p style={{ color: "#b45309", marginTop: "18px" }}>
                Password updates require the dedicated backend endpoint
                <code> PUT /api/settings/security/password</code>. Do not store
                passwords as plain text in app_settings.
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <button
                  type="button"
                  style={saveButtonStyle}
                  disabled={saving}
                  onClick={updatePassword}
                >
                  <FiLock /> {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </section>
          )}

          {activeTab === "notifications" && (
            <section style={cardStyle}>
              <h2>Notification Preferences</h2>
              <p>Save which types of events should trigger admin alerts.</p>

              {[
                ["newOrders", "Notify me when a new order is placed"],
                ["paymentAlerts", "Notify me about payment and refund events"],
                ["lowStock", "Alert when product inventory is low"],
                ["customerRegistrations", "Notify me about new customer registrations"],
              ].map(([key, label]) => (
                <label key={key} style={toggleStyle}>
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        [key]: e.target.checked,
                      })
                    }
                  />
                  {label}
                </label>
              ))}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                <button
                  type="button"
                  style={saveButtonStyle}
                  disabled={saving}
                  onClick={() => saveSection("notifications", notifications)}
                >
                  <FiSave /> {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </section>
          )}

          {activeTab === "system" && (
            <section style={cardStyle}>
              <h2>System & Database Health</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "16px",
                  marginTop: "20px",
                }}
              >
                <div style={{ padding: "18px", border: "1px solid #e5e7eb", borderRadius: "12px" }}>
                  <FiServer size={22} />
                  <p>Backend API</p>
                  <strong>{systemStatus.api}</strong>
                </div>

                <div style={{ padding: "18px", border: "1px solid #e5e7eb", borderRadius: "12px" }}>
                  <FiDatabase size={22} />
                  <p>MySQL Database</p>
                  <strong>{systemStatus.database}</strong>
                </div>
              </div>

              <p style={{ marginTop: "18px", color: "#6b7280" }}>
                Health information is only accurate when your backend health
                endpoint reports the actual database connection status.
              </p>

              <button
                type="button"
                className="secondary-btn"
                onClick={checkSystem}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  marginTop: "12px",
                }}
              >
                <FiRefreshCw /> Check System Again
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}
