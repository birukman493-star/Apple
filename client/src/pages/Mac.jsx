import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import placeholder from "../constants/placeholder";
import "./Mac.css";


import MacBookAir from "../assets/mac.png";
import MacBookPro from "../assets/mac1.png";
import IMac from "../assets/mac2.png";
import MacMini from "../assets/mac3.png";
import MacStudio from "../assets/mac4.png";
import MacPro from "../assets/mac5.png";

import Compare from "../assets/padd.jpg";
import HelpMeChoose from "../assets/iphone.png";
import TradeIn from "../assets/Trad-mac.png";
import SwitchMac from "../assets/switch-mac.png";
import MacAccessories from "../assets/mac-accessories.png";
import StudioDisplay from "../assets/studio-display.png";
import AppleWorld from "../assets/apple-world.png";

/* =========================
   STATIC MAC NAVIGATION PRODUCTS
========================= */
const MacProducts = [
  { id: "macbook-air", title: "MacBook Air", image: MacBookAir },
  { id: "macbook-pro", title: "MacBook Pro", image: MacBookPro },
  { id: "imac", title: "iMac", image: IMac },
  { id: "mac-mini", title: "Mac mini", image: MacMini, badge: "New" },
  { id: "mac-studio", title: "Mac Studio", image: MacStudio, badge: "New" },
  { id: "mac-pro", title: "Mac Pro", image: MacPro },
  { id: "compare", title: "Compare", image: Compare },
  { id: "help-me-choose", title: "Help Me Choose", image: HelpMeChoose },
  { id: "switch-to-mac", title: "Switch to Mac", image: SwitchMac },
];

const localMacImages = {
  "macbook air": MacBookAir,
  "macbook pro": MacBookPro,
  "imac": IMac,
  "mac mini": MacMini,
  "mac studio": MacStudio,
  "mac pro": MacPro,
  "studio display": StudioDisplay,
  "pro display xdr": StudioDisplay,
};

const getProductImage = (product) => {
  if (!product) return placeholder;
  // Try local assets first (always available)
  const title = (product.title || "").toLowerCase();
  for (const [key, img] of Object.entries(localMacImages)) {
    if (title.includes(key)) return img;
  }
  // Fall back to database image_url or placeholder
  return product.image_url || placeholder;
};

