import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Vision.css";
import placeholder from "../constants/placeholder";

// Local image assets
import visionImage from "../assets/visionPro.jpg";
import visionPro1 from "../assets/visionPro1.jpg";
import visionPro2 from "../assets/visionPro2.jpg";
import visionPro3 from "../assets/visionPro3.jpg";
import visionPro4 from "../assets/visionPro4.jpg";
import visionPro5 from "../assets/visionPro5.jpg";
import visionPro6 from "../assets/vision6.jpg";
import visionPro7 from "../assets/vision7.jpg";
import visionPro8 from "../assets/vision8.jpg";
import visionPro9 from "../assets/vision9.jpg";
import visionPro10 from "../assets/vision10.jpg";
import visionPro11 from "../assets/vision11.jpg";
import visionPro12 from "../assets/vision12.jpg";
import spatialVideo from "../assets/video2.mp4";
import TradeInImg from "../assets/TradeIn.jpg";
import CardImg from "../assets/Card.jpg";
import SupportImg from "../assets/support1.png";

// Local fallback mapping for closer look cards
const localCloserLookImages = [
  visionPro8, // Curved 3D Glass
  visionPro5, // M5 & R1 Chips
  visionPro2, // 23M Micro-OLED
  visionPro3, // Spatial Audio
  visionPro4, // Eye & Hand Tracking
  visionPro1, // Dual Knit Band
];

// Fallback items if API is slow or offline
const defaultCloserLook = [
  {
    id: 1,
    title: "Curved 3D Laminated Glass",
    description: "A singular piece of three-dimensionally formed laminated glass acts as an optical surface for the cameras and sensors.",
    image_url: visionPro8,
  },
  {
    id: 2,
    title: "Dual-Chip Power: M5 & R1",
    description: "The M5 chip delivers unprecedented standalone computing performance, while R1 processes 12 cameras, 5 sensors, and 6 microphones with virtually zero lag.",
    image_url: visionPro5,
  },
  {
    id: 3,
    title: "23 Million Pixels Beyond 4K",
    description: "Custom micro-OLED display system fits 64 pixels into the space of a single iPhone pixel for mind-blowing clarity.",
    image_url: visionPro2,
  },
  {
    id: 4,
    title: "Acoustic Ray-Tracing Audio",
    description: "Dual-driver audio pods deliver rich personalized sound that matches the acoustic properties of your room.",
    image_url: visionPro3,
  },
  {
    id: 5,
    title: "Precision Eye & Hand Tracking",
    description: "High-speed cameras and LED rings track your eyes with surgical accuracy, making navigation as natural as looking and tapping.",
    image_url: visionPro4,
  },
  {
    id: 6,
    title: "Dual Knit Band Ergonomics",
    description: "3D-knitted structure with overhead strap offers continuous breathability, cushioning, and effortless micro-adjustments.",
    image_url: visionPro1,
  },
];

// Deep-dive technology features
const techFeatures = [
  {
    id: "display",
    title: "More pixels than a 4K TV. For each eye.",
    eyebrow: "Displays",
    description:
      "The custom micro-OLED display system features 23 million pixels, delivering stunning resolution and wide color gamut. A specially designed three-element lens creates the feeling of a display that is everywhere you look.",
    imageSrc: visionPro2,
    stat: "23M",
    statLabel: "Pixels Across Two Displays",
  },
  {
    id: "audio",
    title: "Our most advanced Spatial Audio system ever.",
    eyebrow: "Audio",
    description:
      "Dual-driver audio pods positioned next to each ear deliver personalized sound while letting you hear what is around you. Audio ray tracing analyzes your room acoustic properties to adapt sound to your physical space.",
    imageSrc: visionPro3,
    stat: "Spatial",
    statLabel: "Ray-Tracing Acoustics",
  },
  {
    id: "eye-tracking",
    title: "Responsive, precision eye tracking.",
    eyebrow: "Sensors",
    description:
      "A high-performance eye-tracking system of LEDs and infrared cameras projects invisible light patterns onto each eye. This advanced system provides ultraprecise input so you can accurately select elements simply by looking at them.",
    imageSrc: visionPro4,
    stat: "Sub-pixel",
    statLabel: "Gaze Precision",
  },
  {
    id: "chips",
    title: "Revolutionary dual-chip performance. Powered by M5.",
    eyebrow: "Silicon",
    description:
      "Apple Vision Pro makes a giant leap in chip performance with the new M5. It simultaneously runs visionOS, executes computer vision algorithms, and delivers stunning graphics. The dedicated R1 chip streams images to the displays in just 12 milliseconds.",
    imageSrc: visionPro5,
    stat: "12ms",
    statLabel: "Sensor-to-Display Latency",
  },
  {
    id: "design",
    title: "Innovation you can see, hear, and feel.",
    eyebrow: "Craftsmanship",
    description:
      "Custom aluminum alloy frame curves gently around your face, while modular components like the Light Seal and Dual Knit Band conform precisely to individual facial features for a tailored, light-sealed fit.",
    imageSrc: visionPro1,
    stat: "Modular",
    statLabel: "Tailored Ergonomic Fit",
  },
];

