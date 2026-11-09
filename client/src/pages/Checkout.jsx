import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Smartphone,
  Building,
  DollarSign,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Package,
  Sparkles,
  Info
} from "lucide-react";
import "./Checkout.css";

const API_BASE = "http://localhost:5000/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, itemCount, subtotal: localSubtotal } = useCart();

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/bag");
    }
  }, [cart, navigate]);

  // Current logged in user (if any)
  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  // Customer Contact State
  const [formData, setFormData] = useState({
    firstName: savedUser?.firstName || "",
    lastName: savedUser?.lastName || "",
    email: savedUser?.email || "",
    phone: savedUser?.phone || "+251 ",
    streetAddress: savedUser?.shippingAddress || "",
    aptSuite: "",
    city: "Addis Ababa",
    region: "Addis Ababa",
    postalCode: "1000",
    orderNotes: ""
  });

  // Delivery Method State
  const [deliveryMethod, setDeliveryMethod] = useState("shipping"); // 'shipping' | 'express' | 'pickup'

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState("telebirr"); // 'telebirr' | 'chapa' | 'cbe_birr' | 'bank_transfer' | 'card' | 'cod'

  // Sub-method states
  const [telebirrPhone, setTelebirrPhone] = useState(savedUser?.phone || "0911000000");
  const [selectedBank, setSelectedBank] = useState("cbe");
  const [cardDetails, setCardDetails] = useState({
    cardholderName: `${savedUser?.firstName || ""} ${savedUser?.lastName || ""}`.trim() || "John Doe",
    cardNumber: "4242 •••• •••• 4242",
    expiry: "12/28",
    cvv: "•••",
    cardBrand: "Visa"
  });

  // Server-verified calculation
  const [serverCalc, setServerCalc] = useState({
    subtotal: localSubtotal,
    shippingCost: 0,
    taxAmount: Math.round(localSubtotal * 0.085 * 100) / 100,
    totalAmount: Math.round((localSubtotal + Math.round(localSubtotal * 0.085 * 100) / 100) * 100) / 100
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeStep, setActiveStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  // Fetch verified calculation from backend
  useEffect(() => {
    if (!cart || cart.length === 0) return;

    const fetchCalculation = async () => {
      try {
        const res = await fetch(`${API_BASE}/checkout/calculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart.map(item => ({
              productId: item.productId || item.id,
              id: item.productId || item.id,
              quantity: item.quantity,
              price: item.price,
              title: item.title,
              image: item.image
            })),
            deliveryMethod: deliveryMethod
          })
        });

        if (res.ok) {
          const data = await res.json();
          setServerCalc(data);
        }
      } catch (err) {
        console.warn("Backend calculation fallback to local calculation:", err);
      }
    };

    fetchCalculation();
  }, [cart, deliveryMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  // Quick fill test card
  const fillTestCard = (brand = "Visa") => {
    if (brand === "Visa") {
      setCardDetails({
        cardholderName: "Alex Johnson",
        cardNumber: "4242 4242 4242 4242",
        expiry: "08/29",
        cvv: "345",
        cardBrand: "Visa"
      });
    } else {
      setCardDetails({
        cardholderName: "Alex Johnson",
        cardNumber: "5555 5555 5555 4444",
        expiry: "11/29",
        cvv: "888",
        cardBrand: "Mastercard"
      });
    }
  };

  // Submit order & initialize payment
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg("Please enter your first and last name.");
      setActiveStep(1);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please provide a valid email address for your order confirmation.");
      setActiveStep(1);
      return;
    }

    if (deliveryMethod !== "pickup" && !formData.streetAddress.trim()) {
      setErrorMsg("Please provide your delivery street address.");
      setActiveStep(1);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        customerEmail: formData.email.trim().toLowerCase(),
        customerPhone: formData.phone.trim(),
        shippingAddress: deliveryMethod === "pickup"
          ? "Apple Store Official Pickup - Bole Medhanialem Branch, Addis Ababa"
          : `${formData.streetAddress}, ${formData.aptSuite ? formData.aptSuite + ', ' : ''}${formData.city}, ${formData.region}`,
        deliveryMethod: deliveryMethod,
        paymentMethod: paymentMethod,
        orderNotes: formData.orderNotes,
        userId: savedUser?.id || null,
        items: cart.map(item => ({
          productId: item.productId || item.id,
          id: item.productId || item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        cardData: paymentMethod === "card" ? {
          cardBrand: cardDetails.cardBrand,
          cardNumber: cardDetails.cardNumber
        } : {},
        extraDetails: {
          telebirrPhone: telebirrPhone,
          selectedBank: selectedBank
        }
      };

      const response = await fetch(`${API_BASE}/payments/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to process payment. Please try again.");
      }

      // Order placed successfully! Clear cart
      clearCart();

      // If Chapa returns external checkout URL in live mode
      if (result.gatewayResult?.checkoutUrl && !result.gatewayResult.checkoutUrl.startsWith("/")) {
        window.location.href = result.gatewayResult.checkoutUrl;
        return;
      }

      // Navigate to Apple confirmation page
      navigate(`/order-confirmation/${result.orderNumber}?ref=${result.transactionReference}`);

    } catch (err) {
      console.error("Checkout submission error:", err);
      setErrorMsg(err.message || "An unexpected error occurred during checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bankAccounts = {
    cbe: {
      name: "Commercial Bank of Ethiopia (CBE)",
      accountNumber: "1000293847561",
      accountName: "Apple Store Ethiopia Ltd",
      branch: "Finfine Main Branch"
    },
    awash: {
      name: "Awash Bank",
      accountNumber: "01320495867100",
      accountName: "Apple Store Ethiopia Ltd",
      branch: "Bole Medhanialem Branch"
    },
    dashen: {
      name: "Dashen Bank",
      accountNumber: "503928174625",
      accountName: "Apple Store Ethiopia Ltd",
      branch: "Meskel Square Branch"
    },
    abyssinia: {
      name: "Bank of Abyssinia",
      accountNumber: "84920173",
      accountName: "Apple Store Ethiopia Ltd",
      branch: "Kazanchis Branch"
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Checkout Header */}
        <header className="checkout-header">
          <div className="checkout-brand">
            <Link to="/" className="apple-logo-link"></Link>
            <span className="checkout-title">Checkout</span>
          </div>
          <div className="checkout-header-secure">
            <Lock size={15} />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </header>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="checkout-error-banner">
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="checkout-layout">
          {/* Main Left Form Column */}
          <main className="checkout-main-col">
            <form onSubmit={handlePlaceOrder}>
              {/* STEP 1: DELIVERY & CONTACT INFORMATION */}
              <section className={`checkout-step-section ${activeStep === 1 ? 'step-active' : ''}`}>
                <div className="step-header" onClick={() => setActiveStep(1)}>
                  <span className="step-number">1</span>
                  <div className="step-title-box">
                    <h2>Delivery & Contact</h2>
                    <p>Enter your contact details and where you'd like your order delivered.</p>
                  </div>
                </div>

                <div className="step-content">
                  {/* Delivery Mode Selection */}
                  <div className="delivery-methods-grid">
                    <label
                      className={`delivery-card ${deliveryMethod === 'shipping' ? 'selected' : ''}`}
                      onClick={() => setDeliveryMethod('shipping')}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'shipping'}
                        onChange={() => setDeliveryMethod('shipping')}
                      />
                      <Truck size={22} className="method-icon" />
                      <div className="method-info">
                        <strong>Standard Delivery</strong>
                        <span>Delivers in 1–2 business days</span>
                      </div>
                      <span className="method-cost">FREE</span>
                    </label>

                    <label
                      className={`delivery-card ${deliveryMethod === 'express' ? 'selected' : ''}`}
                      onClick={() => setDeliveryMethod('express')}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                      />
                      <Clock size={22} className="method-icon" />
                      <div className="method-info">
                        <strong>Express 2-Hour Delivery</strong>
                        <span>Courier hand-delivery today</span>
                      </div>
                      <span className="method-cost">$25.00</span>
                    </label>

                    <label
                      className={`delivery-card ${deliveryMethod === 'pickup' ? 'selected' : ''}`}
                      onClick={() => setDeliveryMethod('pickup')}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                      />
                      <Building size={22} className="method-icon" />
                      <div className="method-info">
                        <strong>Apple Store Pickup</strong>
                        <span>Available today at Bole Branch</span>
                      </div>
                      <span className="method-cost">FREE</span>
                    </label>
                  </div>

                  {/* Contact Fields */}
                  <div className="form-fields-grid">
                    <div className="form-row form-row--2">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="e.g. Alex"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="e.g. Johnson"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row form-row--2">
                      <div className="form-group">
                        <label>Email Address for Order Confirmation *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="alex@icloud.com"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Mobile Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+251 911 234567"
                          required
                        />
                      </div>
                    </div>

                    {deliveryMethod !== "pickup" && (
                      <>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Street Address *</label>
                            <input
                              type="text"
                              name="streetAddress"
                              value={formData.streetAddress}
                              onChange={handleInputChange}
                              placeholder="e.g. Bole Road, Near Medhanialem Mall"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-row form-row--3">
                          <div className="form-group">
                            <label>Apartment, suite, unit (optional)</label>
                            <input
                              type="text"
                              name="aptSuite"
                              value={formData.aptSuite}
                              onChange={handleInputChange}
                              placeholder="Apt 4B"
                            />
                          </div>
                          <div className="form-group">
                            <label>City / Sub-City *</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Addis Ababa"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Region / State</label>
                            <input
                              type="text"
                              name="region"
                              value={formData.region}
                              onChange={handleInputChange}
                              placeholder="Addis Ababa"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="form-row">
                      <div className="form-group">
                        <label>Delivery Instructions (optional)</label>
                        <textarea
                          name="orderNotes"
                          rows="2"
                          value={formData.orderNotes}
                          onChange={handleInputChange}
                          placeholder="Leave with concierge or ring doorbell..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="step-actions">
                    <button
                      type="button"
                      className="apple-continue-btn"
                      onClick={() => setActiveStep(2)}
                    >
                      Continue to Payment
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </section>

              {/* STEP 2: MODERN APPLE-STYLE PAYMENT CATEGORY SELECTION */}
              <section className={`checkout-step-section ${activeStep === 2 ? 'step-active' : ''}`}>
                <div className="step-header" onClick={() => setActiveStep(2)}>
                  <span className="step-number">2</span>
                  <div className="step-title-box">
                    <h2>Payment Method</h2>
                    <p>Select how you'd like to pay. All payment options are encrypted and verified.</p>
                  </div>
                </div>

                <div className="step-content">
                  {/* PAYMENT CATEGORY SELECTION CARDS */}
                  <div className="payment-categories-list">
                    {/* 1. Telebirr */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'telebirr' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('telebirr')}
                    >
                      <div className="card-top-row">
                        <div className="radio-indicator">
                          <div className="radio-dot"></div>
                        </div>
                        <div className="method-label-box">
                          <div className="method-title-badge">
                            <span className="method-name">Telebirr</span>
                            <span className="method-pill-badge ethio-badge">Mobile Money</span>
                          </div>
                          <span className="method-sub">Pay instantly via Telebirr SuperApp, Web, or USSD (*127#)</span>
                        </div>
                        <div className="method-logo-badge">
                          <Smartphone size={22} color="#0071e3" />
                        </div>
                      </div>

                      {paymentMethod === 'telebirr' && (
                        <div className="method-expanded-content">
                          <div className="instruction-box">
                            <p>
                              An official Telebirr payment prompt will be initiated. In test mode, you can use any phone number to simulate instant approval.
                            </p>
                          </div>
                          <div className="form-group" style={{ maxWidth: "340px", marginTop: "12px" }}>
                            <label>Registered Telebirr Phone Number</label>
                            <input
                              type="tel"
                              value={telebirrPhone}
                              onChange={(e) => setTelebirrPhone(e.target.value)}
                              placeholder="0911000000"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Chapa Gateway */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'chapa' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('chapa')}
                    >
                      <div className="card-top-row">
                        <div className="radio-indicator">
                          <div className="radio-dot"></div>
                        </div>
                        <div className="method-label-box">
                          <div className="method-title-badge">
                            <span className="method-name">Chapa</span>
                            <span className="method-pill-badge chapa-badge">Multi-Gateway</span>
                          </div>
                          <span className="method-sub">Telebirr, CBE Birr, Awash, local debit & international cards via Chapa</span>
                        </div>
                        <div className="method-logo-badge">
                          <Sparkles size={22} color="#7c3aed" />
                        </div>
                      </div>

                      {paymentMethod === 'chapa' && (
                        <div className="method-expanded-content">
                          <div className="instruction-box">
                            <p>
                              You will be seamlessly connected to Chapa's official 256-bit secure checkout portal. You can select Telebirr, CBE Birr, or Credit Cards directly on their hosted checkout.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. CBE Birr */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'cbe_birr' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('cbe_birr')}
                    >
                      <div className="card-top-row">
                        <div className="radio-indicator">
                          <div className="radio-dot"></div>
                        </div>
                        <div className="method-label-box">
                          <div className="method-title-badge">
                            <span className="method-name">CBE Birr</span>
                            <span className="method-pill-badge cbe-badge">Mobile Banking</span>
                          </div>
                          <span className="method-sub">Commercial Bank of Ethiopia Mobile Banking and USSD (*847#)</span>
                        </div>
                        <div className="method-logo-badge">
                          <Building size={22} color="#9333ea" />
                        </div>
                      </div>

                      {paymentMethod === 'cbe_birr' && (
                        <div className="method-expanded-content">
                          <div className="instruction-box">
                            <p>
                              Pay to CBE Birr Merchant ID: <strong>884920</strong>. After ordering, dial *847# or open CBE Birr App to complete the payment with your order number.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Bank Transfer (Ethiopian Banks) */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('bank_transfer')}
                    >
                      <div className="card-top-row">
                        <div className="radio-indicator">
                          <div className="radio-dot"></div>
                        </div>
                        <div className="method-label-box">
                          <div className="method-title-badge">
                            <span className="method-name">Bank Transfer</span>
                            <span className="method-pill-badge bank-badge">CBE, Awash, Dashen, Abyssinia</span>
                          </div>
                          <span className="method-sub">Direct transfer or mobile app payment to our verified business bank accounts</span>
                        </div>
                        <div className="method-logo-badge">
                          <Building size={22} color="#059669" />
                        </div>
                      </div>

                      {paymentMethod === 'bank_transfer' && (
                        <div className="method-expanded-content">
                          <div className="bank-selector-tabs">
                            {Object.entries(bankAccounts).map(([key, bank]) => (
                              <button
                                key={key}
                                type="button"
                                className={`bank-tab-btn ${selectedBank === key ? 'active' : ''}`}
                                onClick={() => setSelectedBank(key)}
                              >
                                {bank.name.split(' ')[0]} {bank.name.includes('Abyssinia') ? 'Abyssinia' : ''}
                              </button>
                            ))}
                          </div>

                          <div className="bank-account-details-box">
                            <div className="bank-detail-item">
                              <span className="detail-label">Bank:</span>
                              <strong>{bankAccounts[selectedBank].name}</strong>
                            </div>
                            <div className="bank-detail-item">
                              <span className="detail-label">Account Name:</span>
                              <span>{bankAccounts[selectedBank].accountName}</span>
                            </div>
                            <div className="bank-detail-item">
                              <span className="detail-label">Account Number:</span>
                              <strong className="account-num-highlight">{bankAccounts[selectedBank].accountNumber}</strong>
                            </div>
                            <div className="bank-detail-item">
                              <span className="detail-label">Branch:</span>
                              <span>{bankAccounts[selectedBank].branch}</span>
                            </div>
                          </div>

                          <div className="instruction-box" style={{ marginTop: "12px" }}>
                            <p>
                              Please transfer the exact total of <strong>${serverCalc.totalAmount.toFixed(2)}</strong>. Use your Order Number as the transfer reason. You will be able to submit your transaction reference number on the confirmation page.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 5. Credit / Debit Card */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="card-top-row">
                        <div className="radio-indicator">
                          <div className="radio-dot"></div>
                        </div>
                        <div className="method-label-box">
                          <div className="method-title-badge">
                            <span className="method-name">Credit or Debit Card</span>
                            <span className="method-pill-badge card-badge">Visa / Mastercard</span>
                          </div>
                          <span className="method-sub">Tokenized and processed securely. We never store CVV or sensitive credentials.</span>
                        </div>
                        <div className="method-logo-badge">
                          <CreditCard size={22} color="#0071e3" />
                        </div>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="method-expanded-content">
                          <div className="test-card-banner">
                            <span>Sandbox Mode Active:</span>
                            <div className="test-card-buttons">
                              <button
                                type="button"
                                className="test-card-btn"
                                onClick={() => fillTestCard("Visa")}
                              >
                                Fill Test Visa (4242)
                              </button>
                              <button
                                type="button"
                                className="test-card-btn"
                                onClick={() => fillTestCard("Mastercard")}
                              >
                                Fill Test Mastercard (5555)
                              </button>
                            </div>
                          </div>

                          <div className="card-inputs-grid">
                            <div className="form-group">
                              <label>Cardholder Name</label>
                              <input
                                type="text"
                                name="cardholderName"
                                value={cardDetails.cardholderName}
                                onChange={handleCardInputChange}
                                placeholder="Name on card"
                              />
                            </div>

                            <div className="form-group">
                              <label>Card Number</label>
                              <input
                                type="text"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleCardInputChange}
                                placeholder="•••• •••• •••• ••••"
                              />
                            </div>

                            <div className="form-row form-row--2" style={{ marginBottom: 0 }}>
                              <div className="form-group">
                                <label>Expiration (MM/YY)</label>
                                <input
                                  type="text"
                                  name="expiry"
                                  value={cardDetails.expiry}
                                  onChange={handleCardInputChange}
                                  placeholder="MM/YY"
                                />
                              </div>
                              <div className="form-group">
                                <label>Security Code (CVV)</label>
                                <input
                                  type="password"
                                  name="cvv"
                                  maxLength="4"
                                  value={cardDetails.cvv}
                                  onChange={handleCardInputChange}
                                  placeholder="CVV"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 6. Cash on Delivery (COD) */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="card-top-row">
                        <div className="radio-indicator">
                          <div className="radio-dot"></div>
                        </div>
                        <div className="method-label-box">
                          <div className="method-title-badge">
                            <span className="method-name">Cash on Delivery (COD)</span>
                            <span className="method-pill-badge cod-badge">Doorstep</span>
                          </div>
                          <span className="method-sub">Pay cash or mobile transfer when your package arrives at your doorstep</span>
                        </div>
                        <div className="method-logo-badge">
                          <DollarSign size={22} color="#059669" />
                        </div>
                      </div>

                      {paymentMethod === 'cod' && (
                        <div className="method-expanded-content">
                          <div className="instruction-box">
                            <p>
                              Please have the exact amount of <strong>${serverCalc.totalAmount.toFixed(2)}</strong> ready. Our authorized courier will issue an official Apple Store delivery receipt upon receiving payment.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="step-actions">
                    <button
                      type="submit"
                      disabled={loading}
                      className="apple-place-order-btn"
                    >
                      {loading ? (
                        <span className="btn-spinner-text">
                          <span className="apple-spinner"></span>
                          Processing Secure Order...
                        </span>
                      ) : (
                        <span>Place Your Order (${serverCalc.totalAmount.toFixed(2)})</span>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            </form>
          </main>

          {/* Right Sidebar: Sticky Order Summary */}
          <aside className="checkout-sidebar-col">
            <div className="checkout-order-summary-box">
              <div
                className="summary-collapsible-header"
                onClick={() => setSummaryExpanded(!summaryExpanded)}
              >
                <div className="summary-head-title">
                  <Package size={18} />
                  <h3>In Your Bag ({itemCount} item{itemCount !== 1 ? 's' : ''})</h3>
                </div>
                <div className="summary-head-price">
                  <span>${serverCalc.totalAmount.toFixed(2)}</span>
                  {summaryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Items List (expandable on mobile, always visible on desktop) */}
              <div className={`summary-items-list ${summaryExpanded ? 'mobile-expanded' : ''}`}>
                {cart.map((item) => (
                  <div className="summary-item-row" key={item.id}>
                    <div className="summary-item-img">
                      <img
                        src={item.image || "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309?wid=400&hei=400&fmt=p-jpg"}
                        alt={item.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop";
                        }}
                      />
                    </div>
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.title}</span>
                      <span className="summary-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <div className="summary-item-price">
                      ${(parseFloat(item.price) * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="summary-totals-breakdown">
                <div className="totals-row">
                  <span>Subtotal</span>
                  <span>${serverCalc.subtotal.toFixed(2)}</span>
                </div>
                <div className="totals-row">
                  <span>Shipping</span>
                  <span className={serverCalc.shippingCost === 0 ? "free-text" : ""}>
                    {serverCalc.shippingCost === 0 ? "FREE" : `$${serverCalc.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="totals-row">
                  <span>Estimated Tax</span>
                  <span>${serverCalc.taxAmount.toFixed(2)}</span>
                </div>

                <div className="totals-divider"></div>

                <div className="totals-row grand-total-row">
                  <span>Total</span>
                  <span className="grand-total-amount">${serverCalc.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Value propositions */}
              <div className="summary-benefits">
                <div className="benefit-item">
                  <Truck size={15} />
                  <span>Free shipping & free returns</span>
                </div>
                <div className="benefit-item">
                  <ShieldCheck size={15} />
                  <span>Apple 1-Year Limited Warranty</span>
                </div>
                <div className="benefit-item">
                  <Lock size={15} />
                  <span>Official Merchant Guarantee</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

