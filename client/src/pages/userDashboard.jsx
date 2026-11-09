import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Key,
  Lock,
  User,
  CreditCard,
  Truck,
  Package,
  Sparkles,
  Users,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  ChevronRight,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  Edit3,
  Trash2,
  Plus,
  Download,
  ExternalLink,
  Copy,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Calendar,
  Info,
  Clock,
  ArrowRight,
  Printer,
  MapPin,
  Share2,
} from "lucide-react";
import "./userDashbaord.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial active tab based on path
  const getTabFromPath = (pathname) => {
    if (pathname.includes("/personal-information") || pathname.includes("/personal")) return "personal";
    if (pathname.includes("/payment-shipping") || pathname.includes("/payment")) return "payment";
    if (pathname.includes("/subscriptions")) return "subscriptions";
    if (pathname.includes("/family")) return "family";
    if (pathname.includes("/devices")) return "devices";
    if (pathname.includes("/orders")) return "orders";
    if (pathname.includes("/privacy")) return "privacy";
    return "security";
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    const newTab = getTabFromPath(location.pathname);
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  // Handle tab switch and update URL
  const handleTabChange = (tabId, path) => {
    setActiveTab(tabId);
    navigate(path, { replace: true });
  };

  // User State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : {
      id: "demo-user",
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.johnson@icloud.com",
      phone: "+1 (408) 555-0199",
      birthday: "1994-08-15",
      country: "United States",
      language: "English (US)",
      twoFactorEnabled: true,
      shippingAddress: "1 Apple Park Way\nCupertino, CA 95014",
      billingAddress: "1 Apple Park Way\nCupertino, CA 95014",
    };
  });

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Support PIN countdown timer
  const [supportPin, setSupportPin] = useState("7392");
  const [pinTimeLeft, setPinTimeLeft] = useState(1794); // 29m 54s

  useEffect(() => {
    const timer = setInterval(() => {
      setPinTimeLeft((prev) => (prev > 0 ? prev - 1 : 1800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPinTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleGenerateNewPin = () => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setSupportPin(newPin);
    setPinTimeLeft(1800);
    showToast(`New Support PIN generated: ${newPin}`);
  };

  // App-Specific Passwords State
  const [appPasswords, setAppPasswords] = useState([
    { id: 1, name: "Thunderbird on Mac", created: "Oct 12, 2026", code: "kmdw-pxqr-bztl-jvma" },
    { id: 2, name: "Spark Mail iOS", created: "Sep 28, 2026", code: "vptc-hrny-fgas-weui" },
  ]);
  const [showAppPasswordModal, setShowAppPasswordModal] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState(null);

  const handleGenerateAppPassword = (e) => {
    e.preventDefault();
    if (!newAppName.trim()) return;
    const randomSegment = () => Math.random().toString(36).substring(2, 6);
    const generated = `${randomSegment()}-${randomSegment()}-${randomSegment()}-${randomSegment()}`;
    const newEntry = {
      id: Date.now(),
      name: newAppName.trim(),
      created: "Today",
      code: generated,
    };
    setAppPasswords([newEntry, ...appPasswords]);
    setGeneratedPassword(generated);
  };

  const handleRevokeAppPassword = (id, name) => {
    setAppPasswords(appPasswords.filter((p) => p.id !== id));
    showToast(`Password for "${name}" revoked.`);
  };

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    try {
      if (token) {
        const res = await fetch("/api/auth/change-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update password.");
        }
      }
      showToast("Password updated successfully.");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message || "Unable to change password. Please verify current password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Personal Information Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    phone: currentUser.phone || "",
    birthday: currentUser.birthday || "",
    country: currentUser.country || "United States",
    language: currentUser.language || "English (US)",
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const updated = { ...currentUser, ...profileForm };

    try {
      if (token) {
        const res = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to save profile.");
      }
      setCurrentUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      showToast("Personal details updated successfully.");
      setShowProfileModal(false);
    } catch (err) {
      showToast(err.message || "Saved locally.", "info");
      setCurrentUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setShowProfileModal(false);
    }
  };

  // Communication Preferences State
  const [commPrefs, setCommPrefs] = useState({
    announcements: true,
    recommendations: true,
    newsletters: false,
  });

  const handleTogglePref = (key) => {
    setCommPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast("Communication preferences saved.");
      return next;
    });
  };

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "apple-card",
      type: "Apple Card",
      cardType: "mastercard",
      last4: "4022",
      holder: `${currentUser.firstName || 'Alex'} ${currentUser.lastName || 'Johnson'}`,
      expiry: "09/29",
      isDefault: true,
      billingAddress: currentUser.billingAddress || "1 Apple Park Way, Cupertino, CA 95014",
    },
    {
      id: "visa-card",
      type: "Visa",
      cardType: "visa",
      last4: "8831",
      holder: `${currentUser.firstName || 'Alex'} ${currentUser.lastName || 'Johnson'}`,
      expiry: "04/28",
      isDefault: false,
      billingAddress: currentUser.billingAddress || "1 Apple Park Way, Cupertino, CA 95014",
    },
  ]);

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    holder: `${currentUser.firstName || 'Alex'} ${currentUser.lastName || 'Johnson'}`,
    expiry: "",
    cvv: "",
    isDefault: false,
  });

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.number || newCard.number.length < 15) {
      showToast("Please enter a valid card number.", "error");
      return;
    }
    const cleanNum = newCard.number.replace(/\s+/g, "");
    const last4 = cleanNum.slice(-4);
    const cardType = cleanNum.startsWith("4") ? "visa" : cleanNum.startsWith("5") ? "mastercard" : "apple";

    const card = {
      id: `card-${Date.now()}`,
      type: cardType === "visa" ? "Visa" : "Mastercard",
      cardType,
      last4,
      holder: newCard.holder || "Apple Customer",
      expiry: newCard.expiry || "12/28",
      isDefault: newCard.isDefault || paymentMethods.length === 0,
      billingAddress: currentUser.billingAddress || "1 Apple Park Way, Cupertino, CA 95014",
    };

    if (card.isDefault) {
      setPaymentMethods(paymentMethods.map((c) => ({ ...c, isDefault: false })).concat(card));
    } else {
      setPaymentMethods([...paymentMethods, card]);
    }

    setShowAddCardModal(false);
    setNewCard({ number: "", holder: "", expiry: "", cvv: "", isDefault: false });
    showToast(`Added card ending in ${last4}.`);
  };

  const handleSetDefaultCard = (id) => {
    setPaymentMethods(paymentMethods.map((c) => ({ ...c, isDefault: c.id === id })));
    showToast("Default payment method updated.");
  };

  const handleRemoveCard = (id) => {
    if (paymentMethods.length <= 1) {
      showToast("You must keep at least one payment method on file.", "error");
      return;
    }
    setPaymentMethods(paymentMethods.filter((c) => c.id !== id));
    showToast("Payment method removed.");
  };

  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    recipient: `${currentUser.firstName || 'Alex'} ${currentUser.lastName || 'Johnson'}`,
    street: "1 Apple Park Way",
    apartment: "Suite 400",
    city: "Cupertino",
    state: "CA",
    zip: "95014",
    country: "United States",
    phone: currentUser.phone || "+1 (408) 555-0199",
  });
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleSaveShippingAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const fullAddr = `${shippingAddress.street}, ${shippingAddress.apartment ? shippingAddress.apartment + ", " : ""}${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}`;

    try {
      if (token) {
        await fetch("/api/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ shippingAddress: fullAddr }),
        });
      }
    } catch {
      // offline fallback
    }

    showToast("Shipping address updated.");
    setShowAddressModal(false);
  };

  // Subscriptions State
  const [subscriptions, setSubscriptions] = useState([
    {
      id: "apple-one",
      name: "Apple One Premier",
      tier: "Premier",
      price: "$37.95/month",
      cycle: "Monthly",
      renewalDate: "November 14, 2026",
      status: "Active",
      icon: "sparkles",
      features: [
        "Apple Music (Family - up to 6 members)",
        "Apple TV+ (Originals & Live Sports)",
        "Apple Arcade (200+ ad-free games)",
        "iCloud+ (2 TB Storage Pool)",
        "Apple Fitness+ (Workouts & Meditations)",
        "Apple News+ (Leading publications & audio)",
      ],
    },
    {
      id: "apple-tv-standalone",
      name: "Apple TV+",
      tier: "Standard",
      price: "Included in Apple One",
      cycle: "Monthly",
      renewalDate: "Renews with Apple One",
      status: "Active",
      icon: "tv",
      features: ["4K HDR streaming", "Share with up to 5 family members", "Download and watch offline"],
    },
  ]);

  const [selectedSubForManage, setSelectedSubForManage] = useState(null);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);

  // Family Sharing State
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: "f-1",
      name: `${currentUser.firstName || 'Alex'} ${currentUser.lastName || 'Johnson'}`,
      email: currentUser.email,
      role: "Organizer",
      isYou: true,
      avatarColor: "#0071e3",
      usedStorage: "420 GB",
    },
    {
      id: "f-2",
      name: "Sarah Johnson",
      email: "sarah.j@icloud.com",
      role: "Parent / Guardian",
      isYou: false,
      avatarColor: "#ff2d55",
      usedStorage: "230 GB",
    },
    {
      id: "f-3",
      name: "Leo Johnson",
      email: "leo.j@icloud.com",
      role: "Teen",
      isYou: false,
      avatarColor: "#34c759",
      usedStorage: "112 GB",
    },
    {
      id: "f-4",
      name: "Emma Johnson",
      email: "emma.j@icloud.com",
      role: "Child",
      isYou: false,
      avatarColor: "#ff9500",
      usedStorage: "80 GB",
    },
  ]);

  const [familyToggles, setFamilyToggles] = useState({
    icloud: true,
    purchases: true,
    music: true,
    askToBuy: true,
    screenTime: true,
    location: true,
  });

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Adult");

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember = {
      id: `f-${Date.now()}`,
      name: inviteEmail.split("@")[0].replace(".", " "),
      email: inviteEmail.trim(),
      role: inviteRole,
      isYou: false,
      avatarColor: "#af52de",
      usedStorage: "0 GB",
    };
    setFamilyMembers([...familyMembers, newMember]);
    setShowInviteModal(false);
    setInviteEmail("");
    showToast(`Invitation sent to ${inviteEmail}.`);
  };

  // Devices State
  const [devices, setDevices] = useState([
    {
      id: "dev-mac",
      name: "MacBook Pro 16\"",
      model: "MacBook Pro (16-inch, Nov 2024, M4 Max)",
      os: "macOS Sequoia 15.1",
      serial: "C02GN784MD6R",
      imei: "N/A",
      lastActive: "Active now",
      findMy: "Find My is enabled (Cupertino, CA)",
      coverage: "AppleCare+ active until November 2027",
      type: "laptop",
    },
    {
      id: "dev-iphone",
      name: "iPhone 16 Pro Max",
      model: "iPhone 16 Pro Max (512GB, Desert Titanium)",
      os: "iOS 18.1",
      serial: "F2LX99420PLK",
      imei: "354890123894721",
      lastActive: "12 minutes ago",
      findMy: "Find My is enabled (Cupertino, CA)",
      coverage: "AppleCare+ with Theft and Loss active",
      type: "phone",
    },
    {
      id: "dev-ipad",
      name: "iPad Pro 13\"",
      model: "iPad Pro (13-inch, M4, Space Black)",
      os: "iPadOS 18.0",
      serial: "DLXH2947KMN3",
      imei: "N/A",
      lastActive: "Yesterday",
      findMy: "Find My is enabled",
      coverage: "Limited Warranty active",
      type: "tablet",
    },
    {
      id: "dev-watch",
      name: "Apple Watch Ultra 2",
      model: "Apple Watch Ultra 2 (Titanium Case, 49mm)",
      os: "watchOS 11.0",
      serial: "W987KL2411P",
      imei: "N/A",
      lastActive: "Active now",
      findMy: "Find My is enabled",
      coverage: "AppleCare+ active",
      type: "watch",
    },
    {
      id: "dev-airpods",
      name: "AirPods Pro (2nd gen)",
      model: "AirPods Pro with MagSafe Case (USB-C)",
      os: "Firmware 7A305",
      serial: "H37K98PL021",
      imei: "N/A",
      lastActive: "2 hours ago",
      findMy: "Find My network enabled",
      coverage: "AppleCare+ active",
      type: "headphones",
    },
  ]);

  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleRemoveDevice = (id, name) => {
    setDevices(devices.filter((d) => d.id !== id));
    setSelectedDevice(null);
    showToast(`Removed "${name}" from Apple Account.`);
  };

  // Sync profile from server on mount
  useEffect(() => {
    const syncProfile = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (!token) return;
      try {
        const res = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const merged = { ...currentUser, ...data };
          setCurrentUser(merged);
          localStorage.setItem("user", JSON.stringify(merged));
        }
      } catch {
        // offline — use cached localStorage data
      }
    };
    syncProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
        // Prefer filtering by user email so we only see this user's orders
        const emailParam = currentUser.email ? `?email=${encodeURIComponent(currentUser.email)}` : "";
        const res = await fetch(`/api/orders${emailParam}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setOrders(data);
            setOrdersLoading(false);
            return;
          }
        }
      } catch {
        // Fall back to authentic sample orders
      }

      setOrders([
        {
          id: "ORD-9821",
          orderId: 9821,
          customerName: `${currentUser.firstName || 'Alex'} ${currentUser.lastName || 'Johnson'}`,
          email: currentUser.email,
          date: "2026-10-18",
          totalAmount: 999.0,
          shippingCost: 0,
          orderStatus: "Processing",
          paymentStatus: "Paid",
          shippingAddress: "1 Apple Park Way, Cupertino, CA 95014",
          trackingNumber: "1Z9999999999999999",
          carrier: "UPS Express Delivery",
          items: [
            {
              id: 1,
              title: "iPhone 16 Pro - 256GB Natural Titanium",
              price: 999.0,
              quantity: 1,
              image: "https://www.apple.com/v/iphone-16-pro/c/images/overview/product-viewer/iphone-pro/all_colors__fdpqqslunrma_large.jpg",
            },
          ],
        },
        {
          id: "ORD-9822",
          orderId: 9822,
          customerName: `${currentUser.firstName || 'Alex'} ${currentUser.lastName || 'Johnson'}`,
          email: currentUser.email,
          date: "2026-10-02",
          totalAmount: 2499.0,
          shippingCost: 0,
          orderStatus: "Delivered",
          paymentStatus: "Paid",
          shippingAddress: "1 Apple Park Way, Cupertino, CA 95014",
          trackingNumber: "1Z9999999988888888",
          carrier: "FedEx Standard Delivery",
          items: [
            {
              id: 2,
              title: "MacBook Pro 16\" - Space Black (M4 Pro)",
              price: 2499.0,
              quantity: 1,
              image: "https://www.apple.com/v/macbook-pro/al/images/overview/welcome/hero_endframe__b9nnfg63ec6q_large.jpg",
            },
          ],
        },
        {
          id: "ORD-9823",
          orderId: 9823,
          customerName: `${currentUser.firstName || 'Alex'} ${currentUser.lastName || 'Johnson'}`,
          email: currentUser.email,
          date: "2026-09-22",
          totalAmount: 249.0,
          shippingCost: 0,
          orderStatus: "Delivered",
          paymentStatus: "Paid",
          shippingAddress: "1 Apple Park Way, Cupertino, CA 95014",
          trackingNumber: "1Z9999999977777777",
          carrier: "UPS Express Delivery",
          items: [
            {
              id: 3,
              title: "AirPods Pro (2nd generation) with USB-C",
              price: 249.0,
              quantity: 1,
              image: "https://www.apple.com/v/airpods-pro/q/images/overview/welcome/hero__f1k2k23a31e6_large.jpg",
            },
          ],
        },
      ]);
      setOrdersLoading(false);
    };

    fetchOrders();
  }, [currentUser]);

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "All") return true;
    return o.orderStatus?.toLowerCase() === orderFilter.toLowerCase();
  });

  // Privacy & Data State
  const [privacyToggles, setPrivacyToggles] = useState({
    personalizedAds: false,
    shareAnalytics: false,
    improveSiri: true,
  });

  const [showDataExportModal, setShowDataExportModal] = useState(false);
  const [exportCategories, setExportCategories] = useState({
    accountInfo: true,
    cloudMedia: true,
    appStoreActivity: true,
    walletPurchases: true,
  });

  const handleRequestDataExport = (e) => {
    e.preventDefault();
    setShowDataExportModal(false);
    showToast("Data request submitted. Apple will email download instructions.");
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  const userFullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email?.split("@")[0] || "Apple Customer";
  const userInitials = (
    (currentUser.firstName?.[0] || "") + (currentUser.lastName?.[0] || "")
  ).toUpperCase() || "A";

  const navItems = [
    { id: "security", label: "Sign-In & Security", path: "/account/security", icon: Shield },
    { id: "personal", label: "Personal Information", path: "/account/personal-information", icon: User },
    { id: "payment", label: "Payment & Shipping", path: "/account/payment-shipping", icon: CreditCard },
    { id: "subscriptions", label: "Subscriptions", path: "/account/subscriptions", icon: Sparkles },
    { id: "family", label: "Family Sharing", path: "/account/family", icon: Users },
    { id: "devices", label: "Devices", path: "/account/devices", icon: Laptop },
    { id: "orders", label: "Orders & Purchases", path: "/orders", icon: Package },
    { id: "privacy", label: "Privacy & Data", path: "/account/privacy", icon: Lock },
  ];

  return (
    <div className="apple-account-page">
      {/* Toast Alert */}
      {toast && (
        <div className={`apple-toast apple-toast-${toast.type}`} role="alert">
          {toast.type === "success" && <CheckCircle2 size={18} />}
          {toast.type === "error" && <AlertCircle size={18} />}
          {toast.type === "info" && <Info size={18} />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} aria-label="Dismiss toast">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Account Sub-Header */}
      <div className="account-subnav-bar">
        <div className="account-subnav-content">
          <div className="account-subnav-title">
            <Link to="/account" className="account-brand-link">
              <svg className="apple-logo-icon" viewBox="0 0 170 170" width="16" height="16">
                <path
                  d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.77-8.8-10.36-18.9-13.78-30.3-3.42-11.39-5.13-22.37-5.13-32.93 0-14.34 3.73-26.08 11.19-35.21 7.46-9.13 16.71-13.75 27.75-13.88 4.7 0 10.05 1.25 16.05 3.76 6 2.5 9.77 3.82 11.31 3.94 1.76-.23 5.76-1.61 12-4.14 6.24-2.52 11.64-3.66 16.21-3.41 12.01.62 21.84 5.37 29.47 14.25-10.53 6.37-15.69 15.34-15.48 26.92.21 9.4 3.93 17.15 11.16 23.24 7.23 6.09 15.6 9.38 25.11 9.87-2.34 7.02-5.46 14.42-9.37 22.18zM119.22 31.84c0-7.72 2.76-14.78 8.28-21.19 5.52-6.41 12.3-10.25 20.34-11.53.11 1.25.17 2.3.17 3.16 0 7.6-2.92 14.78-8.77 21.54-5.85 6.76-12.8 10.59-20.85 11.48-.12-1.12-.17-2.27-.17-3.46z"
                  fill="currentColor"
                />
              </svg>
              <span>Apple Account</span>
            </Link>
            <span className="account-breadcrumb-sep">/</span>
            <span className="account-current-tab-label">
              {navItems.find((n) => n.id === activeTab)?.label || "Overview"}
            </span>
          </div>

          <div className="account-subnav-actions">
            <a
              href="https://support.apple.com/apple-id"
              target="_blank"
              rel="noreferrer"
              className="subnav-help-link"
            >
              Support
            </a>
            <button
              onClick={handleSignOut}
              className="subnav-signout-btn"
              type="button"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Account Hero Card */}
      <section className="account-hero-banner">
        <div className="account-hero-inner">
          <div className="account-hero-profile">
            <div className="account-hero-avatar" aria-label="User Avatar">
              <span>{userInitials}</span>
              <button
                className="avatar-edit-overlay"
                onClick={() => setShowProfileModal(true)}
                title="Edit Profile"
              >
                <Edit3 size={14} />
              </button>
            </div>

            <div className="account-hero-info">
              <div className="account-hero-badge-row">
                <span className="apple-id-chip">Apple Account</span>
                <span className="security-status-chip">
                  <Shield size={12} />
                  Protected with 2FA
                </span>
              </div>
              <h1 className="account-hero-name">{userFullName}</h1>
              <p className="account-hero-email">{currentUser.email}</p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="account-hero-stats">
            <div className="hero-stat-card" onClick={() => handleTabChange("devices", "/account/devices")}>
              <Laptop size={18} className="stat-icon" />
              <div className="stat-data">
                <span className="stat-value">{devices.length}</span>
                <span className="stat-label">Devices</span>
              </div>
            </div>

            <div className="hero-stat-card" onClick={() => handleTabChange("subscriptions", "/account/subscriptions")}>
              <Sparkles size={18} className="stat-icon" />
              <div className="stat-data">
                <span className="stat-value">{subscriptions.length}</span>
                <span className="stat-label">Services</span>
              </div>
            </div>

            <div className="hero-stat-card" onClick={() => handleTabChange("family", "/account/family")}>
              <Users size={18} className="stat-icon" />
              <div className="stat-data">
                <span className="stat-value">{familyMembers.length}</span>
                <span className="stat-label">Family</span>
              </div>
            </div>

            <div className="hero-stat-card" onClick={() => handleTabChange("orders", "/orders")}>
              <Package size={18} className="stat-icon" />
              <div className="stat-data">
                <span className="stat-value">{orders.length}</span>
                <span className="stat-label">Orders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Main Layout */}
      <div className="apple-account-layout">
        {/* Sidebar Nav */}
        <aside className="apple-account-sidebar">
          <nav className="account-nav-list" aria-label="Account Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id, item.path)}
                  className={`account-nav-btn ${isActive ? "active" : ""}`}
                >
                  <Icon size={18} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {item.id === "orders" && orders.length > 0 && (
                    <span className="nav-badge">{orders.length}</span>
                  )}
                  {isActive && <ChevronRight size={14} className="nav-arrow" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Pane */}
        <main className="apple-account-content">
          {/* ============================================================== */}
          {/* TAB 1: SIGN-IN & SECURITY */}
          {/* ============================================================== */}
          {activeTab === "security" && (
            <div className="tab-pane active-pane">
              <header className="pane-header">
                <h2>Sign-In &amp; Security</h2>
                <p>
                  Manage settings related to signing in to your Apple Account,
                  two-factor authentication, security credentials, and app passwords.
                </p>
              </header>

              <div className="account-cards-grid">
                {/* Email & Phone */}
                <article className="apple-card">
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Primary Contact</span>
                      <h3>Email &amp; Phone Numbers</h3>
                    </div>
                    <button
                      type="button"
                      className="card-action-btn"
                      onClick={() => setShowProfileModal(true)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="card-body-content">
                    <div className="info-line">
                      <span className="info-tag verified">Apple Account (Primary)</span>
                      <strong className="info-val">{currentUser.email}</strong>
                    </div>
                    <div className="info-line">
                      <span className="info-tag">Reachable at</span>
                      <span className="info-val">{currentUser.phone || "+1 (408) 555-0199"}</span>
                    </div>
                  </div>
                </article>

                {/* Password */}
                <article className="apple-card">
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Credentials</span>
                      <h3>Password</h3>
                    </div>
                    <button
                      type="button"
                      className="card-action-btn"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Change Password…
                    </button>
                  </div>
                  <div className="card-body-content">
                    <p className="card-muted-text">
                      Last updated September 21, 2026. Keep your password secure and do not share it.
                    </p>
                    <div className="password-masked-display">
                      <span>••••••••••••••••</span>
                      <span className="status-pill status-good">Strong</span>
                    </div>
                  </div>
                </article>

                {/* Two-Factor Authentication */}
                <article className="apple-card">
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Account Security</span>
                      <h3>Two-Factor Authentication</h3>
                    </div>
                    <span className="status-pill status-good">On</span>
                  </div>
                  <div className="card-body-content">
                    <p className="card-muted-text">
                      Your Apple Account is protected with two-factor authentication.
                      A verification code is sent when you sign in on an unrecognized device.
                    </p>
                    <div className="trusted-number-box">
                      <span className="item-label">Trusted phone number:</span>
                      <strong>{currentUser.phone || "+1 (408) 555-0199"}</strong>
                    </div>
                  </div>
                </article>

                {/* App-Specific Passwords */}
                <article className="apple-card">
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Third-Party Sign-In</span>
                      <h3>App-Specific Passwords</h3>
                    </div>
                    <button
                      type="button"
                      className="card-action-btn"
                      onClick={() => {
                        setGeneratedPassword(null);
                        setNewAppName("");
                        setShowAppPasswordModal(true);
                      }}
                    >
                      Generate…
                    </button>
                  </div>
                  <div className="card-body-content">
                    <p className="card-muted-text">
                      Sign in to third-party apps like Microsoft Outlook or Mozilla Thunderbird without sharing your real Apple password.
                    </p>
                    <div className="app-passwords-list">
                      {appPasswords.map((pw) => (
                        <div key={pw.id} className="app-password-item">
                          <div>
                            <strong>{pw.name}</strong>
                            <small className="item-sub">Created {pw.created}</small>
                          </div>
                          <button
                            type="button"
                            className="revoke-btn"
                            onClick={() => handleRevokeAppPassword(pw.id, pw.name)}
                          >
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>

                {/* Support PIN (Apple Official Feature) */}
                <article className="apple-card">
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">AppleCare Identification</span>
                      <h3>Support PIN</h3>
                    </div>
                    <button
                      type="button"
                      className="card-action-btn"
                      onClick={handleGenerateNewPin}
                    >
                      <RefreshCw size={13} style={{ marginRight: 4 }} />
                      Generate New PIN
                    </button>
                  </div>
                  <div className="card-body-content">
                    <p className="card-muted-text">
                      Give this temporary 4-digit Support PIN to an AppleCare advisor to verify your identity when you call.
                    </p>
                    <div className="support-pin-display">
                      <div className="pin-digits-box">
                        <span className="pin-code">{supportPin}</span>
                        <button
                          type="button"
                          className="pin-copy-btn"
                          onClick={() => {
                            navigator.clipboard?.writeText(supportPin);
                            showToast("Support PIN copied to clipboard.");
                          }}
                          title="Copy PIN"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="pin-expiry-info">
                        <Clock size={14} />
                        <span>Expires in {formatPinTime(pinTimeLeft)}</span>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Sign in with Apple Apps */}
                <article className="apple-card">
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Privacy Features</span>
                      <h3>Sign in with Apple</h3>
                    </div>
                    <span className="status-pill status-neutral">4 Connected</span>
                  </div>
                  <div className="card-body-content">
                    <p className="card-muted-text">
                      Apps and websites using your Apple Account with "Hide My Email" privacy relay active.
                    </p>
                    <div className="connected-apps-grid">
                      <div className="connected-app-tag">
                        <span className="app-dot"></span>
                        <span>Nike Run Club</span>
                      </div>
                      <div className="connected-app-tag">
                        <span className="app-dot"></span>
                        <span>Spotify</span>
                      </div>
                      <div className="connected-app-tag">
                        <span className="app-dot"></span>
                        <span>Canva</span>
                      </div>
                      <div className="connected-app-tag">
                        <span className="app-dot"></span>
                        <span>Strava</span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: PERSONAL INFORMATION */}
          {/* ============================================================== */}
          {activeTab === "personal" && (
            <div className="tab-pane active-pane">
              <header className="pane-header">
                <h2>Personal Information</h2>
                <p>
                  Manage your personal details, preferred language, region, and how
                  Apple communicates with you across all services.
                </p>
              </header>

              <div className="account-cards-grid">
                <article className="apple-card">
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Identity</span>
                      <h3>Name &amp; Nickname</h3>
                    </div>
                    <button
                      type="button"
                      className="card-action-btn"
                      onClick={() => setShowProfileModal(true)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="card-body-content">
                    <div className="info-row">
                      <span className="label-col">Full Name:</span>
                      <strong className="val-col">{userFullName}</strong>
                    </div>
                    <div className="info-row">
                      <span className="label-col">Apple Account Name:</span>
                      <span className="val-col">{currentUser.email}</span>
                    </div>
                  </div>
                </article>

                <article className="apple-card">
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Demographics</span>
                      <h3>Birthday</h3>
                    </div>
                    <button
                      type="button"
                      className="card-action-btn"
                      onClick={() => setShowProfileModal(true)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="card-body-content">
                    <div className="info-row">
                      <span className="label-col">Date of Birth:</span>
                      <strong className="val-col">
                        {currentUser.birthday
                          ? new Date(currentUser.birthday).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "August 15, 1994"}
                      </strong>
                    </div>
                    <p className="card-muted-text" style={{ marginTop: 8 }}>
                      Used to verify your identity and ensure age-appropriate features on Apple devices.
                    </p>
                  </div>
                </article>

                <article className="apple-card">
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Localization</span>
                      <h3>Country / Region</h3>
                    </div>
                    <button
                      type="button"
                      className="card-action-btn"
                      onClick={() => setShowProfileModal(true)}
                    >
                      Change
                    </button>
                  </div>
                  <div className="card-body-content">
                    <div className="info-row">
                      <span className="label-col">Country:</span>
                      <strong className="val-col">{currentUser.country || "United States"}</strong>
                    </div>
                    <div className="info-row">
                      <span className="label-col">Language:</span>
                      <span className="val-col">{currentUser.language || "English (US)"}</span>
                    </div>
                  </div>
                </article>

                <article className="apple-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Notifications</span>
                      <h3>Communication Preferences</h3>
                    </div>
                  </div>
                  <div className="card-body-content">
                    <p className="card-muted-text">
                      Stay informed about Apple products, software updates, and customized offers.
                    </p>

                    <div className="prefs-toggle-list">
                      <label className="pref-item">
                        <input
                          type="checkbox"
                          checked={commPrefs.announcements}
                          onChange={() => handleTogglePref("announcements")}
                        />
                        <div className="pref-text">
                          <strong>Announcements</strong>
                          <span>Get emails about new Apple products, features, and store openings.</span>
                        </div>
                      </label>

                      <label className="pref-item">
                        <input
                          type="checkbox"
                          checked={commPrefs.recommendations}
                          onChange={() => handleTogglePref("recommendations")}
                        />
                        <div className="pref-text">
                          <strong>Apps, Music, TV, and Media</strong>
                          <span>Personalized suggestions based on what you listen to, watch, and download.</span>
                        </div>
                      </label>

                      <label className="pref-item">
                        <input
                          type="checkbox"
                          checked={commPrefs.newsletters}
                          onChange={() => handleTogglePref("newsletters")}
                        />
                        <div className="pref-text">
                          <strong>Apple News Newsletter</strong>
                          <span>Curated daily briefings from top editors and journalism partners.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: PAYMENT & SHIPPING */}
          {/* ============================================================== */}
          {activeTab === "payment" && (
            <div className="tab-pane active-pane">
              <header className="pane-header">
                <h2>Payment &amp; Shipping</h2>
                <p>
                  Manage the payment methods and shipping addresses used for your
                  Apple Store purchases, App Store, and Apple services.
                </p>
              </header>

              <div className="section-block">
                <div className="section-title-row">
                  <h3>Payment Methods</h3>
                  <button
                    type="button"
                    className="apple-primary-btn-sm"
                    onClick={() => setShowAddCardModal(true)}
                  >
                    <Plus size={14} /> Add Payment Method
                  </button>
                </div>

                <div className="payment-cards-grid">
                  {paymentMethods.map((card) => (
                    <div
                      key={card.id}
                      className={`payment-card-visual ${card.cardType}`}
                    >
                      <div className="card-visual-top">
                        <span className="card-chip-icon"></span>
                        {card.isDefault && (
                          <span className="default-card-badge">Default</span>
                        )}
                      </div>

                      <div className="card-visual-number">
                        •••• •••• •••• {card.last4}
                      </div>

                      <div className="card-visual-bottom">
                        <div>
                          <span className="card-field-label">Cardholder</span>
                          <span className="card-field-val">{card.holder}</span>
                        </div>
                        <div>
                          <span className="card-field-label">Expires</span>
                          <span className="card-field-val">{card.expiry}</span>
                        </div>
                      </div>

                      <div className="card-actions-bar">
                        {!card.isDefault && (
                          <button
                            type="button"
                            className="card-quick-btn"
                            onClick={() => handleSetDefaultCard(card.id)}
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          type="button"
                          className="card-quick-btn danger"
                          onClick={() => handleRemoveCard(card.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="section-block" style={{ marginTop: 32 }}>
                <div className="section-title-row">
                  <h3>Shipping Address</h3>
                  <button
                    type="button"
                    className="card-action-btn"
                    onClick={() => setShowAddressModal(true)}
                  >
                    Edit Address
                  </button>
                </div>

                <div className="shipping-address-card">
                  <div className="address-icon-box">
                    <Truck size={22} />
                  </div>
                  <div className="address-details">
                    <span className="default-pill">Default Delivery Address</span>
                    <strong>{shippingAddress.recipient}</strong>
                    <span>{shippingAddress.street} {shippingAddress.apartment}</span>
                    <span>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</span>
                    <span>{shippingAddress.country}</span>
                    <span className="address-phone">{shippingAddress.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: SUBSCRIPTIONS */}
          {/* ============================================================== */}
          {activeTab === "subscriptions" && (
            <div className="tab-pane active-pane">
              <header className="pane-header">
                <h2>Subscriptions</h2>
                <p>
                  Manage your active and expired subscriptions, change plan tiers,
                  and access billing history and official receipts.
                </p>
              </header>

              <div className="subscriptions-container">
                <div className="subscriptions-hero-box">
                  <Sparkles size={28} className="hero-sparkle" />
                  <div>
                    <h3>Apple One Premier Active</h3>
                    <p>
                      Your subscription bundles Apple Music Family, Apple TV+, Apple Arcade,
                      iCloud+ 2 TB, Apple Fitness+, and Apple News+ into one monthly plan.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="view-invoices-btn"
                    onClick={() => setShowInvoicesModal(true)}
                  >
                    <Download size={14} />
                    Invoices &amp; Receipts
                  </button>
                </div>

                <div className="sub-list">
                  {subscriptions.map((sub) => (
                    <article key={sub.id} className="sub-item-card">
                      <div className="sub-item-header">
                        <div className="sub-brand">
                          <div className="sub-icon-circle">
                            <Sparkles size={20} />
                          </div>
                          <div>
                            <h4>{sub.name}</h4>
                            <span className="sub-tier-badge">{sub.tier}</span>
                          </div>
                        </div>

                        <div className="sub-price-block">
                          <span className="sub-price">{sub.price}</span>
                          <span className="sub-renews">Next billing: {sub.renewalDate}</span>
                        </div>
                      </div>

                      <ul className="sub-features-list">
                        {sub.features.map((feat, i) => (
                          <li key={i}>
                            <Check size={14} className="check-icon" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="sub-card-actions">
                        <button
                          type="button"
                          className="sub-manage-btn"
                          onClick={() => setSelectedSubForManage(sub)}
                        >
                          Manage Plan…
                        </button>
                        <button
                          type="button"
                          className="sub-cancel-btn"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to cancel this subscription? You will retain access until the end of your billing period.")) {
                              showToast("Subscription cancellation scheduled for next billing cycle.", "info");
                            }
                          }}
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: FAMILY SHARING */}
          {/* ============================================================== */}
          {activeTab === "family" && (
            <div className="tab-pane active-pane">
              <header className="pane-header">
                <h2>Family Sharing</h2>
                <p>
                  Share Apple subscriptions, iCloud+ storage, App Store purchases,
                  and keep family members connected with Screen Time and Location Sharing.
                </p>
              </header>

              {/* Family Storage Gauge */}
              <div className="family-storage-card">
                <div className="family-storage-head">
                  <div>
                    <span className="card-eyebrow">iCloud+ Shared Pool</span>
                    <h3>2 TB Storage (842 GB Used)</h3>
                  </div>
                  <button
                    type="button"
                    className="apple-primary-btn-sm"
                    onClick={() => setShowInviteModal(true)}
                  >
                    <Plus size={14} /> Invite Member
                  </button>
                </div>

                <div className="storage-meter-track">
                  <div className="meter-seg you" style={{ width: "21%" }} title="You: 420 GB"></div>
                  <div className="meter-seg user1" style={{ width: "11.5%" }} title="Sarah: 230 GB"></div>
                  <div className="meter-seg user2" style={{ width: "5.6%" }} title="Leo: 112 GB"></div>
                  <div className="meter-seg user3" style={{ width: "4%" }} title="Emma: 80 GB"></div>
                </div>

                <div className="storage-legend">
                  <span className="legend-item"><span className="color-dot you"></span> You (420 GB)</span>
                  <span className="legend-item"><span className="color-dot user1"></span> Sarah (230 GB)</span>
                  <span className="legend-item"><span className="color-dot user2"></span> Leo (112 GB)</span>
                  <span className="legend-item"><span className="color-dot user3"></span> Emma (80 GB)</span>
                  <span className="legend-item"><span className="color-dot free"></span> 1.15 TB Free</span>
                </div>
              </div>

              {/* Family Members List */}
              <div className="section-block" style={{ marginTop: 28 }}>
                <div className="section-title-row">
                  <h3>Family Members ({familyMembers.length})</h3>
                </div>

                <div className="family-members-grid">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="family-member-card">
                      <div
                        className="member-avatar"
                        style={{ backgroundColor: member.avatarColor }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div className="member-info">
                        <strong>
                          {member.name} {member.isYou && <span className="you-pill">You</span>}
                        </strong>
                        <span className="member-role">{member.role}</span>
                        <small className="member-email">{member.email}</small>
                        <span className="member-storage">{member.usedStorage} in iCloud</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shared Services Toggles */}
              <div className="section-block" style={{ marginTop: 28 }}>
                <div className="section-title-row">
                  <h3>Shared Features</h3>
                </div>

                <div className="shared-features-grid">
                  {[
                    { key: "icloud", label: "iCloud+ Storage", desc: "Share 2 TB with all members without sharing private files." },
                    { key: "purchases", label: "Purchase Sharing", desc: "Share App Store and iTunes purchases with the family." },
                    { key: "music", label: "Apple Music Family", desc: "Everyone gets their own individual music library and recommendations." },
                    { key: "askToBuy", label: "Ask to Buy", desc: "Require organizer approval for purchases made by children." },
                    { key: "screenTime", label: "Screen Time & Downtime", desc: "Set limits and monitor app activity for younger members." },
                    { key: "location", label: "Location Sharing", desc: "Share locations with family members in the Find My app." },
                  ].map((feat) => (
                    <div key={feat.key} className="shared-feature-item">
                      <div>
                        <strong>{feat.label}</strong>
                        <p>{feat.desc}</p>
                      </div>
                      <label className="apple-switch">
                        <input
                          type="checkbox"
                          checked={familyToggles[feat.key]}
                          onChange={() => {
                            setFamilyToggles((prev) => ({ ...prev, [feat.key]: !prev[feat.key] }));
                            showToast(`${feat.label} updated.`);
                          }}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: DEVICES */}
          {/* ============================================================== */}
          {activeTab === "devices" && (
            <div className="tab-pane active-pane">
              <header className="pane-header">
                <h2>Devices</h2>
                <p>
                  These devices are signed in with your Apple Account and have access
                  to your iCloud data, iMessage, FaceTime, and Apple services.
                </p>
              </header>

              <div className="devices-grid">
                {devices.map((device) => {
                  let Icon = Laptop;
                  if (device.type === "phone") Icon = Smartphone;
                  if (device.type === "tablet") Icon = Laptop;
                  if (device.type === "watch") Icon = Watch;
                  if (device.type === "headphones") Icon = Headphones;

                  return (
                    <article
                      key={device.id}
                      className="device-card"
                      onClick={() => setSelectedDevice(device)}
                    >
                      <div className="device-icon-box">
                        <Icon size={32} />
                      </div>
                      <div className="device-card-content">
                        <h4>{device.name}</h4>
                        <span className="device-os">{device.os}</span>
                        <span className="device-last-active">{device.lastActive}</span>
                        <span className="device-findmy-chip">
                          <CheckCircle2 size={12} /> Find My Active
                        </span>
                      </div>
                      <ChevronRight size={18} className="card-arrow" />
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: ORDERS & PURCHASES */}
          {/* ============================================================== */}
          {activeTab === "orders" && (
            <div className="tab-pane active-pane">
              <header className="pane-header">
                <h2>Orders &amp; Purchases</h2>
                <p>
                  Track your online Apple Store orders, review order status,
                  download tax invoices, and request returns or support.
                </p>
              </header>

              <div className="orders-filter-bar">
                {["All", "Processing", "Shipped", "Delivered"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderFilter(st)}
                    className={`order-filter-chip ${orderFilter === st ? "active" : ""}`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {ordersLoading ? (
                <div className="orders-list">
                  {[1, 2].map((i) => (
                    <div key={i} className="order-skeleton-card">
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                        <div style={{ flex: 1 }}>
                          <div className="skeleton-line medium" style={{ marginBottom: 8 }} />
                          <div className="skeleton-line short" />
                        </div>
                        <div style={{ width: 80, textAlign: "right" }}>
                          <div className="skeleton-line full" style={{ marginBottom: 8 }} />
                          <div className="skeleton-line full" />
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderTop: "1px solid #f2f2f7" }}>
                        <div className="skeleton-thumb" />
                        <div style={{ flex: 1 }}>
                          <div className="skeleton-line long" style={{ marginBottom: 8 }} />
                          <div className="skeleton-line short" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="empty-orders-box">
                  <Package size={48} />
                  <h3>No {orderFilter !== "All" ? orderFilter : ""} Orders Found</h3>
                  <p>When you purchase products from the Apple Store, they will appear here.</p>
                  <Link to="/store" className="apple-primary-btn">
                    Visit Apple Store
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {filteredOrders.map((order) => {
                    const isProcessing = order.orderStatus?.toLowerCase() === "processing";
                    const isShipped = order.orderStatus?.toLowerCase() === "shipped";
                    const isDelivered = order.orderStatus?.toLowerCase() === "delivered";

                    return (
                      <article key={order.id} className="order-box">
                        <div className="order-box-header">
                          <div className="order-main-meta">
                            <span className="order-id-label">Order #{order.id}</span>
                            <span className="order-date-label">Placed on {order.date}</span>
                          </div>

                          <div className="order-status-block">
                            <span
                              className={`order-status-badge ${order.orderStatus?.toLowerCase()}`}
                            >
                              {order.orderStatus}
                            </span>
                            <strong className="order-total-price">
                              ${Number(order.totalAmount).toFixed(2)}
                            </strong>
                          </div>
                        </div>

                        {/* Shipment Stepper */}
                        <div className="shipment-stepper">
                          <div className="step-point completed">
                            <span className="step-circle"><Check size={12} /></span>
                            <span className="step-text">Order Placed</span>
                          </div>
                          <div className={`step-connector ${isProcessing || isShipped || isDelivered ? "active" : ""}`}></div>
                          <div className={`step-point ${isProcessing || isShipped || isDelivered ? "completed" : ""}`}>
                            <span className="step-circle">{isProcessing ? <Clock size={12} /> : <Check size={12} />}</span>
                            <span className="step-text">Processing</span>
                          </div>
                          <div className={`step-connector ${isShipped || isDelivered ? "active" : ""}`}></div>
                          <div className={`step-point ${isShipped || isDelivered ? "completed" : ""}`}>
                            <span className="step-circle">{isShipped ? <Truck size={12} /> : <Check size={12} />}</span>
                            <span className="step-text">Shipped</span>
                          </div>
                          <div className={`step-connector ${isDelivered ? "active" : ""}`}></div>
                          <div className={`step-point ${isDelivered ? "completed" : ""}`}>
                            <span className="step-circle"><Check size={12} /></span>
                            <span className="step-text">Delivered</span>
                          </div>
                        </div>

                        {/* Items in this Order */}
                        <div className="order-items-preview">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="order-preview-item">
                              <img
                                src={item.image || "https://www.apple.com/v/iphone-16-pro/c/images/overview/product-viewer/iphone-pro/all_colors__fdpqqslunrma_large.jpg"}
                                alt={item.title || item.name}
                                className="item-thumbnail"
                              />
                              <div className="item-details">
                                <strong>{item.title || item.name}</strong>
                                <span>Qty: {item.quantity || 1} • ${Number(item.price).toFixed(2)} each</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className="order-box-footer">
                          <div className="carrier-snippet">
                            <Truck size={15} />
                            <span>
                              {order.carrier || "UPS Express"} • Tracking: <strong>{order.trackingNumber || "1Z9999999999"}</strong>
                            </span>
                          </div>

                          <div className="order-footer-btns">
                            <button
                              type="button"
                              className="order-btn secondary"
                              onClick={() => setSelectedOrder(order)}
                            >
                              View Details &amp; Receipt
                            </button>
                            <Link to="/store" className="order-btn primary">
                              Buy Again
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 8: PRIVACY & DATA */}
          {/* ============================================================== */}
          {activeTab === "privacy" && (
            <div className="tab-pane active-pane">
              <header className="pane-header">
                <h2>Privacy &amp; Data</h2>
                <p>
                  At Apple, we believe privacy is a fundamental human right.
                  Manage how your personal data is collected, stored, and processed.
                </p>
              </header>

              <div className="account-cards-grid">
                <article className="apple-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Data Transparency</span>
                      <h3>Manage Your Data</h3>
                    </div>
                  </div>
                  <div className="card-body-content">
                    <p className="card-muted-text">
                      You have full control over your personal data. Request a copy of your files,
                      transfer media, or correct information stored across our servers.
                    </p>

                    <div className="privacy-actions-row">
                      <div className="privacy-action-tile">
                        <Download size={22} className="tile-icon" />
                        <strong>Request a Copy of Your Data</strong>
                        <p>Download an archive of your Apple Account, iCloud, App Store, and Wallet activity.</p>
                        <button
                          type="button"
                          className="apple-primary-btn-sm"
                          onClick={() => setShowDataExportModal(true)}
                        >
                          Request Copy…
                        </button>
                      </div>

                      <div className="privacy-action-tile">
                        <Share2 size={22} className="tile-icon" />
                        <strong>Transfer a Copy of Your Media</strong>
                        <p>Directly transfer your iCloud Photos and videos to another service like Google Photos.</p>
                        <button
                          type="button"
                          className="apple-subtle-btn"
                          onClick={() => showToast("Media transfer setup opened in new window.", "info")}
                        >
                          Transfer Data…
                        </button>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="apple-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="card-top">
                    <div>
                      <span className="card-eyebrow">Diagnostics &amp; Advertising</span>
                      <h3>Privacy Controls</h3>
                    </div>
                  </div>
                  <div className="card-body-content">
                    <div className="prefs-toggle-list">
                      <label className="pref-item">
                        <input
                          type="checkbox"
                          checked={privacyToggles.personalizedAds}
                          onChange={() => {
                            setPrivacyToggles((prev) => ({
                              ...prev,
                              personalizedAds: !prev.personalizedAds,
                            }));
                            showToast("Apple Advertising setting updated.");
                          }}
                        />
                        <div className="pref-text">
                          <strong>Personalized Advertising</strong>
                          <span>Turning this off limits Apple’s ability to deliver relevant ads in the App Store and Apple News.</span>
                        </div>
                      </label>

                      <label className="pref-item">
                        <input
                          type="checkbox"
                          checked={privacyToggles.shareAnalytics}
                          onChange={() => {
                            setPrivacyToggles((prev) => ({
                              ...prev,
                              shareAnalytics: !prev.shareAnalytics,
                            }));
                            showToast("Device Analytics setting updated.");
                          }}
                        />
                        <div className="pref-text">
                          <strong>Share Analytics &amp; Diagnostic Data</strong>
                          <span>Automatically send diagnostic and usage data from your devices to help Apple improve products.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: CHANGE PASSWORD */}
      {/* ============================================================== */}
      {showPasswordModal && (
        <div className="apple-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="apple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="modal-body">
                {passwordError && (
                  <div className="modal-error-alert">
                    <AlertCircle size={16} />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="apple-input"
                  />
                </div>

                <div className="password-rules-box">
                  <small>Your password must contain:</small>
                  <ul>
                    <li className={newPassword.length >= 8 ? "met" : ""}>At least 8 characters</li>
                    <li className={/[A-Z]/.test(newPassword) ? "met" : ""}>Uppercase and lowercase letters</li>
                    <li className={/[0-9]/.test(newPassword) ? "met" : ""}>At least one number</li>
                  </ul>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="apple-subtle-btn"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="apple-primary-btn"
                >
                  {passwordLoading ? "Updating…" : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT PERSONAL INFO */}
      {/* ============================================================== */}
      {showProfileModal && (
        <div className="apple-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="apple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Personal Information</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowProfileModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="modal-body">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="apple-input"
                    placeholder="+1 (408) 555-0199"
                  />
                </div>

                <div className="form-group">
                  <label>Birthday</label>
                  <input
                    type="date"
                    value={profileForm.birthday}
                    onChange={(e) => setProfileForm({ ...profileForm, birthday: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Country / Region</label>
                    <select
                      value={profileForm.country}
                      onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                      className="apple-select"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="Australia">Australia</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Japan">Japan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={profileForm.language}
                      onChange={(e) => setProfileForm({ ...profileForm, language: e.target.value })}
                      className="apple-select"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="English (UK)">English (UK)</option>
                      <option value="Français">Français</option>
                      <option value="Deutsch">Deutsch</option>
                      <option value="Español">Español</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="apple-subtle-btn"
                  onClick={() => setShowProfileModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="apple-primary-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: APP-SPECIFIC PASSWORD */}
      {/* ============================================================== */}
      {showAppPasswordModal && (
        <div className="apple-modal-overlay" onClick={() => setShowAppPasswordModal(false)}>
          <div className="apple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generate App-Specific Password</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAppPasswordModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            {!generatedPassword ? (
              <form onSubmit={handleGenerateAppPassword}>
                <div className="modal-body">
                  <p className="card-muted-text">
                    Enter a label for this app password (for example, "Outlook on Work Mac").
                  </p>
                  <div className="form-group">
                    <label>App Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spark Mail, Thunderbird"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      className="apple-input"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="apple-subtle-btn"
                    onClick={() => setShowAppPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="apple-primary-btn">
                    Create
                  </button>
                </div>
              </form>
            ) : (
              <div className="modal-body">
                <p className="card-muted-text">
                  Your app-specific password has been generated. Enter this password when signing in to <strong>{newAppName}</strong>.
                </p>
                <div className="generated-pw-display">
                  <code>{generatedPassword}</code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(generatedPassword);
                      showToast("Password copied to clipboard.");
                    }}
                    className="pin-copy-btn"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <div className="modal-footer" style={{ padding: "16px 0 0" }}>
                  <button
                    type="button"
                    className="apple-primary-btn"
                    onClick={() => setShowAppPasswordModal(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: ADD PAYMENT METHOD */}
      {/* ============================================================== */}
      {showAddCardModal && (
        <div className="apple-modal-overlay" onClick={() => setShowAddCardModal(false)}>
          <div className="apple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Payment Method</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddCardModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCard}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4111 2222 3333 4444"
                    value={newCard.number}
                    onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={newCard.holder}
                    onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Expires (MM/YY)</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Security Code (CVV)</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      placeholder="123"
                      value={newCard.cvv}
                      onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                </div>

                <label className="pref-item" style={{ marginTop: 12 }}>
                  <input
                    type="checkbox"
                    checked={newCard.isDefault}
                    onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
                  />
                  <div className="pref-text">
                    <strong>Set as default payment method</strong>
                  </div>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="apple-subtle-btn"
                  onClick={() => setShowAddCardModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="apple-primary-btn">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: EDIT SHIPPING ADDRESS */}
      {/* ============================================================== */}
      {showAddressModal && (
        <div className="apple-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="apple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Shipping Address</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddressModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveShippingAddress}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.recipient}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, recipient: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label>Apt, Suite, Bldg (Optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.apartment}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>ZIP / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="apple-input"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="apple-subtle-btn"
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="apple-primary-btn">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: DEVICE DETAILS */}
      {/* ============================================================== */}
      {selectedDevice && (
        <div className="apple-modal-overlay" onClick={() => setSelectedDevice(null)}>
          <div className="apple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDevice.name}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedDevice(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="device-modal-specs">
                <div className="spec-row">
                  <span className="spec-key">Model:</span>
                  <span className="spec-val">{selectedDevice.model}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Operating System:</span>
                  <span className="spec-val">{selectedDevice.os}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Serial Number:</span>
                  <span className="spec-val">
                    <code>{selectedDevice.serial}</code>
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Find My Status:</span>
                  <span className="spec-val status-good">{selectedDevice.findMy}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Coverage:</span>
                  <span className="spec-val">{selectedDevice.coverage}</span>
                </div>
              </div>

              <div className="device-action-buttons">
                <button
                  type="button"
                  className="apple-subtle-btn"
                  onClick={() => showToast(`Playing sound on ${selectedDevice.name}…`)}
                >
                  Play Sound
                </button>
                <button
                  type="button"
                  className="apple-subtle-btn danger"
                  onClick={() => handleRemoveDevice(selectedDevice.id, selectedDevice.name)}
                >
                  <Trash2 size={14} style={{ marginRight: 6 }} />
                  Remove from Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 7: ORDER DETAILS & RECEIPT */}
      {/* ============================================================== */}
      {selectedOrder && (
        <div className="apple-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="apple-modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Order #{selectedOrder.id}</h3>
                <span className="modal-subtitle">Placed on {selectedOrder.date}</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="receipt-status-banner">
                <div>
                  <span className="receipt-label">Order Status</span>
                  <h4>{selectedOrder.orderStatus}</h4>
                </div>
                <div className="receipt-tracking-info">
                  <span>Carrier: {selectedOrder.carrier || "UPS Express"}</span>
                  <span>Tracking: <strong>{selectedOrder.trackingNumber || "1Z9999999999999999"}</strong></span>
                </div>
              </div>

              <div className="receipt-items-table">
                <h5>Items in this Order</h5>
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="receipt-item-row">
                    <img
                      src={it.image || "https://www.apple.com/v/iphone-16-pro/c/images/overview/product-viewer/iphone-pro/all_colors__fdpqqslunrma_large.jpg"}
                      alt={it.title || it.name}
                      className="receipt-thumb"
                    />
                    <div className="receipt-item-info">
                      <strong>{it.title || it.name}</strong>
                      <span>Quantity: {it.quantity || 1}</span>
                    </div>
                    <span className="receipt-item-price">
                      ${(Number(it.price) * (it.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="receipt-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal:</span>
                  <span>${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Standard Delivery:</span>
                  <span className="free-tag">Free</span>
                </div>
                <div className="breakdown-row total">
                  <strong>Total:</strong>
                  <strong>${Number(selectedOrder.totalAmount).toFixed(2)}</strong>
                </div>
              </div>

              <div className="receipt-shipping-meta">
                <div>
                  <strong>Shipping Address</strong>
                  <p>{selectedOrder.shippingAddress || "1 Apple Park Way, Cupertino, CA 95014"}</p>
                </div>
                <div>
                  <strong>Payment Method</strong>
                  <p>
                    {selectedOrder.paymentMethod
                      ? `${selectedOrder.paymentMethod}${selectedOrder.paymentReference ? ` · Ref: ${selectedOrder.paymentReference}` : ""}`
                      : "Apple Card ending in 4022"}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="apple-subtle-btn"
                onClick={() => window.print()}
              >
                <Printer size={15} style={{ marginRight: 6 }} />
                Print Receipt
              </button>
              <button
                type="button"
                className="apple-primary-btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 8: INVITE FAMILY MEMBER */}
      {/* ============================================================== */}
      {showInviteModal && (
        <div className="apple-modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="apple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invite Family Member</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowInviteModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendInvite}>
              <div className="modal-body">
                <p className="card-muted-text">
                  Enter their Apple Account email address. They will receive an invitation to join your Family Sharing group.
                </p>

                <div className="form-group">
                  <label>Apple Account Email</label>
                  <input
                    type="email"
                    required
                    placeholder="family.member@icloud.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="apple-input"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="apple-select"
                  >
                    <option value="Adult">Adult</option>
                    <option value="Parent / Guardian">Parent / Guardian</option>
                    <option value="Teen">Teen</option>
                    <option value="Child">Child (Ask to Buy enabled)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="apple-subtle-btn"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="apple-primary-btn">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 9: REQUEST DATA EXPORT */}
      {/* ============================================================== */}
      {showDataExportModal && (
        <div className="apple-modal-overlay" onClick={() => setShowDataExportModal(false)}>
          <div className="apple-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request a Copy of Your Data</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowDataExportModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestDataExport}>
              <div className="modal-body">
                <p className="card-muted-text">
                  Select the categories of data you would like included in your downloadable archive.
                </p>

                <div className="prefs-toggle-list">
                  <label className="pref-item">
                    <input
                      type="checkbox"
                      checked={exportCategories.accountInfo}
                      onChange={(e) => setExportCategories({ ...exportCategories, accountInfo: e.target.checked })}
                    />
                    <div className="pref-text">
                      <strong>Apple Account &amp; Device Information</strong>
                      <span>Sign-in activity, device serial numbers, customer service interactions.</span>
                    </div>
                  </label>

                  <label className="pref-item">
                    <input
                      type="checkbox"
                      checked={exportCategories.cloudMedia}
                      onChange={(e) => setExportCategories({ ...exportCategories, cloudMedia: e.target.checked })}
                    />
                    <div className="pref-text">
                      <strong>iCloud Drive &amp; Media Data</strong>
                      <span>Stored documents, notes, bookmarks, calendars, and reminders.</span>
                    </div>
                  </label>

                  <label className="pref-item">
                    <input
                      type="checkbox"
                      checked={exportCategories.appStoreActivity}
                      onChange={(e) => setExportCategories({ ...exportCategories, appStoreActivity: e.target.checked })}
                    />
                    <div className="pref-text">
                      <strong>App Store, iTunes &amp; Apple Books Activity</strong>
                      <span>App purchase history, downloads, reviews, and subscriptions.</span>
                    </div>
                  </label>

                  <label className="pref-item">
                    <input
                      type="checkbox"
                      checked={exportCategories.walletPurchases}
                      onChange={(e) => setExportCategories({ ...exportCategories, walletPurchases: e.target.checked })}
                    />
                    <div className="pref-text">
                      <strong>Apple Pay &amp; Wallet Transactions</strong>
                      <span>Transaction logs, receipt identifiers, and store pickup records.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="apple-subtle-btn"
                  onClick={() => setShowDataExportModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="apple-primary-btn">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 10: INVOICES & BILLING HISTORY */}
      {/* ============================================================== */}
      {showInvoicesModal && (
        <div className="apple-modal-overlay" onClick={() => setShowInvoicesModal(false)}>
          <div className="apple-modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoices &amp; Billing History</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowInvoicesModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="invoices-table">
                <div className="invoice-header-row">
                  <span>Date</span>
                  <span>Description</span>
                  <span>Payment</span>
                  <span>Amount</span>
                  <span>Receipt</span>
                </div>
                {[
                  { date: "Oct 14, 2026", desc: "Apple One Premier", pay: "Apple Card (4022)", amount: "$37.95" },
                  { date: "Sep 14, 2026", desc: "Apple One Premier", pay: "Apple Card (4022)", amount: "$37.95" },
                  { date: "Aug 14, 2026", desc: "Apple One Premier", pay: "Apple Card (4022)", amount: "$37.95" },
                  { date: "Jul 14, 2026", desc: "Apple One Premier", pay: "Apple Card (4022)", amount: "$37.95" },
                ].map((inv, idx) => (
                  <div key={idx} className="invoice-data-row">
                    <span>{inv.date}</span>
                    <strong>{inv.desc}</strong>
                    <span>{inv.pay}</span>
                    <span className="inv-amount">{inv.amount}</span>
                    <button
                      type="button"
                      className="download-invoice-btn"
                      onClick={() => showToast(`Downloaded invoice for ${inv.date}`)}
                    >
                      <Download size={13} /> PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="apple-primary-btn"
                onClick={() => setShowInvoicesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