// Spatial Experiences
const spatialExperiences = [
  {
    id: "apps",
    category: "Apps & Workspace",
    title: "Free your desktop. And your imagination.",
    description:
      "Your apps live right in your space. Arrange them anywhere, scale them to the perfect size, and stay present in the room with colleagues and family.",
    image: visionPro6,
    tags: ["Infinite Canvas", "Mac Virtual Display", "Multitasking"],
  },
  {
    id: "entertainment",
    category: "Entertainment",
    title: "The ultimate personal theater.",
    description:
      "Transform any room into your own private cinema. Expand movies and Apple TV+ shows up to 100 feet wide with immersive Spatial Audio.",
    image: visionPro7,
    tags: ["100-ft Screen", "3D Movies", "Spatial Audio"],
  },
  {
    id: "photos",
    category: "Photos & Memories",
    title: "Be in the moment. All over again.",
    description:
      "Capture and relive spatial photos and spatial videos in remarkable 3D depth with lifelike clarity. Panoramas wrap around you like you are standing right there.",
    image: visionPro9,
    tags: ["Spatial Photos", "Spatial Video", "Panoramas"],
  },
  {
    id: "connection",
    category: "Connection",
    title: "Get on the same page. In the same space.",
    description:
      "FaceTime video tiles are life-size, and as new people join, the call simply expands. Collaborate seamlessly on Freeform, Keynote, and documents in real time.",
    image: visionPro10,
    tags: ["Spatial Persona", "FaceTime", "Collaboration"],
  },
];

