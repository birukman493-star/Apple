import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Store.css";

const categories = [
  { name: "Mac", path: "/mac", icon: "💻" },
  { name: "iPhone", path: "/iphone", icon: "📱" },
  { name: "iPad", path: "/ipad", icon: "📱" },
  { name: "Apple Watch", path: "/watch", icon: "⌚" },
  { name: "Apple Vision Pro", path: "/vision", icon: "🥽" },
  { name: "AirPods", path: "/airpods", icon: "🎧" },
  { name: "AirTag", path: "/airtag", icon: "⚪" },
  { name: "Apple TV 4K", path: "/tv-home", icon: "📺" },
];

function Store() {
  const [products, setProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [accessoriesLoading, setAccessoriesLoading] = useState(true);

  const [error, setError] = useState("");
  const [accessoriesError, setAccessoriesError] = useState("");

  const [helpCards, setHelpCards] = useState([]);
  const [helpLoading, setHelpLoading] = useState(true);
  const [helpError, setHelpError] = useState("");

  const [differenceCards, setDifferenceCards] = useState([]);
  const [differenceLoading, setDifferenceLoading] = useState(true);
  const [differenceError, setDifferenceError] = useState("");

  const [soundCards, setSoundCards] = useState([]);
  const [soundLoading, setSoundLoading] = useState(true);
  const [soundError, setSoundError] = useState("");

  const [experienceCards, setExperienceCards] = useState([]);
  const [experienceLoading, setExperienceLoading] = useState(true);
  const [experienceError, setExperienceError] = useState("");

  const [savingsCards, setSavingsCards] = useState([]);
  const [savingsLoading, setSavingsLoading] = useState(true);
  const [savingsError, setSavingsError] = useState("");

  /* =========================
     REUSABLE FETCH FUNCTION
  ========================= */

  const fetchData = async (url, setData, setError, setLoading) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load this section.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FETCH STORE DATA
  ========================= */

  useEffect(() => {
    fetchData(
      "/api/products/latest",
      setProducts,
      setError,
      setLoading
    );

    fetchData(
      "/api/products/accessories",
      setAccessories,
      setAccessoriesError,
      setAccessoriesLoading
    );

    fetchData(
      "/api/store-help",
      setHelpCards,
      setHelpError,
      setHelpLoading
    );

    fetchData(
      "/api/store-difference",
      setDifferenceCards,
      setDifferenceError,
      setDifferenceLoading
    );

    fetchData(
      "/api/store-sound",
      setSoundCards,
      setSoundError,
      setSoundLoading
    );

    fetchData(
      "/api/store-experience",
      setExperienceCards,
      setExperienceError,
      setExperienceLoading
    );

    fetchData(
      "/api/store-savings",
      setSavingsCards,
      setSavingsError,
      setSavingsLoading
    );
  }, []);

  return (
    <main className="store-page">

      {/* =========================
          STORE HEADER
      ========================= */}

      <section className="store-header">
        <div className="store-header-content">
          <h1>Store</h1>

          <div className="store-header-text">
            <h2>
              The best way to buy the <br />
              products you love.
            </h2>

            <div className="store-links">
              <Link to="/store/specialist">
                Connect with a Specialist
              </Link>

              <Link to="/store/find">
                Find an Apple Store
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* =========================
          PRODUCT CATEGORIES
      ========================= */}

      <section className="store-products">
        <div className="store-products-container">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="store-product"
            >
              <div className="store-product-icon">
                {category.icon}
              </div>

              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </section>


      {/* =========================
          THE LATEST
      ========================= */}

      <section className="latest-section">
        <div className="latest-header">
          <h2>
            <span>The latest.</span>{" "}
            Take a look at what's new.
          </h2>
        </div>

        {loading && (
          <div className="latest-message">
            Loading products...
          </div>
        )}

        {!loading && error && (
          <div className="latest-message">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="latest-carousel">
            {products.map((product) => (
              <article
                className="latest-card"
                key={product.id}
              >
                <div className="latest-card-image">
                  <img
                    src={product.image_url}
                    alt={product.title}
                  />
                </div>

                <div className="latest-card-content">
                  {product.badge_text && (
                    <p className="latest-badge">
                      {product.badge_text}
                    </p>
                  )}

                  <h3>{product.title}</h3>

                  <p className="latest-description">
                    {product.description}
                  </p>

                  {product.price_upfront && (
                    <p className="latest-price">
                      From $
                      {Number(
                        product.price_upfront
                      ).toLocaleString()}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>


      {/* =========================
          ACCESSORIES
      ========================= */}

      <section className="accessories-section">
        <div className="accessories-header">
          <h2>
            <span>Accessories.</span>{" "}
            Essentials that pair perfectly with your
            favorite products.
          </h2>
        </div>

        {accessoriesLoading && (
          <div className="accessories-message">
            Loading accessories...
          </div>
        )}

        {!accessoriesLoading && accessoriesError && (
          <div className="accessories-message">
            {accessoriesError}
          </div>
        )}

        {!accessoriesLoading && !accessoriesError && (
          <div className="accessories-carousel">

            <article className="accessories-intro-card">
              <div className="accessories-intro-content">
                <h3>Find your new favorites.</h3>

                <p>
                  Explore accessories in new colors,
                  styles, and textures you'll love.
                </p>
              </div>
            </article>

            {accessories.map((product) => (
              <article
                className="accessories-card"
                key={product.id}
              >
                <div className="accessories-card-image">
                  <img
                    src={product.image_url}
                    alt={product.title}
                  />
                </div>

                <div className="accessories-card-content">
                  {product.badge_text && (
                    <p className="accessories-badge">
                      {product.badge_text}
                    </p>
                  )}

                  <h3>{product.title}</h3>

                  {product.price_upfront && (
                    <p className="accessories-price">
                      $
                      {Number(
                        product.price_upfront
                      ).toFixed(2)}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>


      {/* =========================
          HELP SECTION
      ========================= */}

      <section className="help-section">
        <div className="help-header">
          <h2>
            Help is here.
            <span> Whenever and however you need it.</span>
          </h2>
        </div>

        {helpLoading && (
          <div className="help-message">
            Loading...
          </div>
        )}

        {!helpLoading && helpError && (
          <div className="help-message">
            {helpError}
          </div>
        )}

        {!helpLoading && !helpError && (
          <div className="help-carousel">
            {helpCards.map((card) => (
              <article
                className="help-card"
                key={card.id}
              >
                <div className="help-card-content">
                  {card.label && (
                    <p className="help-label">
                      {card.label}
                    </p>
                  )}

                  <h3>{card.title}</h3>

                  {card.description && (
                    <p className="help-description">
                      {card.description}
                    </p>
                  )}
                </div>

                {card.image_url && (
                  <img
                    src={card.image_url}
                    alt={card.title}
                    className="help-card-image"
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </section>


      {/* =========================
          APPLE STORE DIFFERENCE
      ========================= */}

      <section className="store-difference">
        <div className="store-difference-header">
          <h2>
            The Apple Store difference.
            <span> Even more reasons to shop with us.</span>
          </h2>
        </div>

        {differenceLoading && (
          <div className="difference-message">
            Loading...
          </div>
        )}

        {!differenceLoading && differenceError && (
          <div className="difference-message">
            {differenceError}
          </div>
        )}

        {!differenceLoading && !differenceError && (
          <div className="difference-carousel">
            {differenceCards.map((card) => (
              <article
                key={card.id}
                className={`difference-card ${
                  card.card_size === "large"
                    ? "difference-card-large"
                    : ""
                }`}
              >
                {card.icon_url && (
                  <img
                    src={card.icon_url}
                    alt=""
                    className="difference-icon"
                  />
                )}

                <div className="difference-content">
                  {card.label && (
                    <p className="difference-label">
                      {card.label}
                    </p>
                  )}

                  <h3>{card.title}</h3>

                  {card.description && (
                    <p className="difference-description">
                      {card.description}
                    </p>
                  )}
                </div>

                {card.image_url && (
                  <img
                    src={card.image_url}
                    alt={card.title}
                    className="difference-image"
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </section>


      {/* =========================
          LOUD AND CLEAR
      ========================= */}

      <section className="store-sound">
        <div className="store-sound-header">
          <h2>
            Loud and clear.
            <span>
              {" "}
              Unparalleled choices for rich,
              high-quality sound.
            </span>
          </h2>
        </div>

        {soundLoading && (
          <div className="sound-message">
            Loading...
          </div>
        )}

        {!soundLoading && soundError && (
          <div className="sound-message">
            {soundError}
          </div>
        )}

        {!soundLoading && !soundError && (
          <div className="sound-carousel">
            {soundCards.map((card) => (
              <article
                key={card.id}
                className={`sound-card ${
                  card.card_size === "large"
                    ? "sound-card-large"
                    : ""
                }`}
              >
                <div className="sound-content">
                  {card.label && (
                    <p className="sound-label">
                      {card.label}
                    </p>
                  )}

                  <h3>{card.title}</h3>

                  {card.description && (
                    <p className="sound-description">
                      {card.description}
                    </p>
                  )}
                </div>

                {card.image_url && (
                  <img
                    src={card.image_url}
                    alt={card.title}
                    className="sound-image"
                  />
                )}

                {card.badge_text && (
                  <p className="sound-badge">
                    {card.badge_text}
                  </p>
                )}

                {card.price && (
                  <p className="sound-price">
                    {card.price}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>


      {/* =========================
          APPLE EXPERIENCE
      ========================= */}

      <section className="store-experience">
        <div className="store-experience-header">
          <h2>
            The Apple experience.
            <span>
              {" "}
              Do even more with Apple products
              and services.
            </span>
          </h2>
        </div>

        {experienceLoading && (
          <div className="experience-message">
            Loading...
          </div>
        )}

        {!experienceLoading && experienceError && (
          <div className="experience-message">
            {experienceError}
          </div>
        )}

        {!experienceLoading && !experienceError && (
          <div className="experience-carousel">
            {experienceCards.map((card) => (
              <article
                key={card.id}
                className="experience-card"
              >
                <div className="experience-content">
                  {card.label && (
                    <p className="experience-label">
                      {card.label}
                    </p>
                  )}

                  <h3>{card.title}</h3>

                  {card.description && (
                    <p className="experience-description">
                      {card.description}
                    </p>
                  )}
                </div>

                {card.image_url && (
                  <img
                    src={card.image_url}
                    alt={card.title}
                    className="experience-image"
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </section>


      {/* =========================
          SAVINGS AND OFFERS
      ========================= */}

      <section className="store-savings">
        <div className="store-savings-header">
          <h2>
            Savings and offers.
            <span>
              {" "}
              Exclusive deals, special stores,
              and more.
            </span>
          </h2>
        </div>

        {savingsLoading && (
          <div className="savings-message">
            Loading...
          </div>
        )}

        {!savingsLoading && savingsError && (
          <div className="savings-message">
            {savingsError}
          </div>
        )}

        {!savingsLoading && !savingsError && (
          <div className="savings-carousel">
            {savingsCards.map((card) => (
              <article
                className="savings-card"
                key={card.id}
              >
                <div className="savings-content">
                  {card.label && (
                    <p className="savings-label">
                      {card.label}
                    </p>
                  )}

                  <h3>{card.title}</h3>

                  {card.description && (
                    <p className="savings-description">
                      {card.description}
                    </p>
                  )}
                </div>

                {card.image_url && (
                  <img
                    src={card.image_url}
                    alt={card.title}
                    className="savings-image"
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </section>


      {/* =========================
          QUICK LINKS
      ========================= */}

      <section className="quick-links">
        <div className="quick-links-header">
          <h2>Quick Links</h2>
        </div>

        <div className="quick-links-container">

          <Link
            to="/store/find"
            className="quick-link-button"
          >
            Find a Store
          </Link>

          <Link
            to="/store/order-status"
            className="quick-link-button"
          >
            Order Status
          </Link>

          <Link
            to="/store/shopping-help"
            className="quick-link-button"
          >
            Shopping Help
          </Link>

          <Link
            to="/store/returns"
            className="quick-link-button"
          >
            Returns
          </Link>

          <Link
            to="/store/saves"
            className="quick-link-button"
          >
            Your Saves
          </Link>

        </div>
      </section>

    </main>
  );
}

export default Store;