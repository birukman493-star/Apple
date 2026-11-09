import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import SectionRenderer from "../components/SectionRenderer";
import {
  FiSearch,
  FiShoppingBag,
  FiEye,
  FiCheck,
  FiFilter,
  FiTruck,
  FiRotateCcw,
  FiCreditCard,
  FiArrowRight,
  FiX
} from "react-icons/fi";
import "./Accessories.css";

// Assets
import iphone from "../assets/iphone.png";
import ipad from "../assets/ipad1.png";
import mac from "../assets/mac.png";
import watch from "../assets/watch1.jpg";
import vision from "../assets/vision7.jpg";
import airpods from "../assets/airpads1.jpg";
import tvhome from "../assets/tvhome.jpg";
import airtag from "../assets/airpads2.jpg";
import beats from "../assets/iphone7.png";
import make from "../assets/make.jpg";
import make1 from "../assets/make1.jpg";
import make2 from "../assets/make2.jpg";
import make3 from "../assets/make3.jpg";
import accessory1 from "../assets/accessories1.jpg";
import accessory2 from "../assets/accessories2.jpg";
import accessory3 from "../assets/accessories3.avif";
import accessory4 from "../assets/accessories4.jpg";
import accessory5 from "../assets/accessories5.jpg";
import accessory6 from "../assets/accessories6.jpg";
import accessory7 from "../assets/accessories7.jpg";
import accessory8 from "../assets/accessories8.jpg";

const categoryNavigation = [
  { name: "iPhone", imageSrc: iphone, path: "/iphone" },
  { name: "iPad", imageSrc: ipad, path: "/ipad" },
  { name: "Mac", imageSrc: mac, path: "/mac" },
  { name: "Apple Watch", imageSrc: watch, path: "/watch" },
  { name: "Apple Vision Pro", imageSrc: vision, path: "/vision" },
  { name: "AirPods", imageSrc: airpods, path: "/airpods" },
  { name: "TV & Home", imageSrc: tvhome, path: "/tv-home" },
  { name: "AirTag", imageSrc: airtag, path: "/store" },
  { name: "Beats", imageSrc: beats, path: "/store" },
];