const Vision = () => {
  const videoRef = useRef(null);
  const closerLookScrollRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTechIndex, setActiveTechIndex] = useState(0);
  const [activeExpIndex, setActiveExpIndex] = useState(0);

  // Dynamic closer look data
  const [closerLookItems, setCloserLookItems] = useState(defaultCloserLook);
  const [closerLookLoading, setCloserLookLoading] = useState(true);

  // Dynamic vision products
  const [visionProducts, setVisionProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch Closer Look from DB
  useEffect(() => {
    fetch("/api/vision-closer-look")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load vision closer look");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCloserLookItems(data);
        }
      })
      .catch((err) => {
        console.warn("Using fallback closer look items:", err.message);
      })
      .finally(() => {
        setCloserLookLoading(false);
      });
  }, []);

  // Fetch Vision Products from DB
  useEffect(() => {
    fetch("/api/products/category/vision")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Vision products");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVisionProducts(data);
        }
      })
      .catch((err) => {
        console.warn("Vision products fallback:", err.message);
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, []);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const scrollCloserLook = (direction) => {
    if (closerLookScrollRef.current) {
      closerLookScrollRef.current.scrollBy({
        left: direction * 520,
        behavior: "smooth",
      });
    }
  };

  const getCloserLookImage = (item, index) => {
    if (item.image_url && item.image_url.startsWith("http")) {
      return item.image_url;
    }
    return localCloserLookImages[index % localCloserLookImages.length] || placeholder;
  };

  return (
    <div className="vision-page">
      {/* =========================================
          STICKY VISION LOCAL NAVIGATION
      ========================================= */}
      <nav className="vision-local-nav" aria-label="Apple Vision Pro Navigation">
        <div className="vision-local-nav-content">
          <div className="vision-local-nav-title">
            <Link to="/vision">Apple Vision Pro</Link>
          </div>

          <div className="vision-local-nav-links">
            <a href="#overview" className="nav-link active">Overview</a>
            <a href="#guided-tour" className="nav-link">Guided Tour</a>
            <a href="#technology" className="nav-link">Tech Specs</a>
            <a href="#experiences" className="nav-link">Experiences</a>
            <Link to="/store" className="nav-demo-btn">Book a demo</Link>
            <Link to="/store" className="nav-buy-btn">Buy</Link>
          </div>
        </div>
      </nav>

      {/* =========================================
          HERO SECTION
      ========================================= */}
      <section className="vision-hero" id="overview">
        <div className="vision-hero-inner">
          <div className="vision-hero-badges">
            <span className="vision-badge">Now Powered by M5</span>
          </div>

          <div className="vision-hero-title-group">
            <h1 className="vision-hero-logo">
              <span className="apple-glyph"></span>Vision Pro
            </h1>
            <p className="vision-hero-tagline">
              Welcome to the era of spatial computing.
            </p>
          </div>

          {/* Central 3D Headset Showcase */}
          <div className="vision-headset-visual">
            <div className="vision-glow-backdrop"></div>
            <img
              src={visionImage}
              alt="Apple Vision Pro spatial headset"
              className="vision-headset-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = visionPro1;
              }}
            />
          </div>

          {/* Pricing & CTA Buttons */}
          <div className="vision-hero-cta">
            <div className="vision-pricing-banner">
              <strong>From $3,499</strong> or <span>$291.58/mo. for 12 mo.*</span> at 0% APR
            </div>

            <div className="vision-action-buttons">
              <Link to="/store" className="vision-btn-book">
                Book a demo
              </Link>
              <Link to="/store" className="vision-btn-buy">
                Buy <span>›</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          INTRO PHILOSOPHY BANNER
      ========================================= */}
      <section className="vision-intro">
        <div className="vision-intro-container">
          <h2 className="vision-intro-lead">
            Apple Vision Pro seamlessly blends digital content with your physical space.
          </h2>
          <p className="vision-intro-body">
            You navigate simply by using your eyes, hands, and voice. So you can do the things you love in ways never before possible.
          </p>
        </div>
      </section>

      {/* =========================================
          SPATIAL VIDEO & visionOS INTERFACE
      ========================================= */}
      <section className="vision-video-showcase" id="guided-tour">
        <div className="vision-video-wrapper">
          <video
            ref={videoRef}
            className="vision-main-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={spatialVideo} type="video/mp4" />
            Your browser does not support video playback.
          </video>

          {/* Video Play/Pause Control */}
          <button
            type="button"
            className="vision-video-toggle"
            onClick={toggleVideo}
            aria-label={isPlaying ? "Pause spatial demonstration" : "Play spatial demonstration"}
          >
            {isPlaying ? (
              <span className="control-bars">
                <i></i><i></i>
              </span>
            ) : (
              <span className="control-play">▶</span>
            )}
          </button>

          {/* Floating visionOS App Grid Overlay */}
          <div className="vision-os-hud">
            <div className="vision-hud-status">
              <span className="hud-pulse-dot"></span>
              <span>visionOS 2.2 Live Immersion</span>
            </div>

            <div className="vision-app-dock">
              <div className="vision-dock-icon tv" title="Apple TV"> TV</div>
              <div className="vision-dock-icon music" title="Apple Music">♫</div>
              <div className="vision-dock-icon safari" title="Safari">🧭</div>
              <div className="vision-dock-icon photos" title="Spatial Photos">✿</div>
              <div className="vision-dock-icon spatial" title="Spatial Computing">◈</div>
              <div className="vision-dock-icon store" title="App Store">A</div>
              <div className="vision-dock-icon messages" title="Messages">💬</div>
            </div>
          </div>
        </div>

        <div className="vision-video-caption">
          <h3>Spatial experiences that feel breathtakingly real.</h3>
          <p>
            An infinite canvas that transforms how you use the apps you love.
            Arrange them anywhere and scale them to the perfect size.
          </p>
        </div>
      </section>

      {/* =========================================
          TAKE A CLOSER LOOK (DYNAMIC CAROUSEL)
      ========================================= */}
      <section className="vision-closer-look-section">
        <div className="vision-closer-look-header">
          <div>
            <span className="section-eyebrow">Hardware Design</span>
            <h2>Take a closer look.</h2>
          </div>

          <div className="vision-carousel-nav">
            <button
              type="button"
              onClick={() => scrollCloserLook(-1)}
              aria-label="Scroll to previous card"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollCloserLook(1)}
              aria-label="Scroll to next card"
            >
              ›
            </button>
          </div>
        </div>

        <div className="vision-closer-look-viewport" ref={closerLookScrollRef}>
          <div className="vision-closer-look-track">
            {closerLookItems.map((item, index) => (
              <article className="vision-closer-look-card" key={item.id || index}>
                <div className="vision-closer-look-media">
                  <img
                    src={getCloserLookImage(item, index)}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = localCloserLookImages[index % localCloserLookImages.length];
                    }}
                  />
                </div>

                <div className="vision-closer-look-details">
                  <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  {item.description && (
                    <p>{item.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          DEEP-DIVE TECHNOLOGY EXPLORER
      ========================================= */}
      <section className="vision-tech-section" id="technology">
        <div className="vision-tech-header">
          <span className="section-eyebrow">Groundbreaking Architecture</span>
          <h2>Innovation you can see, hear, and feel.</h2>
          <p>
            Spatial experiences on Apple Vision Pro are only possible through revolutionary custom Apple silicon and cutting-edge sensor arrays.
          </p>
        </div>

        {/* 3 Key Spec Badges */}
        <div className="vision-stats-grid">
          <div className="vision-stat-card">
            <strong>120Hz</strong>
            <span>ProMotion Refresh</span>
            <small>Silky-smooth visual fidelity</small>
          </div>

          <div className="vision-stat-card">
            <strong>23 Million</strong>
            <span>Micro-OLED Pixels</span>
            <small>More pixels than a 4K TV to each eye</small>
          </div>

          <div className="vision-stat-card">
            <strong>12ms</strong>
            <span>Sensor Latency</span>
            <small>Virtually lag-free real-time streaming</small>
          </div>
        </div>

        {/* Interactive Feature Deep Dive */}
        <div className="vision-tech-explorer">
          {/* Tabs */}
          <div className="vision-tech-tabs">
            {techFeatures.map((feature, idx) => (
              <button
                key={feature.id}
                type="button"
                className={`vision-tech-tab ${activeTechIndex === idx ? "active" : ""}`}
                onClick={() => setActiveTechIndex(idx)}
              >
                <span className="tab-eyebrow">{feature.eyebrow}</span>
                <span className="tab-title">{feature.title}</span>
              </button>
            ))}
          </div>

          {/* Active Feature Showcase */}
          <div className="vision-tech-display">
            <div className="vision-tech-display-image">
              <img
                src={techFeatures[activeTechIndex].imageSrc}
                alt={techFeatures[activeTechIndex].title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = visionPro5;
                }}
              />
              <div className="vision-stat-bubble">
                <strong>{techFeatures[activeTechIndex].stat}</strong>
                <span>{techFeatures[activeTechIndex].statLabel}</span>
              </div>
            </div>

            <div className="vision-tech-display-content">
              <span className="active-eyebrow">{techFeatures[activeTechIndex].eyebrow}</span>
              <h3>{techFeatures[activeTechIndex].title}</h3>
              <p>{techFeatures[activeTechIndex].description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SPATIAL EXPERIENCES SHOWCASE
      ========================================= */}
      <section className="vision-experiences-section" id="experiences">
        <div className="vision-experiences-header">
          <span className="section-eyebrow">Designed for Immersion</span>
          <h2>Spatial computing for everyday life.</h2>
        </div>

        {/* Experience Selector Pills */}
        <div className="vision-exp-pills">
          {spatialExperiences.map((exp, idx) => (
            <button
              key={exp.id}
              type="button"
              className={`vision-exp-pill ${activeExpIndex === idx ? "active" : ""}`}
              onClick={() => setActiveExpIndex(idx)}
            >
              {exp.category}
            </button>
          ))}
        </div>

        {/* Active Experience Card */}
        <div className="vision-exp-showcase">
          <div className="vision-exp-image">
            <img
              src={spatialExperiences[activeExpIndex].image}
              alt={spatialExperiences[activeExpIndex].title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = visionPro6;
              }}
            />
          </div>

          <div className="vision-exp-info">
            <span className="exp-cat">{spatialExperiences[activeExpIndex].category}</span>
            <h3>{spatialExperiences[activeExpIndex].title}</h3>
            <p>{spatialExperiences[activeExpIndex].description}</p>

            <div className="exp-tags">
              {spatialExperiences[activeExpIndex].tags.map((tag) => (
                <span className="exp-tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          LINEUP & ACCESSORIES CATALOG
      ========================================= */}
      <section className="vision-lineup-section">
        <div className="vision-lineup-header">
          <span className="section-eyebrow">Explore the Catalog</span>
          <h2>Apple Vision Pro & Accessories</h2>
          <Link to="/store" className="lineup-all-link">
            Shop all in Apple Store <span>›</span>
          </Link>
        </div>

        <div className="vision-lineup-grid">
          {visionProducts.length > 0 ? (
            visionProducts.map((product) => (
              <article className="vision-product-card" key={product.id}>
                <div className="vision-product-image">
                  <img
                    src={product.image_url || visionImage}
                    alt={product.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = visionPro1;
                    }}
                  />
                </div>

                <div className="vision-product-details">
                  {product.badge_text && (
                    <span className="vision-product-badge">{product.badge_text}</span>
                  )}
                  <h3>{product.title}</h3>
                  <p className="vision-product-desc">{product.description}</p>

                  <div className="vision-product-pricing">
                    <p className="price-upfront">
                      From ${Number(product.price_upfront).toLocaleString()}
                    </p>
                    {product.price_monthly && (
                      <p className="price-monthly">
                        or ${Number(product.price_monthly).toFixed(2)}/mo. for 12 mo.*
                      </p>
                    )}
                  </div>

                  <Link to={product.buy_link || "/store"} className="vision-product-buy">
                    {product.buy_text || "Buy"} <span>›</span>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="vision-product-card featured">
              <div className="vision-product-image">
                <img src={visionImage} alt="Apple Vision Pro" />
              </div>
              <div className="vision-product-details">
                <span className="vision-product-badge">New M5 Chip</span>
                <h3>Apple Vision Pro</h3>
                <p className="vision-product-desc">
                  The revolutionary spatial computer that transforms how you work, watch, and connect.
                </p>
                <div className="vision-product-pricing">
                  <p className="price-upfront">From $3,499</p>
                  <p className="price-monthly">or $291.58/mo. for 12 mo.* at 0% APR</p>
                </div>
                <Link to="/store" className="vision-product-buy">
                  Buy <span>›</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          WHY APPLE IS THE BEST PLACE TO BUY
      ========================================= */}
      <section className="vision-why-apple">
        <div className="vision-why-header">
          <h2>Why Apple is the best place to buy Apple Vision Pro.</h2>
        </div>

        <div className="vision-benefits-grid">
          <div className="vision-benefit-card">
            <div className="benefit-icon">👓</div>
            <h3>Book a free demo.</h3>
            <p>
              Experience Apple Vision Pro firsthand in an Apple Store with a 30-minute one-on-one session.
            </p>
            <Link to="/store" className="benefit-link">Book now ›</Link>
          </div>

          <div className="vision-benefit-card">
            <div className="benefit-icon">💳</div>
            <h3>Pay 0% APR over 12 months.</h3>
            <p>
              Choose Apple Card Monthly Installments to pay over time with 0% interest and 3% Daily Cash back.
            </p>
            <Link to="/store" className="benefit-link">Learn more ›</Link>
          </div>

          <div className="vision-benefit-card">
            <div className="benefit-icon">📦</div>
            <h3>Free delivery & setup.</h3>
            <p>
              Get free two-hour delivery or easy in-store pickup with a personalized fitting session.
            </p>
            <Link to="/store" className="benefit-link">Find a store ›</Link>
          </div>

          <div className="vision-benefit-card">
            <div className="benefit-icon">🔄</div>
            <h3>Apple Trade In.</h3>
            <p>
              Trade in your eligible Mac, iPad, or iPhone for instant credit toward Apple Vision Pro.
            </p>
            <Link to="/store" className="benefit-link">Get an estimate ›</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vision;
