
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import placeholder from "../constants/placeholder";
import "./ipad.css";

import ApplePencilImage from "../assets/ipad6.png";
import MagicKeyboardImage from "../assets/ipad7.png";

import iPadPro from "../assets/ipad1.png";
import iPadAir from "../assets/ipad2.png";
import iPad from "../assets/ipad3.png";
import iPadMini from "../assets/ipad4.png";
import Compare from "../assets/ipad5.png";
import ApplePencil from "../assets/ipad6.png";
import Keyboards from "../assets/ipad7.png";
import Accessories from "../assets/ipad8.png";
import iPadOS from "../assets/ipad9.png";
import ShopiPad from "../assets/ipad10.png";
import Iphoncamera from "../assets/ipadcamera.png";

const localIpadImages = {
  "ipad pro": iPadPro,
  "ipad air": iPadAir,
  "ipad mini": iPadMini,
  "ipad": iPad,
};

const getIpadImage = (product) => {
  if (!product) return placeholder;
  const title = (product.title || "").toLowerCase();
  for (const [key, img] of Object.entries(localIpadImages)) {
    if (title.includes(key)) return img;
  }
  return product.image_url || placeholder;
};

const renderColors = (colors) => {
  let list = [];
  if (Array.isArray(colors)) {
    list = colors;
  } else if (typeof colors === "string") {
    try {
      const parsed = JSON.parse(colors);
      if (Array.isArray(parsed)) list = parsed;
      else list = colors.split(",");
    } catch {
      list = colors.split(",");
    }
  }
  if (!list.length) {
    list = ["#1d1d1f", "#e3e4e5"];
  }
  return list.map((color, index) => (
    <span
      key={index}
      className="ipad-color-dot"
      style={{ backgroundColor: color.trim() }}
      title={color.trim()}
    />
  ));
};

