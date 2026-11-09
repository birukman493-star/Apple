import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Watch.css";
import placeholder from "../constants/placeholder";

// Import images from assets
import Watch1 from "../assets/watch1.jpg";
import Watch2 from "../assets/watch2.jpg";
import Watch3 from "../assets/watch3.jpg";
import Watch4 from "../assets/watch4.jpg";
import Watch5 from "../assets/watch5.jpg";
import Watch6 from "../assets/watch6.jpg";
import Watch7 from "../assets/watch9.jpg";
import Watch8 from "../assets/watch8.jpg";
import Watch10 from "../assets/watch10.avif";
import Watch11 from "../assets/watch11.avif";
import Watch12 from "../assets/watch12.jpg";
import TradeInImg from "../assets/TradeIn.jpg";
import CardImg from "../assets/Card.jpg";
import SupportImg from "../assets/support1.png";
import IphoneImg from "../assets/iphone.png";
import AirpodsImg from "../assets/airpads1.jpg";

// Map of local images for lineup cards
const localWatchImages = {
  "series 12": Watch1,
  "series": Watch1,
  "ultra 4": Watch2,
  "ultra": Watch2,
  "se 3": Watch3,
  "se": Watch3,
  "nike": Watch4,
  "hermès": Watch5,
  "hermes": Watch5,
  "compare": Watch6,
  "bands": Watch10,
  "accessories": Watch7,
  "fitness": Watch8,
};

const getWatchImage = (product) => {
  if (!product) return placeholder;
  const name = (product.product_name || product.title || "").toLowerCase();
  for (const [key, img] of Object.entries(localWatchImages)) {
    if (name.includes(key)) return img;
  }
  return product.image_url || placeholder;
};

// Map of local images for shopping benefits
const localBenefitImages = {
  "trade in": TradeInImg,
  "card": CardImg,
  "payment": CardImg,
  "delivery": Watch12,
  "specialist": SupportImg,
  "support": SupportImg,
};

const getBenefitImage = (benefit) => {
  if (!benefit) return placeholder;
  const title = (benefit.title || benefit.eyebrow || "").toLowerCase();
  for (const [key, img] of Object.entries(localBenefitImages)) {
    if (title.includes(key)) return img;
  }
  return benefit.image_url || placeholder;
};

// Default fallback lineup if server is loading or offline
const defaultWatchLineup = [
  {
    id: 1,
    product_name: "Apple Watch Series 12",
    badge: "New",
    description: "The ultimate way to watch your health.",
    price_upfront: 399,
    price_monthly: 33.25,
    lease_monthly: 11.99,
    price_text: "From $399 or $33.25/mo. for 12 mo.*",
    lease_text: "Lease from $11.99/mo. for 24 mo. with Apple Upgrade.**",
    colors: ["#47372F", "#E6D2B2", "#171717", "#A7A7A7", "#F2E5C1", "#D8D3CB", "#252B39"],
    learn_more_url: "/watch/series-12",
    buy_url: "/store",
  },
  {
    id: 2,
    product_name: "Apple Watch Ultra 4",
    badge: "New",
    description: "The ultimate sports and adventure watch.",
    price_upfront: 799,
    price_monthly: 66.58,
    lease_monthly: 24.99,
    price_text: "From $799 or $66.58/mo. for 12 mo.*",
    lease_text: "Lease from $24.99/mo. for 24 mo. with Apple Upgrade.**",
    colors: ["#C7C1B8", "#171717", "#E45A25"],
    learn_more_url: "/watch/ultra-4",
    buy_url: "/store",
  },
  {
    id: 3,
    product_name: "Apple Watch SE 3",
    badge: "",
    description: "Essential health features at a great value.",
    price_upfront: 249,
    price_monthly: 20.75,
    lease_monthly: null,
    price_text: "From $249 or $20.75/mo. for 12 mo.*",
    lease_text: "",
    colors: ["#202A34", "#D8D3CB", "#F4E8CE"],
    learn_more_url: "/watch/se-3",
    buy_url: "/store",
  },
  {
    id: 4,
    product_name: "Apple Watch Nike",
    badge: "New Colors",
    description: "Move and groove with iconic Nike Sport Bands.",
    price_upfront: 399,
    price_monthly: 33.25,
    lease_monthly: 11.99,
    price_text: "From $399 or $33.25/mo. for 12 mo.*",
    lease_text: "Lease from $11.99/mo. for 24 mo. with Apple Upgrade.**",
    colors: ["#171717", "#D4F064", "#0A4D68"],
    learn_more_url: "/watch/nike",
    buy_url: "/store",
  },
  {
    id: 5,
    product_name: "Apple Watch Hermès",
    badge: "New",
    description: "The pinnacle of horology and Parisian luxury.",
    price_upfront: 1249,
    price_monthly: 104.08,
    lease_monthly: 39.99,
    price_text: "From $1,249 or $104.08/mo. for 12 mo.*",
    lease_text: "Lease from $39.99/mo. for 24 mo. with Apple Upgrade.**",
    colors: ["#C26330", "#1C1D21", "#3F2A1D"],
    learn_more_url: "/watch/hermes",
    buy_url: "/store",
  },
];

