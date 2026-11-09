import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Lock,
  ChevronRight,
  Bookmark,
  Sparkles
} from "lucide-react";
import "./Bag.css";

const Bag = () => {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart, itemCount, subtotal } = useCart();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await fetch("/api/products/accessories?limit=4");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRecommended(data);
          }
        }
      } catch (err) {
        console.warn("Could not load recommendations:", err);
      }
    };

    fetchRecommended();
  }, []);

  const profileItems = [
    { icon: "▱", label: "Orders", path: "/orders" },
    { icon: "♧", label: "Your Saves", path: "/saves" },
    { icon: "◉", label: "Account Settings", path: "/account" },
    { icon: "⊙", label: "Sign in", path: "/signin" },
  ];

  const estimatedTax = Math.round(subtotal * 0.085 * 100) / 100;
  const estimatedShipping = subtotal >= 50 || subtotal === 0 ? 0 : 9.99;
  const grandTotal = Math.round((subtotal + estimatedTax + estimatedShipping) * 100) / 100;

  return (
    <main className="bag-page">
      <div className="bag-container">
        {cart.length === 0 ? (
          <section className="bag-empty">
            <div className="bag-empty-header">
              <h1>Your Bag is empty.</h1>
              <p className="bag-signin-message">
                <Link to="/signin">Sign in</Link> to see if you have any saved items, or explore the store.
              </p>
              <div className="bag-empty-actions">
                <Link to="/store" className="apple-btn apple-btn--primary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div className="bag-active-content">
            {/* Header Notification Banner */}
            <div className="bag-header-banner">
              <h2>Review your Bag.</h2>
              <p className="bag-banner-sub">
                Free delivery and free returns on all orders.
              </p>
            </div>

            <div className="bag-layout-grid">
              {/* Left Column: Bag Items */}
              <div className="bag-items-column">
                <div className="bag-items-list">
                  {cart.map((item) => {
                    const itemTotal = (parseFloat(item.price || 0) * (item.quantity || 1));
                    return (
                      <div className="bag-item-card" key={item.id}>
                        <div className="bag-item-image">
                          <img
                            src={item.image || "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309?wid=400&hei=400&fmt=p-jpg"}
                            alt={item.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop";
                            }}
                          />
                        </div>

                        <div className="bag-item-details">
                          <div className="bag-item-header">
                            <div>
                              {item.badge && <span className="bag-item-badge">{item.badge}</span>}
                              <h3 className="bag-item-title">{item.title}</h3>
                              <p className="bag-item-category">{item.category}</p>
                            </div>
                            <div className="bag-item-price-col">
                              <span className="bag-item-total">${itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              {item.quantity > 1 && (
                                <span className="bag-item-unit-price">${parseFloat(item.price).toFixed(2)} each</span>
                              )}
                            </div>
                          </div>

                          {/* Options if any */}
                          {item.options && Object.keys(item.options).length > 0 && (
                            <div className="bag-item-options">
                              {item.options.color && <span>Color: {item.options.color}</span>}
                              {item.options.storage && <span>Capacity: {item.options.storage}</span>}
                            </div>
                          )}

                          <div className="bag-item-perks">
                            <div className="perk-row">
                              <Truck size={15} />
                              <span>In stock and ready to ship</span>
                            </div>
                            <div className="perk-row">
                              <RotateCcw size={15} />
                              <span>Free returns within 14 days</span>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="bag-item-controls">
                            <div className="quantity-stepper">
                              <label htmlFor={`qty-${item.id}`}>Qty:</label>
                              <select
                                id={`qty-${item.id}`}
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, e.target.value)}
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              type="button"
                              className="bag-remove-btn"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Apple Value Props Bar */}
                <div className="bag-apple-assurance">
                  <div className="assurance-card">
                    <ShieldCheck size={22} color="#0071e3" />
                    <div>
                      <h4>Apple Store Quality Guarantee</h4>
                      <p>Every Apple product comes with 1-year limited warranty and 90 days of complimentary support.</p>
                    </div>
                  </div>
                  <div className="assurance-card">
                    <CreditCard size={22} color="#0071e3" />
                    <div>
                      <h4>Flexible Payment Methods</h4>
                      <p>Pay with Telebirr, Chapa, CBE Birr, Bank Transfer, Card, or Cash on Delivery.</p>
                    </div>
                  </div>
                </div>

                {/* Recommended Accessories Section */}
                {recommended.length > 0 && (
                  <div className="bag-recommended-section">
                    <div className="recommended-head">
                      <Sparkles size={18} color="#0071e3" />
                      <h3>Recommended for your Bag</h3>
                    </div>
                    <div className="recommended-grid">
                      {recommended.map((item) => (
                        <div key={item.id} className="rec-card">
                          <div className="rec-thumb">
                            <img
                              src={item.image_url || item.imageMain || "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop"}
                              alt={item.title}
                            />
                          </div>
                          <div className="rec-info">
                            <span className="rec-title">{item.title}</span>
                            <span className="rec-price">${Number(item.price_upfront || item.price || 39).toFixed(2)}</span>
                            <button
                              type="button"
                              className="rec-add-btn"
                              onClick={() => addToCart(item, 1)}
                            >
                              + Add to Bag
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary */}
              <div className="bag-summary-column">
                <div className="bag-summary-card">
                  <h3 className="summary-title">Summary</h3>

                  <div className="summary-rows">
                    <div className="summary-row">
                      <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                      <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className="summary-free">{estimatedShipping === 0 ? "FREE" : `$${estimatedShipping.toFixed(2)}`}</span>
                    </div>

                    <div className="summary-row">
                      <span>Estimated Tax</span>
                      <span>${estimatedTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row summary-total">
                      <span>Total</span>
                      <span>${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="summary-checkout-action">
                    <button
                      type="button"
                      className="apple-checkout-btn"
                      onClick={() => navigate('/checkout')}
                    >
                      <span>Check Out</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  <div className="summary-security-notice">
                    <Lock size={14} />
                    <span>Secure Checkout with 256-Bit SSL Encryption</span>
                  </div>

                  {/* Payment Methods Accepted */}
                  <div className="summary-payment-logos">
                    <span className="accepted-label">Accepted in Ethiopia & Globally</span>
                    <div className="payment-badges-row">
                      <span className="pay-pill">Telebirr</span>
                      <span className="pay-pill">Chapa</span>
                      <span className="pay-pill">CBE Birr</span>
                      <span className="pay-pill">Bank Transfer</span>
                      <span className="pay-pill">Visa / MC</span>
                      <span className="pay-pill">Cash on Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Apple My Profile Section */}
        <section className="bag-profile">
          <p className="bag-profile-heading">Need help or looking for your past purchases?</p>

          <nav className="bag-profile-links">
            {profileItems.map((item) => (
              <Link
                to={item.path}
                className="bag-profile-link"
                key={item.label}
              >
                <span className="bag-profile-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <ChevronRight size={14} className="bag-profile-arrow" />
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
};

export default Bag;