function Mac() {
  const navRef = useRef(null);

  // Dynamic States from Database
  const [lineupProducts, setLineupProducts] = useState([]);
  const [loadingLineup, setLoadingLineup] = useState(true);
  const [activeTab, setActiveTab] = useState("All products");

  const [shopBenefits, setShopBenefits] = useState([]);
  const [loadingBenefits, setLoadingBenefits] = useState(true);

  const [getToKnowMac, setGetToKnowMac] = useState([]);
  const [loadingGetToKnow, setLoadingGetToKnow] = useState(true);

  const [helpMeChoose, setHelpMeChoose] = useState([]);
  const [loadingHelp, setLoadingHelp] = useState(true);

  const [activeAppleWorld, setActiveAppleWorld] = useState(0);

  const scrollRight = () => {
    navRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  /* ==================================================
     DYNAMIC DATABASE FETCHES
  ================================================== */

  // 1. Fetch Explore Lineup Products
  useEffect(() => {
    fetch("/api/products/category/mac")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch Mac lineup products");
        return res.json();
      })
      .then((data) => {
        setLineupProducts(Array.isArray(data) ? data : []);
        setLoadingLineup(false);
      })
      .catch((err) => {
        console.error("Mac lineup error:", err);
        setLoadingLineup(false);
      });
  }, []);

  // 2. Fetch Shop Benefits ("Why Apple is the best place to shop Mac")
  useEffect(() => {
    fetch("/api/mac-shop-benefits")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch shop benefits");
        return res.json();
      })
      .then((data) => {
        setShopBenefits(Array.isArray(data) ? data : []);
        setLoadingBenefits(false);
      })
      .catch((err) => {
        console.error("Mac shop benefits error:", err);
        setLoadingBenefits(false);
      });
  }, []);

  // 3. Fetch Get To Know Mac
  useEffect(() => {
    fetch("/api/mac-get-to-know")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch Get to Know Mac");
        return res.json();
      })
      .then((data) => {
        setGetToKnowMac(Array.isArray(data) ? data : []);
        setLoadingGetToKnow(false);
      })
      .catch((err) => {
        console.error("Get to Know Mac error:", err);
        setLoadingGetToKnow(false);
      });
  }, []);

  // 4. Fetch Help Me Choose
  useEffect(() => {
    fetch("/api/mac-help-me-choose")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch Help Me Choose");
        return res.json();
      })
      .then((data) => {
        setHelpMeChoose(Array.isArray(data) ? data : []);
        setLoadingHelp(false);
      })
      .catch((err) => {
        console.error("Mac Help Me Choose error:", err);
        setLoadingHelp(false);
      });
  }, []);

  // Filter products by selected category tab
  const filteredProducts = lineupProducts.filter((p) => {
    if (activeTab === "All products") return true;
    if (!p.category) return true;
    return p.category.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <>
      {/* STATIC MAC NAVIGATION */}
      <section className="mac-nav-section">
        <div className="mac-nav-container">
          <h1>Mac</h1>
          <div className="mac-nav-wrapper">
            <div className="mac-nav-list" ref={navRef}>
              {MacProducts.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="mac-nav-item">
                  <div className="mac-nav-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <span className="mac-nav-title">{item.title}</span>
                  {item.badge ? (
                    <span className="mac-nav-badge">{item.badge}</span>
                  ) : (
                    <span className="mac-nav-badge-space">&nbsp;</span>
                  )}
                </a>
              ))}
            </div>
            <button
              type="button"
              className="mac-nav-arrow"
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          1. DYNAMIC: EXPLORE THE LINEUP
      ================================================== */}
      <section className="mac-lineup">
        <div className="lineup-container">
          <h2>Explore the lineup.</h2>

          <div className="lineup-tabs">
            {["All products", "Laptops", "Desktops", "Displays"].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {loadingLineup ? (
            <p className="lineup-loading">Loading Mac lineup from database...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="lineup-loading">No Mac products found in database.</p>
          ) : (
            <div className="lineup-products">
              {filteredProducts.map((product) => (
                <div className="lineup-product" key={product.id}>
                  <div className="mac-product-image">
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      onError={(e) => { e.target.onerror = null; e.target.src = placeholder; }}
                    />
                  </div>

                  <div className="color-dots">
                    <span></span><span></span><span></span><span></span>
                  </div>

                  {product.badge_text && (
                    <div className="product-badge">{product.badge_text}</div>
                  )}

                  <h3>{product.title}</h3>
                  <p className="product-description">{product.description}</p>

                  <p className="product-price">
                    {product.price_upfront && (
                      <>From ${Number(product.price_upfront).toLocaleString()}</>
                    )}
                    {product.price_monthly && (
                      <> or ${Number(product.price_monthly).toFixed(2)}/mo. for 12 mo.**</>
                    )}
                    {product.lease_monthly && (
                      <>
                        <br />
                        Lease from ${Number(product.lease_monthly).toFixed(2)}/mo. for 36 mo. with
                        <br /> Apple Upgrade<sup>◊</sup>
                      </>
                    )}
                  </p>

                  <div className="product-buttons">
                    <Link to={product.learn_more_link || "/mac"} className="learn-more" style={{ textDecoration: "none", display: "inline-block" }}>
                      Learn more
                    </Link>
                    <Link to={product.buy_link || "/store"} style={{ textDecoration: "none", color: "#0071e3", display: "inline-block" }}>
                      {product.buy_text || "Buy ›"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          2. DYNAMIC: WHY APPLE IS THE BEST PLACE TO SHOP MAC
      ================================================== */}
      <section className="mac-shop-section">
        <div className="mac-shop-header">
          <h2>Why Apple is the best place to shop Mac.</h2>
        </div>

        {loadingBenefits ? (
          <p className="lineup-loading">Loading benefits from database...</p>
        ) : shopBenefits.length === 0 ? (
          <p className="lineup-loading">No shop benefits configured.</p>
        ) : (
          <div className="mac-shop-scroll">
            <div className="mac-shop-track">
              {shopBenefits.map((benefit) => (
                <article className="mac-shop-card" key={benefit.id}>
                  {benefit.image_url && (
                    <div className="mac-shop-image">
                      <img
                        src={benefit.image_url}
                        alt={benefit.title}
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholder; }}
                      />
                    </div>
                  )}
                  <div className="mac-shop-content">
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ==================================================
          3. DYNAMIC: GET TO KNOW MAC
      ================================================== */}
      <section className="get-to-know-mac">
        <div className="get-to-know-header">
          <h2>Get to know Mac.</h2>
        </div>

        {loadingGetToKnow ? (
          <p className="lineup-loading">Loading Get to know Mac...</p>
        ) : getToKnowMac.length === 0 ? (
          <p className="lineup-loading">No items configured.</p>
        ) : (
          <div className="get-to-know-scroll">
            <div className="get-to-know-track">
              {getToKnowMac.map((item) => (
                <article className="get-to-know-card" key={item.id}>
                  {item.image_url && (
                    <div className="get-to-know-image">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholder; }}
                      />
                    </div>
                  )}
                  <div className="get-to-know-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ==================================================
          4. DYNAMIC: HELP ME CHOOSE
      ================================================== */}
      <section className="mac-help-section">
        <h2>Help Me Choose</h2>

        {loadingHelp ? (
          <p className="lineup-loading">Loading Help Me Choose...</p>
        ) : helpMeChoose.length === 0 ? (
          <p className="lineup-loading">No Help Me Choose options available.</p>
        ) : (
          helpMeChoose.map((item) => (
            <div className="mac-help-card" key={item.id}>
              <div className="mac-help-content">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                {item.button_url ? (
                  <a href={item.button_url} className="mac-help-button">
                    {item.button_text || "Answer a few questions"}
                  </a>
                ) : (
                  <button className="mac-help-button">
                    {item.button_text || "Answer a few questions"}
                  </button>
                )}
              </div>
              {item.image_url && (
                <div className="mac-help-image">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    onError={(e) => { e.target.onerror = null; e.target.src = placeholder; }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* STATIC: SWITCH TO MAC */}
      <section className="switch-mac-section">
        <div className="switch-mac-container">
          <h2>Switch to Mac.</h2>
          <div className="switch-mac-grid">
            <article className="switch-mac-card">
              <div className="switch-mac-content">
                <h3>Give us the old. Save on<br />the new.</h3>
                <p>
                  With Apple Trade In, you can get a great value for your current device and apply it toward a new one.
                  If your device isn't eligible for credit, we'll recycle it for free.
                </p>
                <a href="#" className="switch-mac-link">See what your device is worth ›</a>
              </div>
              <div className="switch-mac-image">
                <img src={TradeIn} alt="Apple Trade In" />
              </div>
            </article>

            <article className="switch-mac-card">
              <div className="switch-mac-content">
                <h3>Mac does that.</h3>
                <p>See how easy it is to move to Mac.</p>
                <a href="#" className="switch-mac-link">Learn more ›</a>
              </div>
              <div className="switch-mac-image">
                <img src={SwitchMac} alt="Mac experience" />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* STATIC: MAC ESSENTIALS */}
      <section className="mac-essentials-section">
        <div className="mac-essentials-container">
          <h2>Mac essentials.</h2>
          <div className="mac-essentials-grid">
            <article className="mac-essential-card">
              <div className="mac-essential-content">
                <h3>Mac accessories</h3>
                <p>Explore keyboards, mice, and other essentials.</p>
                <a href="#" className="mac-essential-link">Shop Mac accessories ›</a>
              </div>
              <div className="mac-essential-image">
                <img src={MacAccessories} alt="Mac accessories" />
              </div>
            </article>

            <article className="mac-essential-card">
              <div className="mac-essential-content">
                <h3>Studio Display</h3>
                <p>The 27-inch 5K Retina display pairs beautifully<br className="desktop-break" />with Mac.</p>
                <a href="#" className="mac-essential-link">Learn more ›</a>
              </div>
              <div className="mac-essential-image">
                <img src={StudioDisplay} alt="Studio Display" />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* STATIC: UNLOCK THE WORLD OF APPLE */}
      <section className="apple-world-section">
        <div className="apple-world-header">
          <h2>Unlock the world of Apple.</h2>
          <a href="#">Learn how Apple devices work better together <span>›</span></a>
        </div>

        <div className="apple-world-card">
          <div className="apple-world-accordion">
            <div className={`apple-world-item ${activeAppleWorld === 0 ? "active" : ""}`}>
              <button
                className="apple-world-button"
                onClick={() => setActiveAppleWorld(activeAppleWorld === 0 ? -1 : 0)}
              >
                <span>Mac and iPhone</span>
                <span className="apple-world-arrow">{activeAppleWorld === 0 ? "⌃" : "⌄"}</span>
              </button>
              {activeAppleWorld === 0 && (
                <div className="apple-world-content">
                  <p>Make and receive iPhone calls on your Mac, send messages, and continue your work seamlessly across devices.</p>
                </div>
              )}
            </div>

            <div className={`apple-world-item ${activeAppleWorld === 1 ? "active" : ""}`}>
              <button
                className="apple-world-button"
                onClick={() => setActiveAppleWorld(activeAppleWorld === 1 ? -1 : 1)}
              >
                <span>Mac and iPad</span>
                <span className="apple-world-arrow">{activeAppleWorld === 1 ? "⌃" : "⌄"}</span>
              </button>
              {activeAppleWorld === 1 && (
                <div className="apple-world-content">
                  <p>Use your iPad alongside your Mac to extend your workspace and move between devices easily.</p>
                </div>
              )}
            </div>

            <div className={`apple-world-item ${activeAppleWorld === 2 ? "active" : ""}`}>
              <button
                className="apple-world-button"
                onClick={() => setActiveAppleWorld(activeAppleWorld === 2 ? -1 : 2)}
              >
                <span>Mac and Apple Watch</span>
                <span className="apple-world-arrow">{activeAppleWorld === 2 ? "⌃" : "⌄"}</span>
              </button>
              {activeAppleWorld === 2 && (
                <div className="apple-world-content">
                  <p>Automatically log in to your Mac when you're wearing your Apple Watch nearby.</p>
                </div>
              )}
            </div>
          </div>

          <div className="apple-world-image">
            <img src={AppleWorld} alt="Mac working with Apple devices" />
          </div>
        </div>
      </section>

      {/* STATIC: FOOTER NAVIGATION */}
      <section className="mac-footer-nav">
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", paddingLeft: "4rem", paddingTop: "6rem", paddingBottom: "3rem" }}>MAC</h1>
        <div className="mac-footer-container">
          <div className="mac-footer-column">
            <h3>Explore Mac</h3>
            <Link to="#">Explore All Mac</Link>
            <Link to="#">MacBook Air</Link>
            <Link to="#">MacBook Pro</Link>
            <Link to="#">iMac</Link>
            <Link to="#">Mac mini</Link>
            <Link to="#">Mac Studio</Link>
            <Link to="#">Displays</Link>
            <Link to="#">Compare Mac</Link>
          </div>

          <div className="mac-footer-column">
            <h3>Shop Mac</h3>
            <Link to="#">Shop Mac</Link>
            <Link to="#">Help Me Choose</Link>
            <Link to="#">Mac Accessories</Link>
            <Link to="#">Apple Upgrade</Link>
            <Link to="#">Apple Trade In</Link>
          </div>

          <div className="mac-footer-column">
            <h3>More from Mac</h3>
            <Link to="#">Mac Support</Link>
            <Link to="#">AppleCare</Link>
            <Link to="#">macOS</Link>
            <Link to="#">Apple Intelligence</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Mac;