// Default shopping benefits fallback
const defaultShoppingBenefits = [
  {
    id: 1,
    eyebrow: "Apple Trade In",
    title: "Get credit toward a new Apple Watch.",
    description: "Trade in your eligible device for credit toward your next purchase, or recycle it for free.",
    image_url: TradeInImg,
    link_url: "/watch#trade-in",
  },
  {
    id: 2,
    eyebrow: "Monthly Payments",
    title: "Pay 0% APR with Apple Card.",
    description: "Choose easy monthly installments with 0% APR when you pay with Apple Card.",
    image_url: CardImg,
    link_url: "/watch#apple-card",
  },
  {
    id: 3,
    eyebrow: "Free Delivery",
    title: "Get free two-hour delivery from an Apple Store.",
    description: "Or free standard delivery on all eligible online orders.",
    image_url: Watch12,
    link_url: "/watch#delivery",
  },
  {
    id: 4,
    eyebrow: "Specialist Support",
    title: "Shop with a Specialist online or in a store.",
    description: "Connect with a Specialist who can help you choose the right watch and band.",
    image_url: SupportImg,
    link_url: "/watch#specialist",
  },
];

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
    list = ["#171717", "#D8D3CB"];
  }
  return list.map((color, index) => (
    <span
      key={index}
      className="watch-lineup-color"
      style={{ backgroundColor: color.trim() }}
      title={color.trim()}
    />
  ));
};

