import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Printer,
  ArrowRight,
  ShieldCheck,
  Building,
  CreditCard,
  Smartphone,
  Copy,
  Check,
  Send,
  AlertCircle
} from "lucide-react";
import "./OrderConfirmation.css";

const API_BASE = "http://localhost:5000/api";

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const txRefFromUrl = searchParams.get("ref");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Bank transfer slip submission state
  const [slipData, setSlipData] = useState({
    bankName: "Commercial Bank of Ethiopia (CBE)",
    transferReference: "",
    senderName: "",
    notes: ""
  });
  const [slipSubmitted, setSlipSubmitted] = useState(false);
  const [slipSubmitting, setSlipSubmitting] = useState(false);
  const [slipError, setSlipError] = useState("");
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderNumber)}`);
        if (!res.ok) {
          throw new Error("Unable to retrieve order details.");
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Order fetch error:", err);
        setError("We couldn't load your order details. If your payment was completed, your order is safe in our system.");
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSlipSubmit = async (e) => {
    e.preventDefault();
    if (!slipData.transferReference.trim()) {
      setSlipError("Please enter your bank transfer transaction reference number.");
      return;
    }

    setSlipSubmitting(true);
    setSlipError("");

    try {
      const res = await fetch(`${API_BASE}/payments/bank-transfer/submit-slip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderNumber,
          bankName: slipData.bankName,
          transferReference: slipData.transferReference,
          senderName: slipData.senderName,
          notes: slipData.notes
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit bank transfer slip.");
      }

      setSlipSubmitted(true);
    } catch (err) {
      setSlipError(err.message || "Failed to submit slip.");
    } finally {
      setSlipSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="confirmation-loading-screen">
        <div className="apple-spinner-large"></div>
        <p>Loading your order receipt...</p>
      </div>
    );
  }

  const txRef = txRefFromUrl || order?.paymentReference || `APL-TXN-${orderNumber}`;
  const isPaid = order?.paymentStatus === "Paid";
  const isBankTransfer = order?.paymentMethod === "bank_transfer";
  const isTelebirr = order?.paymentMethod === "telebirr";
  const isCod = order?.paymentMethod === "cod";

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        {/* Apple Success Header */}
        <div className="confirmation-hero">
          <div className="success-icon-wrap">
            <CheckCircle2 size={56} className="apple-check-icon" />
          </div>
          <span className="confirmation-eyebrow">Order Placed</span>
          <h1>Thank you for your order.</h1>
          <p className="confirmation-sub">
            We’ve sent a confirmation email to <strong>{order?.email || "your email"}</strong>.
          </p>

          <div className="order-ref-card">
            <div className="ref-block">
              <span className="ref-label">Order Number</span>
              <strong className="ref-value">{order?.id || orderNumber}</strong>
            </div>
            <div className="ref-divider"></div>
            <div className="ref-block">
              <span className="ref-label">Transaction Reference</span>
              <div className="ref-copy-group">
                <span className="ref-value monospace">{txRef}</span>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={() => copyToClipboard(txRef)}
                  title="Copy reference"
                >
                  {copiedRef ? <Check size={14} color="#34c759" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Payment State Box */}
        <div className={`payment-status-callout ${isPaid ? 'callout-paid' : 'callout-pending'}`}>
          <div className="callout-header">
            {isPaid ? (
              <>
                <CheckCircle2 size={22} color="#15803d" />
                <div>
                  <h4>Payment Confirmed</h4>
                  <p>Your payment has been successfully verified. Your order is now being processed by our Apple warehouse team.</p>
                </div>
              </>
            ) : (
              <>
                <Clock size={22} color="#b45309" />
                <div>
                  <h4>Payment Status: Pending Verification</h4>
                  <p>
                    {isBankTransfer
                      ? "Please complete your bank transfer and submit the transaction code below for immediate verification."
                      : isCod
                      ? "Your order is confirmed for Cash on Delivery. Please have the exact payment ready upon courier arrival."
                      : "Your payment authorization is being confirmed with the provider."}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Bank Transfer Slip Submission Form */}
          {isBankTransfer && (
            <div className="bank-slip-form-container">
              {slipSubmitted ? (
                <div className="slip-success-msg">
                  <CheckCircle2 size={20} color="#15803d" />
                  <div>
                    <strong>Verification Details Received!</strong>
                    <p>Our finance team will verify your transaction code and update your order to 'Paid'.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSlipSubmit} className="bank-slip-form">
                  <h5>Submit Bank Transfer Details</h5>
                  {slipError && <p className="slip-error">{slipError}</p>}
                  <div className="slip-grid">
                    <div className="slip-group">
                      <label>Deposited Bank</label>
                      <select
                        value={slipData.bankName}
                        onChange={(e) => setSlipData({ ...slipData, bankName: e.target.value })}
                      >
                        <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                        <option value="Awash Bank">Awash Bank</option>
                        <option value="Dashen Bank">Dashen Bank</option>
                        <option value="Bank of Abyssinia">Bank of Abyssinia</option>
                      </select>
                    </div>

                    <div className="slip-group">
                      <label>Transaction / Reference Number *</label>
                      <input
                        type="text"
                        placeholder="e.g. FT26084920491 or CBE/084921"
                        value={slipData.transferReference}
                        onChange={(e) => setSlipData({ ...slipData, transferReference: e.target.value })}
                        required
                      />
                    </div>

                    <div className="slip-group">
                      <label>Payer Full Name (optional)</label>
                      <input
                        type="text"
                        placeholder="Name on bank receipt"
                        value={slipData.senderName}
                        onChange={(e) => setSlipData({ ...slipData, senderName: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={slipSubmitting} className="slip-submit-btn">
                    {slipSubmitting ? "Submitting..." : (
                      <>
                        <Send size={14} /> Submit Reference for Verification
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="confirmation-details-grid">
          {/* Left Column: Items */}
          <div className="items-receipt-card">
            <h3>Items in Your Order</h3>
            <div className="receipt-items-list">
              {order?.items?.map((item) => (
                <div className="receipt-item-row" key={item.id}>
                  <div className="receipt-item-img">
                    <img
                      src={item.image || "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309?wid=400&hei=400&fmt=p-jpg"}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <div className="receipt-item-details">
                    <span className="receipt-item-title">{item.title}</span>
                    <span className="receipt-item-qty">Quantity: {item.quantity}</span>
                  </div>
                  <div className="receipt-item-price">
                    ${(parseFloat(item.price) * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="receipt-totals-table">
              <div className="totals-line">
                <span>Subtotal</span>
                <span>${(order?.subtotalAmount || (order?.totalAmount - (order?.shippingCost || 0))).toFixed(2)}</span>
              </div>
              <div className="totals-line">
                <span>Shipping</span>
                <span>{order?.shippingCost === 0 ? "FREE" : `$${Number(order?.shippingCost || 0).toFixed(2)}`}</span>
              </div>
              <div className="totals-line">
                <span>Estimated Tax</span>
                <span>${Number(order?.taxAmount || 0).toFixed(2)}</span>
              </div>
              <div className="totals-line total-highlight">
                <span>Total Amount</span>
                <span>${Number(order?.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Shipping & Payment Info */}
          <div className="shipping-receipt-card">
            <div className="info-section">
              <div className="section-head">
                <Truck size={18} color="#0071e3" />
                <h4>Delivery Details</h4>
              </div>
              <p className="shipping-text">
                <strong>Recipient:</strong> {order?.customerName}
              </p>
              <p className="shipping-text">
                <strong>Address:</strong> {order?.shippingAddress || "Apple Store Bole Branch Pickup"}
              </p>
              {order?.phone && (
                <p className="shipping-text">
                  <strong>Phone:</strong> {order?.phone}
                </p>
              )}
              <div className="delivery-timing-badge">
                <Clock size={14} />
                <span>Estimated Delivery: 1–2 business days</span>
              </div>
            </div>

            <div className="info-divider"></div>

            <div className="info-section">
              <div className="section-head">
                <CreditCard size={18} color="#0071e3" />
                <h4>Payment Information</h4>
              </div>
              <p className="shipping-text">
                <strong>Payment Method:</strong> {order?.paymentMethod?.toUpperCase().replace('_', ' ') || "CARD"}
              </p>
              <p className="shipping-text">
                <strong>Payment Status:</strong>{" "}
                <span className={`status-pill ${isPaid ? 'status-paid' : 'status-pending'}`}>
                  {order?.paymentStatus || "Pending"}
                </span>
              </p>
            </div>

            <div className="confirmation-actions">
              <Link to="/orders" className="apple-btn-primary">
                View in Orders & Purchases
                <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="apple-btn-secondary"
                onClick={() => window.print()}
              >
                <Printer size={16} />
                Print Receipt
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="confirmation-footer">
          <Link to="/store" className="back-to-store-link">
            ← Continue Shopping at Apple Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