// Rich curated accessory products matching official Apple Store lineup
const curatedAccessories = [
  {
    id: "acc-1",
    title: "iPhone 16 Pro Silicone Case with MagSafe",
    category: "Cases & Protection",
    badge: "New",
    price: 49.00,
    priceMonthly: 4.08,
    image: accessory1,
    description: "Crafted with silky, soft-touch silicone exterior that feels great in your hand. Inside, a soft microfiber lining offers added protection.",
    colors: ["#2d4b68", "#a6685b", "#2a363b", "#e3d7bf", "#78866b"],
    compatibility: "iPhone 16 Pro & Pro Max",
    inStock: true
  },
  {
    id: "acc-2",
    title: "iPhone Duo Folio Case with Kickstand – Taupe",
    category: "Cases & Protection",
    badge: "Staff Pick",
    price: 79.00,
    priceMonthly: 6.58,
    image: accessory2,
    description: "Multi-functional folio crafted from premium supple leather alternative with integrated magnetic kickstand for landscape FaceTime calls.",
    colors: ["#a28c70", "#393b43", "#77515a"],
    compatibility: "iPhone 16, 16 Plus",
    inStock: true
  },
  {
    id: "acc-3",
    title: "AirTag FineWoven Key Ring – Wildflower Blue",
    category: "Cases & Protection",
    badge: "Popular",
    price: 35.00,
    priceMonthly: 2.91,
    image: accessory6,
    description: "Engineered thoughtfully from durable microtwill that has a soft, suede-like feel. Stainless steel hardware is as striking as it is strong.",
    colors: ["#7894b9", "#77515a", "#76684b", "#393b43"],
    compatibility: "AirTag",
    inStock: true
  },
  {
    id: "acc-4",
    title: "MagSafe Charger (2m)",
    category: "Charging",
    badge: "Fast Charging",
    price: 49.00,
    priceMonthly: 4.08,
    image: make,
    description: "Faster wireless charging up to 25W for iPhone 16 models when paired with the 30W USB-C Power Adapter. Perfectly aligned magnets snap instantly.",
    colors: ["#ffffff"],
    compatibility: "iPhone 12 through iPhone 16, AirPods Pro",
    inStock: true
  },
  {
    id: "acc-5",
    title: "35W Dual USB-C Port Compact Power Adapter",
    category: "Charging",
    badge: "Essential",
    price: 59.00,
    priceMonthly: 4.91,
    image: make1,
    description: "Charge two devices at the same time, whether you're at home, in the office, or on the go. Compact prongs fold for effortless travel.",
    colors: ["#ffffff"],
    compatibility: "iPhone, iPad, Apple Watch, Mac",
    inStock: true
  },
  {
    id: "acc-6",
    title: "AirPods 4 with Active Noise Cancellation",
    category: "Audio",
    badge: "Top Seller",
    price: 179.00,
    priceMonthly: 14.91,
    image: accessory4,
    description: "Featuring transformed acoustic architecture, Personalized Spatial Audio with dynamic head tracking, and industry-leading Open-Ear ANC.",
    colors: ["#ffffff"],
    compatibility: "All Apple Devices",
    inStock: true
  },
  {
    id: "acc-7",
    title: "AirPods Max – Midnight Blue",
    category: "Audio",
    badge: "Lossless Audio",
    price: 549.00,
    priceMonthly: 45.75,
    image: accessory5,
    description: "Over-ear acoustic masterpiece with USB-C charging, pro-level Active Noise Cancellation, and computational audio powered by Apple H1 chips.",
    colors: ["#1c2536", "#e4e5e7", "#845e6d", "#d19a66"],
    compatibility: "Mac, iPad, iPhone, Apple TV",
    inStock: true
  },
  {
    id: "acc-8",
    title: "Thunderbolt 4 (USB-C) Pro Cable (1.8m)",
    category: "Cables",
    badge: "Pro Gear",
    price: 129.00,
    priceMonthly: 10.75,
    image: accessory8,
    description: "Features black braided design that coils without tangling. Supports Thunderbolt 4 data transfer up to 40Gb/s and charging up to 100W.",
    colors: ["#1d1d1f"],
    compatibility: "Mac, iPad Pro, Studio Display",
    inStock: true
  },
  {
    id: "acc-9",
    title: "USB-C to Lightning Adapter",
    category: "Adapters",
    badge: "Handy",
    price: 29.00,
    priceMonthly: 2.41,
    image: accessory7,
    description: "Connect your Lightning accessories to a USB-C enabled iPhone or iPad to conveniently provide three key functions: charging, data, and audio.",
    colors: ["#ffffff"],
    compatibility: "iPhone 15 & 16 series, iPad Pro USB-C",
    inStock: true
  },
  {
    id: "acc-10",
    title: "46mm Burgundy Braided Solo Loop – Apple Watch",
    category: "Accessories",
    badge: "Autumn Series",
    price: 99.00,
    priceMonthly: 8.25,
    image: make3,
    description: "Each Braided Solo Loop features a unique, stretchable design that’s ultracomfortable and easy to slip on and off your wrist. Sweat and water resistant.",
    colors: ["#77515a", "#1d1d1f", "#2b4c7e"],
    compatibility: "Apple Watch 42mm, 44mm, 45mm, 46mm & Ultra",
    inStock: true
  },
  {
    id: "acc-11",
    title: "iPhone FineWoven Wallet with MagSafe",
    category: "Accessories",
    badge: "Find My Ready",
    price: 59.00,
    priceMonthly: 4.91,
    image: make2,
    description: "Designed with both style and function in mind. Supports Find My so you can be notified of your wallet’s last known location if it gets separated.",
    colors: ["#77515a", "#1d1d1f", "#a28c70", "#2d4b68"],
    compatibility: "iPhone 12 through iPhone 16",
    inStock: true
  },
  {
    id: "acc-12",
    title: "Beats Pill Wireless Bluetooth Speaker",
    category: "Audio",
    badge: "IP67 Waterproof",
    price: 149.00,
    priceMonthly: 12.41,
    image: beats,
    description: "Up to 24 hours of battery life, room-filling acoustic power with custom racetrack woofer, and lossless audio via USB-C cable.",
    colors: ["#bf2b37", "#1d1d1f", "#d5c9b1"],
    compatibility: "iOS and Android Devices",
    inStock: true
  }
];