const Watch = () => {
  const carouselRef = useRef(null);
  const benefitsCarouselRef = useRef(null);

  // Active accordion in "Made for each other"
  const [activeMade, setActiveMade] = useState("fitness");

  // Subnavigation items
  const watchItems = [
    {
      name: "Apple Watch Series 12",
      image: Watch1,
      badge: "New",
      link: "/watch/series-12",
    },
    {
      name: "Apple Watch Ultra 4",
      image: Watch2,
      badge: "New",
      link: "/watch/ultra-4",
    },
    {
      name: "Apple Watch SE 3",
      image: Watch3,
      badge: "",
      link: "/watch/se-3",
    },
    {
      name: "Apple Watch Nike",
      image: Watch4,
      badge: "New Colors",
      link: "/watch/nike",
    },
    {
      name: "Apple Watch Hermès",
      image: Watch5,
      badge: "New",
      link: "/watch/hermes",
    },
    {
      name: "Compare",
      image: Watch6,
      badge: "",
      link: "/watch/compare",
    },
    {
      name: "Bands",
      image: Watch10,
      badge: "New Colors",
      link: "/watch/bands",
    },
    {
      name: "Accessories",
      image: Watch7,
      badge: "",
      link: "/watch/accessories",
    },
    {
      name: "Apple Fitness+",
      image: Watch8,
      badge: "",
      link: "/watch/fitness",
    },
  ];

  const scrollCarousel = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 450,
        behavior: "smooth",
      });
    }
  };

  // Lineup products dynamic state
  const [products, setProducts] = useState(defaultWatchLineup);
  const [loading, setLoading] = useState(true);

  // Shopping benefits dynamic state
  const [shoppingBenefits, setShoppingBenefits] = useState(defaultShoppingBenefits);
  const [benefitsLoading, setBenefitsLoading] = useState(true);

  // Fetch Watch lineup products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/watch-lineup");
        if (!response.ok) {
          throw new Error("Failed to load Watch lineup.");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          // Try category endpoint fallback
          const catRes = await fetch("/api/products/category/watch");
          if (catRes.ok) {
            const catData = await catRes.json();
            if (Array.isArray(catData) && catData.length > 0) {
              setProducts(
                catData.map((p) => ({
                  ...p,
                  product_name: p.title || p.product_name,
                  badge: p.badge_text || p.badge,
                }))
              );
            }
          }
        }
      } catch (err) {
        console.warn("Using default Watch lineup:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch Shopping benefits
  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await fetch("/api/watch-shopping-benefits");
        if (!response.ok) {
          throw new Error("Failed to load shopping benefits.");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setShoppingBenefits(data);
        }
      } catch (err) {
        console.warn("Using default shopping benefits:", err.message);
      } finally {
        setBenefitsLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  const scrollBenefits = (direction) => {
    if (benefitsCarouselRef.current) {
      benefitsCarouselRef.current.scrollBy({
        left: direction * 560,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="watch-page">
      {/* Top Promotional Ribbon */}
      <section className="watch-promo">
        <p>
          Get up to $365 in credit when you trade in Apple Watch Series 6 or higher.{" "}
          <Link to="/watch#trade-in">Shop Apple Watch ›</Link>
        </p>
      </section>

      {/* Watch product navigation carousel */}
      <section className="watch-product-section">
        <h1 className="watch-main-title">Apple Watch</h1>

        <div className="watch-carousel-wrapper">
          <div className="watch-carousel" ref={carouselRef}>
            {watchItems.map((item) => (
              <Link
                to={item.link}
                className="watch-product-item"
                key={item.name}
              >
                <div className="watch-product-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = placeholder;
                    }}
                  />
                </div>

                <span className="watch-product-name">{item.name}</span>

                {item.badge && (
                  <span className="watch-product-badge">{item.badge}</span>
                )}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="watch-carousel-next"
            onClick={scrollCarousel}
            aria-label="Show more Apple Watch products"
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* =========================================
          EXPLORE THE LINEUP SECTION
      ========================================= */}
      <section className="watch-lineup-section">
        <div className="watch-lineup-heading">
          <h2>Explore the lineup.</h2>

          <Link to="/watch/compare" className="watch-compare-link">
            Compare all models <span>›</span>
          </Link>
        </div>

        <div className="watch-lineup-grid">
          {products.map((product) => {
            const displayName = product.product_name || product.title;
            const badge = product.badge || product.badge_text;
            const upfront = product.price_upfront;
            const monthly = product.price_monthly;
            const lease = product.lease_monthly;

            return (
              <article className="watch-lineup-card" key={product.id}>
                {/* Product Image Link */}
                <Link
                  to={product.learn_more_url || product.learn_more_link || "#"}
                  className="watch-lineup-image-link"
                >
                  <div className="watch-lineup-image">
                    <img
                      src={getWatchImage(product)}
                      alt={displayName}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = placeholder;
                      }}
                    />
                  </div>
                </Link>

                {/* Color dots preview */}
                <div className="watch-lineup-colors">
                  {renderColors(product.colors || product.colors_json)}
                </div>

                {/* Product Details */}
                <div className="watch-lineup-details">
                  <span className="watch-lineup-badge">
                    {badge || "\u00A0"}
                  </span>

                  <h3>{displayName}</h3>

                  {product.description && (
                    <p className="watch-lineup-description">
                      {product.description}
                    </p>
                  )}

                  {/* Pricing info */}
                  <div className="watch-lineup-pricing">
                    {product.price_text ? (
                      <p>{product.price_text}</p>
                    ) : upfront ? (
                      <p>
                        From ${Number(upfront).toLocaleString()}
                        {monthly && (
                          <> or ${Number(monthly).toFixed(2)}/mo. for 12 mo.*</>
                        )}
                      </p>
                    ) : null}

                    {product.lease_text ? (
                      <p className="watch-lineup-lease">{product.lease_text}</p>
                    ) : lease ? (
                      <p className="watch-lineup-lease">
                        Lease from ${Number(lease).toFixed(2)}/mo. for 24 mo. with Apple Upgrade.**
                      </p>
                    ) : null}
                  </div>

                  {/* Action buttons */}
                  <div className="watch-lineup-actions">
                    <Link
                      to={product.learn_more_url || product.learn_more_link || `/watch/${product.id}`}
                      className="watch-lineup-learn"
                    >
                      Learn more
                    </Link>

                    <Link
                      to={product.buy_url || product.buy_link || "/store"}
                      className="watch-lineup-buy"
                    >
                      Buy <span>›</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================
          WHY APPLE IS THE BEST PLACE TO SHOP
      ========================================= */}
      <section className="watch-shopping-section">
        <div className="watch-shopping-heading">
          <h2>
            Why Apple is the best
            <br />
            place to shop Apple Watch.
          </h2>

          <Link to="/watch/shop" className="watch-shopping-shop-link">
            Shop Apple Watch <span>›</span>
          </Link>
        </div>

        <div className="watch-shopping-carousel-wrapper">
          <div
            className="watch-shopping-carousel"
            ref={benefitsCarouselRef}
          >
            {shoppingBenefits.map((benefit) => (
              <article className="watch-shopping-card" key={benefit.id}>
                <div className="watch-shopping-card-content">
                  {benefit.eyebrow && (
                    <p className="watch-shopping-eyebrow">
                      {benefit.eyebrow}
                    </p>
                  )}

                  <h3>{benefit.title}</h3>

                  {benefit.description && (
                    <p className="watch-shopping-description">
                      {benefit.description}
                    </p>
                  )}

                  <Link
                    to={benefit.link_url || "/watch"}
                    className="watch-shopping-card-link"
                  >
                    Learn more <span>›</span>
                  </Link>
                </div>

                <div className="watch-shopping-image">
                  <img
                    src={getBenefitImage(benefit)}
                    alt={benefit.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = placeholder;
                    }}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="watch-shopping-controls">
            <button
              type="button"
              onClick={() => scrollBenefits(-1)}
              aria-label="Scroll to previous benefits"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => scrollBenefits(1)}
              aria-label="Scroll to next benefits"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          MADE FOR EACH OTHER SECTION
      ========================================= */}
      <section className="watch-made-section">
        <div className="watch-made-container">
          {/* LEFT SIDE ACCORDION */}
          <div className="watch-made-left">
            <h2 className="watch-made-heading">Made for each other.</h2>

            <div className="watch-accordion">
              {/* 1. Apple Watch and iPhone */}
              <div
                className={`watch-accordion-card ${
                  activeMade === "iphone" ? "active" : ""
                }`}
              >
                <button
                  type="button"
                  className="watch-accordion-item"
                  onClick={() =>
                    setActiveMade(activeMade === "iphone" ? "" : "iphone")
                  }
                  aria-expanded={activeMade === "iphone"}
                >
                  <span className="watch-accordion-title">
                    Apple Watch and iPhone
                  </span>
                  <span className="watch-accordion-icon">
                    {activeMade === "iphone" ? "−" : "+"}
                  </span>
                </button>

                {activeMade === "iphone" && (
                  <div className="watch-accordion-content">
                    <p>
                      Apple Watch and iPhone work seamlessly together. Take calls,
                      reply to messages, and manage notifications right from your
                      wrist. Misplaced your iPhone? A quick tap on your watch plays
                      a sound so you can find it instantly. Plus, use your watch as
                      a camera viewfinder and remote shutter.
                    </p>
                  </div>
                )}
              </div>

              {/* 2. Apple Watch and AirPods */}
              <div
                className={`watch-accordion-card ${
                  activeMade === "airpods" ? "active" : ""
                }`}
              >
                <button
                  type="button"
                  className="watch-accordion-item"
                  onClick={() =>
                    setActiveMade(activeMade === "airpods" ? "" : "airpods")
                  }
                  aria-expanded={activeMade === "airpods"}
                >
                  <span className="watch-accordion-title">
                    Apple Watch and AirPods
                  </span>
                  <span className="watch-accordion-icon">
                    {activeMade === "airpods" ? "−" : "+"}
                  </span>
                </button>

                {activeMade === "airpods" && (
                  <div className="watch-accordion-content">
                    <p>
                      Leave your phone at home and head out. Stream 100 million
                      songs on Apple Music, listen to podcasts, and take calls
                      hands-free directly on your AirPods. Control playback and
                      volume smoothly with the Digital Crown.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Apple Watch and Apple Fitness+ */}
              <div
                className={`watch-accordion-card ${
                  activeMade === "fitness" ? "active" : ""
                }`}
              >
                <button
                  type="button"
                  className="watch-accordion-item"
                  onClick={() =>
                    setActiveMade(activeMade === "fitness" ? "" : "fitness")
                  }
                  aria-expanded={activeMade === "fitness"}
                >
                  <span className="watch-accordion-title">
                    Apple Watch and Apple Fitness+
                  </span>
                  <span className="watch-accordion-icon">
                    {activeMade === "fitness" ? "−" : "+"}
                  </span>
                </button>

                {activeMade === "fitness" && (
                  <div className="watch-accordion-content">
                    <p>
                      Apple Watch supercharges your Fitness+ experience with
                      real-time, personalized metrics onscreen, like your heart
                      rate, calories burned, and Activity rings.⁴ And you get the
                      freedom of audio-guided walks, runs, and more.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE DYNAMIC PREVIEW */}
          <div className="watch-made-right">
            {activeMade === "iphone" && (
              <div className="watch-ecosystem-display iphone-mode">
                <div className="watch-display-media">
                  <img
                    src={Watch1}
                    alt="Apple Watch and iPhone"
                    className="watch-device-preview"
                  />
                </div>

                {/* iPhone Continuity HUD Overlays */}
                <div className="watch-dynamic-hud">
                  <div className="watch-hud-pill">
                    <span className="hud-dot pulsing"></span>
                    <span>Camera Remote • 3s Shutter</span>
                  </div>

                  <div className="watch-hud-call">
                    <div className="call-avatar">📞</div>
                    <div className="call-info">
                      <strong>Incoming Call</strong>
                      <span>iPhone Nearby</span>
                    </div>
                  </div>

                  <div className="watch-hud-action">
                    <span className="hud-ping-icon">📡</span>
                    <span>Ping iPhone Ready</span>
                  </div>
                </div>
              </div>
            )}

            {activeMade === "airpods" && (
              <div className="watch-ecosystem-display airpods-mode">
                <div className="watch-display-media">
                  <img
                    src={Watch4}
                    alt="Apple Watch and AirPods"
                    className="watch-device-preview"
                  />
                </div>

                {/* AirPods Music HUD Overlays */}
                <div className="watch-dynamic-hud">
                  <div className="watch-hud-pill sound-pill">
                    <span className="sound-wave">
                      <i></i><i></i><i></i><i></i><i></i>
                    </span>
                    <span>Spatial Audio Active</span>
                  </div>

                  <div className="watch-now-playing">
                    <div className="music-art">🎵</div>
                    <div className="music-details">
                      <strong>Cruel Summer</strong>
                      <span>Taylor Swift • Apple Music</span>
                    </div>
                  </div>

                  <div className="watch-music-controls">
                    <span>⏮</span>
                    <span className="play-btn">⏸</span>
                    <span>⏭</span>
                  </div>
                </div>
              </div>
            )}

            {(activeMade === "fitness" || !activeMade) && (
              <div className="watch-ecosystem-display fitness-mode">
                <div className="watch-fitness-image">
                  <img
                    src={Watch8}
                    alt="Apple Watch and Apple Fitness+"
                    className="watch-device-preview"
                  />

                  {/* Activity Rings Visualization */}
                  <div className="watch-rings-visual">
                    <div className="ring ring-red"></div>
                    <div className="ring ring-green"></div>
                    <div className="ring ring-blue"></div>
                  </div>

                  {/* Real-time Workout Metrics Overlay */}
                  <div className="watch-metrics">
                    <div className="metric-box">
                      <span>TIME</span>
                      <strong>22:14</strong>
                    </div>

                    <div className="metric-box">
                      <span className="metric-heart-label">
                        <span className="heart-icon">❤️</span> HEART RATE
                      </span>
                      <strong>
                        121 <small>BPM</small>
                      </strong>
                    </div>

                    <div className="metric-box">
                      <span>ACTIVE CALORIES</span>
                      <strong>
                        155 <small>CAL</small>
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Watch;