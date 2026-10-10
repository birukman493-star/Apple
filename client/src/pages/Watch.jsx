import React, { useRef, useState, useEffect } from "react";
import "./Watch.css";

// Import images from src/assets
import Watch1 from "../assets/watch1.jpg";
import Watch2 from "../assets/watch2.jpg";
import Watch3 from "../assets/watch3.jpg";
import Watch4 from "../assets/watch4.jpg";
import Watch5 from "../assets/watch5.jpg";
import Watch6 from "../assets/watch6.jpg";
import Watch7 from "../assets/watch9.jpg";
import Watch8 from "../assets/watch8.jpg";
import FitnessPlus from "../assets/watch5.jpg";

// If watch-nike.png is inside public/images, use this path:
const Watch = () => {
  const carouselRef = useRef(null);

  const [activeMade, setActiveMade] = useState("fitness");

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
      image: "/images/watch-nike.png",
      badge: "New Colors",
      link: "/watch/nike",
    },
    {
      name: "Apple Watch Hermès",
      image: Watch4,
      badge: "New",
      link: "/watch/hermes",
    },
    {
      name: "Compare",
      image: Watch5,
      badge: "",
      link: "/watch/compare",
    },
    {
      name: "Bands",
      image: Watch6,
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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/watch-lineup"
        );

        if (!response.ok) {
          throw new Error("Failed to load Watch lineup.");
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Watch lineup error:", err);
        setError("Unable to load the Watch lineup.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Dynamic Watch shopping benefits
  const [shoppingBenefits, setShoppingBenefits] = useState([]);
  const [benefitsLoading, setBenefitsLoading] = useState(true);
  const [benefitsError, setBenefitsError] = useState("");

  const benefitsCarouselRef = useRef(null);

  useEffect(() => {
    const fetchShoppingBenefits = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/watch-shopping-benefits"
        );

        if (!response.ok) {
          throw new Error("Failed to load shopping benefits.");
        }

        const data = await response.json();

        setShoppingBenefits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Shopping benefits error:", err);
        setBenefitsError("Unable to load shopping benefits.");
      } finally {
        setBenefitsLoading(false);
      }
    };

    fetchShoppingBenefits();
  }, []);

  const scrollBenefits = (direction) => {
    if (benefitsCarouselRef.current) {
      benefitsCarouselRef.current.scrollBy({
        left: direction * 600,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="watch-page">


      {/* Watch product navigation */}
      <section className="watch-product-section">
        <h1 className="watch-main-title">Apple Watch</h1>

        <div className="watch-carousel-wrapper">
          <div className="watch-carousel" ref={carouselRef}>
            {watchItems.map((item) => (
              <a
                href={item.link}
                className="watch-product-item"
                key={item.name}
              >
                <div className="watch-product-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                      console.error("Image failed to load:", item.image);
                    }}
                  />
                </div>

                <span className="watch-product-name">
                  {item.name}
                </span>

                {item.badge && (
                  <span className="watch-product-badge">
                    {item.badge}
                  </span>
                )}
              </a>
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

      {/* ============================
    EXPLORE THE LINEUP SECTION
============================ */}

      <section className="watch-lineup-section">
        <div className="watch-lineup-heading">
          <h2>Explore the lineup.</h2>

          <a href="/watch/compare" className="watch-compare-link">
            Compare all models <span>›</span>
          </a>
        </div>

        {loading ? (
          <p className="watch-lineup-status">Loading...</p>
        ) : error ? (
          <p className="watch-lineup-status">{error}</p>
        ) : products.length === 0 ? (
          <p className="watch-lineup-status">
            No products available.
          </p>
        ) : (
          <div className="watch-lineup-grid">
            {products.map((product) => (
              <article
                className="watch-lineup-card"
                key={product.id}
              >
                <a
                  href={product.learn_more_url || "#"}
                  className="watch-lineup-image-link"
                >
                  <div className="watch-lineup-image">
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                        console.error(
                          "Image failed to load:",
                          product.image_url
                        );
                      }}
                    />
                  </div>
                </a>

                {product.colors?.length > 0 && (
                  <div className="watch-lineup-colors">
                    {product.colors.map((color, index) => (
                      <span
                        key={`${product.id}-${index}`}
                        className="watch-lineup-color"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}

                <div className="watch-lineup-details">
                  {product.badge && (
                    <span className="watch-lineup-badge">
                      {product.badge}
                    </span>
                  )}

                  <h3>{product.product_name}</h3>

                  {product.description && (
                    <p className="watch-lineup-description">
                      {product.description}
                    </p>
                  )}

                  <div className="watch-lineup-pricing">
                    {product.price_text && (
                      <p>{product.price_text}</p>
                    )}

                    {product.lease_text && (
                      <p>{product.lease_text}</p>
                    )}
                  </div>

                  <div className="watch-lineup-actions">
                    <a
                      href={product.learn_more_url || "#"}
                      className="watch-lineup-learn"
                    >
                      Learn more
                    </a>

                    <a
                      href={product.buy_url || "#"}
                      className="watch-lineup-buy"
                    >
                      Buy <span>›</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* WHY APPLE IS THE BEST PLACE TO SHOP */}

      <section className="watch-shopping-section">
        <div className="watch-shopping-heading">
          <h2>
            Why Apple is the best
            <br />
            place to shop Apple Watch.
          </h2>

          <a
            href="/watch/shop"
            className="watch-shopping-shop-link"
          >
            Shop Apple Watch <span>›</span>
          </a>


        </div>

        {benefitsLoading ? (<p className="watch-shopping-status">Loading...</p>
        ) : benefitsError ? (<p className="watch-shopping-status">{benefitsError}</p>
        ) : shoppingBenefits.length === 0 ? (<p className="watch-shopping-status">
          No shopping benefits available. </p>
        ) : (<div className="watch-shopping-carousel-wrapper"> <div
          className="watch-shopping-carousel"
          ref={benefitsCarouselRef}
        >
          {shoppingBenefits.map((benefit) => (<article
            className="watch-shopping-card"
            key={benefit.id}
          > <div className="watch-shopping-card-content">
              {benefit.eyebrow && (<p className="watch-shopping-eyebrow">
                {benefit.eyebrow} </p>
              )}


              <h3>{benefit.title}</h3>

              {benefit.description && (
                <p className="watch-shopping-description">
                  {benefit.description}
                </p>
              )}

              {benefit.link_url && (
                <a
                  href={benefit.link_url}
                  className="watch-shopping-card-link"
                >
                  Learn more <span>›</span>
                </a>
              )}
            </div>

            {benefit.image_url && (
              <div className="watch-shopping-image">
                <img
                  src={benefit.image_url}
                  alt={benefit.title}
                  loading="lazy"
                />
              </div>
            )}
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

        )}

      </section>

      {/* =========================================
    MADE FOR EACH OTHER SECTION
========================================= */}

      <section className="watch-made-section">
        <div className="watch-made-container">

          {/* LEFT SIDE */}
          <div className="watch-made-left">

            <h2>Made for each other.</h2>

            <div className="watch-accordion">

              {/* Apple Watch and iPhone */}
              <button
                className="watch-accordion-item"
                onClick={() => setActiveMade("iphone")}
              >
                <span>Apple Watch and iPhone</span>

                <span className="watch-accordion-icon">
                  {activeMade === "iphone" ? "−" : "+"}
                </span>
              </button>

              {activeMade === "iphone" && (
                <div className="watch-accordion-content">
                  <p>
                    Apple Watch and iPhone work together to help you stay
                    connected, active, and informed throughout your day.
                  </p>
                </div>
              )}

              {/* Apple Watch and AirPods */}
              <button
                className="watch-accordion-item"
                onClick={() => setActiveMade("airpods")}
              >
                <span>Apple Watch and AirPods</span>

                <span className="watch-accordion-icon">
                  {activeMade === "airpods" ? "−" : "+"}
                </span>
              </button>

              {activeMade === "airpods" && (
                <div className="watch-accordion-content">
                  <p>
                    Pair Apple Watch with AirPods for a seamless listening
                    experience while you work out, walk, or run.
                  </p>
                </div>
              )}

              {/* Apple Watch and Apple Fitness+ */}
              <button
                className="watch-accordion-item active"
                onClick={() => setActiveMade("fitness")}
              >
                <span>Apple Watch and Apple Fitness+</span>

                <span className="watch-accordion-icon">
                  {activeMade === "fitness" ? "−" : "+"}
                </span>
              </button>

              {activeMade === "fitness" && (
                <div className="watch-accordion-content">
                  <p>
                    Apple Watch supercharges your Fitness+ experience with
                    real-time, personalized metrics onscreen, like your heart
                    rate, calories burned, and Activity rings.⁴ And you get
                    the freedom of audio-guided walks, runs, and more.
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="watch-made-right">

            <div className="watch-fitness-image">
              <img
                src={FitnessPlus}
                alt="Apple Watch and Apple Fitness+"
              />

              {/* Workout metrics overlay */}
              <div className="watch-metrics">
                <div>
                  <span>TIME</span>
                  <strong>22:14</strong>
                </div>

                <div>
                  <span>HEART RATE</span>
                  <strong>121</strong>
                </div>

                <div>
                  <span>ACTIVE CALORIES</span>
                  <strong>155</strong>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      

    </div>
  );
};

export default Watch;