const filterCategories = [
  "All",
  "Cases & Protection",
  "Charging",
  "Audio",
  "Cables",
  "Adapters",
  "Accessories"
];

export default function Accessories() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured"); // 'featured' | 'low-high' | 'high-low'
  const [previewProduct, setPreviewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [apiAccessories, setApiAccessories] = useState([]);

  const scrollRef = useRef(null);

  // Fetch accessories from database to merge with curated catalog
  useEffect(() => {
    const loadDbAccessories = async () => {
      try {
        const res = await fetch("/api/products/accessories");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setApiAccessories(data.map(p => ({
              id: p.id,
              title: p.title,
              category: "Accessories",
              badge: p.badge_text || "Apple",
              price: Number(p.price_upfront || 49),
              priceMonthly: p.price_monthly ? Number(p.price_monthly) : Math.round(Number(p.price_upfront || 49) / 12 * 100) / 100,
              image: p.image_url || make,
              description: p.description || "Official Apple accessory engineered with the highest quality standards.",
              colors: p.colors && p.colors.length ? p.colors : ["#1d1d1f", "#ffffff"],
              compatibility: "Apple Devices",
              inStock: p.stock > 0
            })));
          }
        }
      } catch (err) {
        console.warn("Using curated accessories catalog:", err);
      }
    };

    loadDbAccessories();
  }, []);

  // Merge database items with curated items (avoiding duplicates)
  const allProducts = useMemo(() => {
    const existingTitles = new Set(curatedAccessories.map(c => c.title.toLowerCase()));
    const uniqueApi = apiAccessories.filter(a => !existingTitles.has(a.title.toLowerCase()));
    return [...curatedAccessories, ...uniqueApi];
  }, [apiAccessories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        searchQuery.trim() === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortOption === "low-high") return a.price - b.price;
      if (sortOption === "high-low") return b.price - a.price;
      return 0; // featured maintains original curated priority
    });
  }, [allProducts, selectedCategory, searchQuery, sortOption]);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setToastMessage(`✓ Added "${product.title}" to your Bag.`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const scrollCategoryRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="accessories-page-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="accessories-toast">
          <span>{toastMessage}</span>
          <div className="toast-actions">
            <Link to="/bag" className="toast-link">Review Bag</Link>
            <Link to="/checkout" className="toast-btn">Check Out</Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="accessories-hero">
        <div className="accessories-hero-container">
          <span className="hero-eyebrow">Apple Accessories</span>
          <h1 className="hero-heading">Mix. Match. MagSafe.</h1>
          <p className="hero-subtext">
            Explore colorful cases, fast chargers, premium audio, and essential adapters engineered specifically for your Apple devices.
          </p>
          <div className="hero-actions">
            <a href="#browse-catalog" className="hero-btn-primary">Shop All Accessories</a>
            <Link to="/store" className="hero-btn-secondary">Explore Apple Store</Link>
          </div>
        </div>
      </section>

      {/* Device Category Carousel */}
      <section className="accessories-devices-carousel">
        <div className="devices-carousel-container">
          <h2 className="carousel-title">Shop by Device</h2>
          <div className="carousel-track-wrapper">
            <div ref={scrollRef} className="devices-track">
              {categoryNavigation.map((device) => (
                <Link to={device.path} key={device.name} className="device-item-card">
                  <div className="device-thumb">
                    <img src={device.imageSrc} alt={device.name} />
                  </div>
                  <span className="device-label">{device.name}</span>
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="carousel-nav-btn"
              onClick={scrollCategoryRight}
              aria-label="Scroll devices"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Main Browse Catalog Section */}
      <section id="browse-catalog" className="accessories-catalog-section">
        <div className="catalog-container">
          <div className="catalog-header-bar">
            <div>
              <h2 className="catalog-title">Explore Accessories</h2>
              <p className="catalog-subtitle">Showing {filteredProducts.length} accessories</p>
            </div>

            {/* Search within accessories */}
            <div className="catalog-controls">
              <div className="catalog-search-box">
                <FiSearch size={16} />
                <input
                  type="text"
                  placeholder="Search accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="clear-search-btn">
                    <FiX size={14} />
                  </button>
                )}
              </div>

              {/* Price Sort */}
              <select
                className="catalog-sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Sort: Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="category-pills-row">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="no-products-state">
              <FiFilter size={36} color="#86868b" />
              <h3>No matching accessories found</h3>
              <p>Try clearing your search query or selecting a different category.</p>
              <button
                type="button"
                className="reset-filters-btn"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="accessories-product-grid">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="accessory-product-card"
                  onClick={() => setPreviewProduct(product)}
                >
                  <div className="card-badge-row">
                    {product.badge && <span className="acc-badge">{product.badge}</span>}
                  </div>

                  <div className="card-image-box">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="card-info-box">
                    <span className="card-category">{product.category}</span>
                    <h3 className="card-product-title">{product.title}</h3>

                    {/* Color Swatches */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="card-swatches">
                        {product.colors.map((c, i) => (
                          <span
                            key={i}
                            className="swatch-dot"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="card-price-row">
                      <div className="price-stack">
                        <strong className="price-upfront">${product.price.toFixed(2)}</strong>
                        {product.priceMonthly && (
                          <span className="price-monthly">or ${product.priceMonthly.toFixed(2)}/mo.</span>
                        )}
                      </div>
                    </div>

                    <div className="card-action-buttons">
                      <button
                        type="button"
                        className="btn-add-to-bag"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <FiShoppingBag size={14} /> Add to Bag
                      </button>
                      <button
                        type="button"
                        className="btn-quick-preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewProduct(product);
                        }}
                      >
                        <FiEye size={14} /> Quick View
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Apple Benefits Bar */}
      <section className="accessories-perks-bar">
        <div className="perks-container">
          <div className="perk-cell">
            <FiTruck size={24} color="#0071e3" />
            <div>
              <h4>Free Next-Day Delivery</h4>
              <p>On all orders with guaranteed prompt courier service.</p>
            </div>
          </div>
          <div className="perk-cell">
            <FiRotateCcw size={24} color="#0071e3" />
            <div>
              <h4>Free & Easy Returns</h4>
              <p>Return online or drop off at any verified location.</p>
            </div>
          </div>
          <div className="perk-cell">
            <FiCreditCard size={24} color="#0071e3" />
            <div>
              <h4>Flexible Local Payments</h4>
              <p>Telebirr, Chapa, CBE Birr, Bank Transfer, or Cards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {previewProduct && (
        <div className="modal-backdrop" onClick={() => setPreviewProduct(null)}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-icon"
              onClick={() => setPreviewProduct(null)}
              aria-label="Close"
            >
              <FiX size={20} />
            </button>

            <div className="quickview-grid">
              <div className="quickview-image-pane">
                <img src={previewProduct.image} alt={previewProduct.title} />
              </div>

              <div className="quickview-details-pane">
                <span className="modal-category">{previewProduct.category}</span>
                <h2>{previewProduct.title}</h2>
                <div className="modal-pricing">
                  <span className="modal-price">${previewProduct.price.toFixed(2)}</span>
                  {previewProduct.priceMonthly && (
                    <span className="modal-monthly">or ${previewProduct.priceMonthly.toFixed(2)}/mo. for 12 months</span>
                  )}
                </div>

                <p className="modal-description">{previewProduct.description}</p>

                {previewProduct.colors && previewProduct.colors.length > 0 && (
                  <div className="modal-colors-group">
                    <label>Available Finishes</label>
                    <div className="modal-swatches">
                      {previewProduct.colors.map((c, i) => (
                        <span key={i} className="swatch-bubble" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                )}

                {previewProduct.compatibility && (
                  <div className="modal-compatibility">
                    <strong>Compatibility:</strong> {previewProduct.compatibility}
                  </div>
                )}

                <div className="modal-stock-status">
                  <FiCheck size={16} color="#16a34a" /> In stock and ready to ship
                </div>

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="modal-add-btn"
                    onClick={() => {
                      handleAddToCart(previewProduct);
                      setPreviewProduct(null);
                    }}
                  >
                    <FiShoppingBag size={16} /> Add to Bag (${previewProduct.price.toFixed(2)})
                  </button>
                  <Link
                    to="/checkout"
                    onClick={() => {
                      addToCart(previewProduct, 1);
                      setPreviewProduct(null);
                    }}
                    className="modal-checkout-btn"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preserve Existing CMS Website Sections */}
      <SectionRenderer category="Accessories" />
    </div>
  );
}