function Ipad() {
  const items = [
    { image: iPadPro, title: "iPad Pro" },
    { image: iPadAir, title: "iPad Air" },
    { image: iPad, title: "iPad" },
    { image: iPadMini, title: "iPad mini" },
    { image: Compare, title: "Compare" },
    { image: ApplePencil, title: "Apple Pencil" },
    { image: Keyboards, title: "Keyboards" },
    { image: Accessories, title: "Accessories" },
    { image: iPadOS, title: "iPadOS 27" },
    { image: ShopiPad, title: "Shop iPad" },
  ];

  const [ipadProducts, setIpadProducts] = useState([]);
  const [ipadLoading, setIpadLoading] = useState(true);
  const [ipadBenefits, setIpadBenefits] = useState([]);
  const [ipadBenefitsLoading, setIpadBenefitsLoading] = useState(true);
  const [ipadKnowItems, setIpadKnowItems] = useState([]);
  const [ipadKnowLoading, setIpadKnowLoading] = useState(true);
  const [selectedIpadItem, setSelectedIpadItem] = useState(null);
  const [activeConnection, setActiveConnection] = useState(0);

  useEffect(() => {
    const fetchIpadProducts = async () => {
      try {
        const response = await fetch("/api/products/category/ipad");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        const products = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : [];
        setIpadProducts(products);
      } catch (error) {
        console.error("Error loading iPad products:", error);
        fetch("http://localhost:5000/api/products/category/ipad")
          .then((res) => res.json())
          .then((data) => setIpadProducts(Array.isArray(data) ? data : []))
          .catch(() => setIpadProducts([]));
      } finally {
        setIpadLoading(false);
      }
    };

    fetchIpadProducts();
  }, []);

  // Fetch iPad shop benefits from backend
  useEffect(() => {
    const fetchIpadBenefits = async () => {
      try {
        const response = await fetch("/api/ipad-shop-benefits");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setIpadBenefits(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching iPad benefits:", error);
        fetch("http://localhost:5000/api/ipad-shop-benefits")
          .then((res) => res.json())
          .then((data) => setIpadBenefits(Array.isArray(data) ? data : []))
          .catch(() => setIpadBenefits([]));
      } finally {
        setIpadBenefitsLoading(false);
      }
    };

    fetchIpadBenefits();
  }, []);

  useEffect(() => {
    const fetchIpadKnowItems = async () => {
      try {
        const response = await fetch("/api/ipad-get-to-know");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setIpadKnowItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching iPad information:", error);
        fetch("http://localhost:5000/api/ipad-get-to-know")
          .then((res) => res.json())
          .then((data) => setIpadKnowItems(Array.isArray(data) ? data : []))
          .catch(() => setIpadKnowItems([]));
      } finally {
        setIpadKnowLoading(false);
      }
    };

    fetchIpadKnowItems();
  }, []);

  return (
    <>
      {/* =========================
          IPAD NAVIGATION
      ========================= */}
      <section className="ipad-nav">
        <div className="ipad-nav-container">
          <h1 className="ipad-nav-title">iPad</h1>

          <div className="ipad-nav-items">
            {items.map((item, index) => (
              <a
                href="#"
                className="ipad-nav-item"
                key={index}
              >
                <div className="ipad-nav-image">
                  <img
                    src={item.image}
                    alt={item.title}
                  />
                </div>

                <span>{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          IPAD EXPLORE THE LINEUP
      ========================= */}
      <section className="ipad-lineup">
        <div className="ipad-lineup-header">
          <h2>Explore the lineup.</h2>

          <a
            href="/ipad/compare"
            className="ipad-compare-link"
          >
            Compare all models <span>›</span>
          </a>
        </div>

        {ipadLoading ? (
          <p>Loading iPad products...</p>
        ) : ipadProducts.length === 0 ? (
          <p>No iPad products found. Check your API and database.</p>
        ) : (
          <div className="ipad-lineup-grid">
            {ipadProducts.map((product) => (
              <div
                className="ipad-lineup-card"
                key={product.id}
              >
                {/* IMAGE */}
                <div className="ipad-lineup-image">
                  <img
                    src={getIpadImage(product)}
                    alt={product.title || "iPad"}
                    onError={(e) => { e.target.onerror = null; e.target.src = placeholder; }}
                  />
                </div>

                {/* COLORS */}
                <div className="ipad-lineup-colors">
                  {renderColors(product.colors)}
                </div>

                {/* BADGE */}
                {product.badge_text && (
                  <div className="ipad-product-badge">{product.badge_text}</div>
                )}

                {/* TITLE */}
                <h3>{product.title}</h3>

                {/* DESCRIPTION */}
                <p className="ipad-product-description">
                  {product.description}
                </p>

                {/* PRICE */}
                <p className="ipad-product-price">
                  {product.price_upfront != null && (
                    <>From ${Number(product.price_upfront).toLocaleString()}</>
                  )}
                  {product.price_monthly != null && (
                    <> or ${Number(product.price_monthly).toFixed(2)}/mo. for 12 mo.**</>
                  )}
                </p>

                {/* LEASE */}
                {product.lease_monthly != null && (
                  <p className="ipad-product-lease">
                    Lease from ${Number(product.lease_monthly).toFixed(2)}/mo. for 36 mo.
                  </p>
                )}

                {/* BUTTONS */}
                <div className="ipad-product-buttons">
                  <Link
                    to={product.learn_more_link || product.learn_more_url || "/ipad"}
                    className="ipad-learn-button"
                    style={{ textDecoration: "none" }}
                  >
                    Learn more
                  </Link>

                  <Link
                    to={product.buy_link || product.buy_url || "/store"}
                    className="ipad-buy-button"
                    style={{ textDecoration: "none" }}
                  >
                    {product.buy_text || "Buy ›"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =================================
    WHY APPLE IS THE BEST PLACE TO SHOP IPAD
================================= */}
      <section className="ipad-shop-benefits">

        <div className="ipad-benefits-heading">
          <h2>
            Why Apple is the best
            <br />
            place to shop iPad.
          </h2>

          <a href="/ipad/buy" className="ipad-shop-link">
            Shop iPad <span>›</span>
          </a>
        </div>

        {ipadBenefitsLoading ? (
          <p>Loading benefits...</p>
        ) : (
          <div className="ipad-benefits-cards">
            {ipadBenefits.map((benefit) => (
              <article className="ipad-benefit-card" key={benefit.id}>

                <div className="ipad-benefit-content">
                  {benefit.label && (
                    <p className="ipad-benefit-label">
                      {benefit.label}
                    </p>
                  )}

                  <h3>{benefit.title}</h3>

                  <p className="ipad-benefit-description">
                    {benefit.description}
                  </p>
                </div>

                {benefit.image_url && (
                  <img
                    className="ipad-benefit-image"
                    src={benefit.image_url}
                    alt={benefit.title}
                    loading="lazy"
                  />
                )}

                {benefit.link && (
                  <a
                    href={benefit.link}
                    className="ipad-benefit-card-link"
                  >
                    Learn more <span>›</span>
                  </a>
                )}

              </article>
            ))}
          </div>
        )}

      </section>


      {/* =================================
    GET TO KNOW IPAD
================================= */}
      <section className="ipad-get-to-know">
        <h2 className="ipad-know-heading">Get to know iPad.</h2>

        {ipadKnowLoading ? (
          <p>Loading iPad information...</p>
        ) : (
          <div className="ipad-know-cards">
            {ipadKnowItems.map((item) => (
              <article className="ipad-know-card" key={item.id}>
                <div className="ipad-know-card-content">
                  {item.label && <p>{item.label}</p>}

                  <button
                    type="button"
                    className="ipad-know-title"
                    onClick={() => setSelectedIpadItem(item)}
                  >
                    {item.title}
                  </button>
                </div>

                {item.image_url && (
                  <img
                    className="ipad-know-card-image"
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                  />
                )}
              </article>
            ))}
          </div>
        )}

        {/* DETAIL MODAL */}
        {selectedIpadItem && (
          <div
            className="ipad-know-modal"
            onClick={() => setSelectedIpadItem(null)}
          >
            <div
              className="ipad-know-modal-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ipad-know-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="ipad-know-close"
                onClick={() => setSelectedIpadItem(null)}
                aria-label="Close details"
              >
                ×
              </button>

              <h2 id="ipad-know-modal-title">
                {selectedIpadItem.title}
              </h2>

              <div className="ipad-know-detail-panel">
                <p>
                  {selectedIpadItem.detail_description ||
                    selectedIpadItem.description}
                </p>

                {selectedIpadItem.detail_image_url && (
                  <img
                    src={selectedIpadItem.detail_image_url}
                    alt={selectedIpadItem.title}
                    className="ipad-know-detail-image"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =================================
    IPAD ESSENTIALS
================================= */}
      <section className="ipad-essentials">

        <h2 className="ipad-essentials-heading">
          iPad essentials.
        </h2>

        <div className="ipad-essentials-grid">

          {/* APPLE PENCIL CARD */}
          <article className="ipad-essential-card ipad-pencil-card">

            <div className="ipad-essential-content">
              <h2>Apple Pencil</h2>

              <p>Dream it up. Jot it down.</p>

              <a href="/ipad/apple-pencil">
                Learn more <span>›</span>
              </a>
            </div>

            <div className="ipad-essential-image">
              <img
                src={ApplePencilImage}
                alt="iPad with Apple Pencil displaying handwritten notes"
                loading="lazy"
              />
            </div>

          </article>

          {/* KEYBOARD CARD */}
          <article className="ipad-essential-card ipad-keyboard-card">

            <div className="ipad-essential-image">
              <img
                src={MagicKeyboardImage}
                alt="iPad connected to a Magic Keyboard with trackpad"
                loading="lazy"
              />
            </div>

            <div className="ipad-essential-content">
              <h2>Keyboards for iPad</h2>

              <p>Type it out. Take it with you.</p>

              <a href="/ipad/keyboards">
                Learn more <span>›</span>
              </a>
            </div>

          </article>

        </div>

      </section>


      {/* =================================
    SIGNIFICANT OTHERS
================================= */}
      <section className="ipad-significant">

        <div className="ipad-significant-container">

          {/* LEFT SIDE */}
          <div className="ipad-significant-left">
            <h2>Significant others.</h2>

            {[
              {
                title: "iPad and iPhone",
                description:
                  "iPad is perfect for taking the content you capture on iPhone and bringing it to life on an immersive canvas. You can shoot videos and photos on your iPhone and use the large display of your iPad to edit, add animations, and more. You can also pick up wherever you left off with Handoff.",
              },
              {
                title: "iPad and Mac",
                description:
                  "Use iPad and Mac together to extend your workspace, move content between devices, and enjoy a more seamless workflow with features like Universal Control and Sidecar.",
              },
              {
                title: "iPad and Apple Watch",
                description:
                  "Your Apple devices work together to help you stay connected. Use Apple Watch to stay on top of notifications and keep your everyday activities in sync.",
              },
            ].map((item, index) => (
              <div className="ipad-connection-item" key={item.title}>

                <button
                  type="button"
                  className={`ipad-connection-title ${activeConnection === index ? "active" : ""
                    }`}
                  onClick={() =>
                    setActiveConnection(
                      activeConnection === index ? -1 : index
                    )
                  }
                  aria-expanded={activeConnection === index}
                >
                  <span>{item.title}</span>

                  <span className="ipad-connection-icon">
                    {activeConnection === index ? "−" : "+"}
                  </span>
                </button>

                {activeConnection === index && (
                  <div className="ipad-connection-description">
                    <p>{item.description}</p>
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="ipad-significant-right">

            <div className="ipad-connection-visual">
              <img
                src={Iphoncamera}
                alt="iPhone displaying a photo of a child holding a yellow flower"
                loading="lazy"
              />
            </div>

            <div className="ipad-connection-visual">
              <img
                src={Iphoncamera}
                alt="iPad displaying a flower photo with Apple Pencil Markup illustrations"
                loading="lazy"
              />
            </div>

          </div>

        </div>

      </section>

      {/* =================================
    IPAD FOOTER NAVIGATION
================================= */}

      <section className="ipad-footer-nav">

        <h1 style={{ fontSize: "50px", fontWeight: "600" ,paddingLeft: "50px",paddingBottom: "50px" }}>iPad</h1>

        <div className="ipad-footer-container">

          {/* =========================
        EXPLORE IPAD
    ========================= */}

          <div className="ipad-footer-column">

            <h3>Explore iPad</h3>

            <Link to="#">Explore All iPad</Link>
            <Link to="#">iPad Pro</Link>
            <Link to="#">iPad Air</Link>
            <Link to="#">iPad</Link>
            <Link to="#">iPad mini</Link>
            <Link to="#">Apple Pencil</Link>
            <Link to="#">Keyboards</Link>
            <Link to="#">Compare iPad</Link>

          </div>


          {/* =========================
        SHOP IPAD
    ========================= */}

          <div className="ipad-footer-column">

            <h3>Shop iPad</h3>

            <Link to="#">Shop iPad</Link>
            <Link to="#">iPad Accessories</Link>
            <Link to="#">Apple Upgrade</Link>
            <Link to="#">Apple Trade In</Link>
            <Link to="#">Financing</Link>
            <Link to="#">Personal Setup</Link>
            <Link to="#">College Student Offer</Link>

          </div>


          {/* =========================
        MORE FROM IPAD
    ========================= */}

          <div className="ipad-footer-column">

            <h3>More from iPad</h3>

            <Link to="#">iPad Support</Link>
            <Link to="#">AppleCare</Link>
            <Link to="#">iPadOS 27</Link>
            <Link to="#">Apple Intelligence and Siri</Link>
            <Link to="#">Apps by Apple</Link>
            <Link to="#">Apple Creator Studio</Link>
            <Link to="#">iCloud+</Link>
            <Link to="#">Education</Link>
            <Link to="#">Apple at Work</Link>

          </div>

        </div>

      </section>

    </>
  );
}

export default Ipad;