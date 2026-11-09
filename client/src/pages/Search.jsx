import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  FiSearch,
  FiX,
  FiShoppingBag,
  FiClock,
  FiTrendingUp,
  FiTrash2,
  FiArrowRight,
  FiFilter,
  FiTag,
  FiCheck
} from "react-icons/fi";
import "./Search.css";

const POPULAR_SEARCHES = [
  "iPhone 16 Pro",
  "MacBook Pro M4",
  "AirPods Pro",
  "Apple Watch Ultra",
  "iPad Air",
  "Apple Vision Pro",
  "MagSafe Charger",
  "FineWoven Wallet"
];

const CATEGORIES = [
  { name: "All", label: "All Products" },
  { name: "iPhone", label: "iPhone" },
  { name: "Mac", label: "Mac" },
  { name: "iPad", label: "iPad" },
  { name: "Watch", label: "Apple Watch" },
  { name: "Vision", label: "Vision Pro" },
  { name: "AirPods", label: "AirPods" },
  { name: "TV & Home", label: "TV & Home" },
  { name: "Accessories", label: "Accessories" }
];

const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-100", label: "Under $100", min: 0, max: 100 },
  { id: "100-500", label: "$100 – $500", min: 100, max: 500 },
  { id: "500-1000", label: "$500 – $1,000", min: 500, max: 1000 },
  { id: "over-1000", label: "$1,000 & Above", min: 1000, max: Infinity }
];

export default function Search() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortOption, setSortOption] = useState("relevance"); // 'relevance' | 'low-high' | 'high-low'

  // Toast
  const [toastMsg, setToastMsg] = useState("");

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("apple_recent_searches");
      return saved ? JSON.parse(saved) : ["iPhone 16", "MacBook", "AirPods"];
    } catch {
      return ["iPhone 16", "MacBook", "AirPods"];
    }
  });

  const searchInputRef = useRef(null);

  // Save recent search
  const addRecentSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      try {
        localStorage.setItem("apple_recent_searches", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const removeRecentSearch = (term, e) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      try {
        localStorage.setItem("apple_recent_searches", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("apple_recent_searches");
  };

  // Live suggestions query
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      setIsSuggesting(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(Array.isArray(data) ? data.slice(0, 5) : []);
          setIsSuggesting(true);
        }
      } catch (err) {
        console.warn("Suggestions error:", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Execute full search
  const performSearch = async (searchTerm) => {
    const term = searchTerm.trim();
    if (!term) return;

    setActiveQuery(term);
    setQuery(term);
    setIsSuggesting(false);
    setLoading(true);
    setError("");
    setHasSearched(true);
    addRecentSearch(term);

    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error("Unable to retrieve products at this time.");
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to search product database.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  const handleQuickTermClick = (term) => {
    setQuery(term);
    performSearch(term);
  };

  // Filter & Sort results
  const filteredProducts = useMemo(() => {
    const activeRange = PRICE_RANGES.find((r) => r.id === selectedPriceRange) || PRICE_RANGES[0];

    return products.filter((p) => {
      const matchesCat =
        selectedCategory === "All" ||
        (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      const price = Number(p.price_upfront || p.price || 0);
      const matchesPrice = price >= activeRange.min && price <= activeRange.max;
      return matchesCat && matchesPrice;
    }).sort((a, b) => {
      const priceA = Number(a.price_upfront || a.price || 0);
      const priceB = Number(b.price_upfront || b.price || 0);
      if (sortOption === "low-high") return priceA - priceB;
      if (sortOption === "high-low") return priceB - priceA;
      return 0; // relevance keeps database ranking
    });
  }, [products, selectedCategory, selectedPriceRange, sortOption]);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setToastMsg(`✓ Added "${product.title || product.name}" to Bag.`);
    setTimeout(() => setToastMsg(""), 3500);
  };

  return (
    <main className="apple-search-page">
      {/* Toast */}
      {toastMsg && (
        <div className="search-floating-toast">
          <span>{toastMsg}</span>
          <Link to="/bag" className="toast-bag-btn">Review Bag</Link>
          <Link to="/checkout" className="toast-checkout-btn">Check Out</Link>
        </div>
      )}

      {/* Hero Search Box */}
      <section className="search-hero-box">
        <h1 className="search-main-heading">Search Apple</h1>
        <p className="search-subheading">
          Find products, hardware specs, accessories, and store availability.
        </p>

        <div className="search-bar-wrapper">
          <form className="search-input-container" onSubmit={handleFormSubmit}>
            <FiSearch size={22} className="search-icon-decor" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name, model, or category..."
              aria-label="Search Apple products"
              autoFocus
            />
            {query && (
              <button
                type="button"
                className="btn-clear-query"
                onClick={() => {
                  setQuery("");
                  setActiveQuery("");
                  setHasSearched(false);
                  setProducts([]);
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear query"
              >
                <FiX size={18} />
              </button>
            )}
            <button type="submit" className="btn-submit-search">
              Search
            </button>
          </form>

          {/* Live Auto-Suggest Dropdown */}
          {isSuggesting && suggestions.length > 0 && (
            <div className="search-suggestions-dropdown">
              <div className="suggestions-header">Matching Products</div>
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="suggestion-row"
                  onClick={() => {
                    performSearch(item.title || item.name);
                  }}
                >
                  <img
                    src={item.image_url || item.image || item.imageMain || "/product-placeholder.png"}
                    alt={item.title}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="suggestion-details">
                    <span className="suggestion-title">{item.title || item.name}</span>
                    <span className="suggestion-cat">{item.category}</span>
                  </div>
                  <div className="suggestion-price">
                    ${Number(item.price_upfront || item.price || 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links: Recent & Popular */}
        {!hasSearched && (
          <div className="search-discovery-panel">
            {recentSearches.length > 0 && (
              <div className="discovery-group">
                <div className="discovery-group-header">
                  <span className="group-title">
                    <FiClock size={14} /> Recent Searches
                  </span>
                  <button type="button" className="clear-all-link" onClick={clearAllRecent}>
                    Clear All
                  </button>
                </div>
                <div className="tag-pills-row">
                  {recentSearches.map((term) => (
                    <span
                      key={term}
                      className="discovery-pill"
                      onClick={() => handleQuickTermClick(term)}
                    >
                      {term}
                      <button
                        type="button"
                        onClick={(e) => removeRecentSearch(term, e)}
                        className="pill-remove-btn"
                        title="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="discovery-group">
              <span className="group-title">
                <FiTrendingUp size={14} /> Popular Searches
              </span>
              <div className="tag-pills-row">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="discovery-pill popular"
                    onClick={() => handleQuickTermClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Search Results Area */}
      {hasSearched && (
        <section className="search-results-area">
          <div className="results-header-container">
            <div>
              <h2 className="results-title">
                Results for "<strong>{activeQuery}</strong>"
              </h2>
              <span className="results-count">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </span>
            </div>

            {/* Filter and Sort controls */}
            <div className="results-controls-row">
              <select
                className="results-dropdown"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                className="results-dropdown"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>

              <select
                className="results-dropdown"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="search-loading-box">
              <div className="apple-spinner-small"></div>
              <span>Searching Apple product catalog...</span>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="search-error-box">
              <p>{error}</p>
            </div>
          )}

          {/* Empty Results state */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="search-empty-box">
              <FiSearch size={48} className="empty-search-icon" />
              <h3>No products found for "{activeQuery}"</h3>
              <p>We couldn't find matches matching your active filters. Try searching for broader terms or resetting your filters.</p>
              <div className="empty-suggestions-tags">
                <button
                  type="button"
                  className="reset-btn"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedPriceRange("all");
                  }}
                >
                  Reset Category & Price Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {!loading && filteredProducts.length > 0 && (
            <div className="search-products-grid">
              {filteredProducts.map((p) => {
                const price = Number(p.price_upfront || p.price || 0);
                const discount = p.discount_price ? Number(p.discount_price) : null;
                const effectivePrice = discount || price;
                const categoryUrl = p.category
                  ? `/${p.category.toLowerCase().replace(/[\s\-_&]/g, "")}`
                  : "/store";

                return (
                  <article key={p.id} className="search-result-card">
                    {p.badge_text && <span className="product-badge">{p.badge_text}</span>}

                    <div className="card-thumb-container">
                      <img
                        src={p.image_url || p.image || p.imageMain || "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop"}
                        alt={p.title || p.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop";
                        }}
                      />
                    </div>

                    <div className="card-info">
                      <span className="card-category-label">{p.category}</span>
                      <h3 className="card-title">{p.title || p.name}</h3>

                      {p.description && (
                        <p className="card-snippet">
                          {p.description.length > 90
                            ? `${p.description.slice(0, 90)}...`
                            : p.description}
                        </p>
                      )}

                      <div className="card-pricing">
                        <strong className="current-price">${effectivePrice.toFixed(2)}</strong>
                        {discount && (
                          <span className="original-price">${price.toFixed(2)}</span>
                        )}
                      </div>

                      <div className="card-cta-row">
                        <button
                          type="button"
                          className="btn-add-bag"
                          onClick={(e) => handleAddToCart(p, e)}
                        >
                          <FiShoppingBag size={14} /> Add to Bag
                        </button>
                        <Link to={categoryUrl} className="btn-learn-more">
                          Learn More <FiArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Explore Store Categories */}
      <section className="search-categories-section">
        <h2 className="explore-title">Explore Apple Store</h2>
        <div className="explore-grid">
          {[
            { name: "iPhone", path: "/iphone", desc: "Titanium design & Apple Intelligence" },
            { name: "Mac", path: "/mac", desc: "Supercharged by Apple M4 chips" },
            { name: "iPad", path: "/ipad", desc: "Touch, draw, and type on pure power" },
            { name: "Apple Watch", path: "/watch", desc: "The ultimate device for a healthy life" },
            { name: "Apple Vision Pro", path: "/vision", desc: "Welcome to the era of spatial computing" },
            { name: "AirPods", path: "/airpods", desc: "Immersive audio & active noise cancellation" },
            { name: "Accessories", path: "/accessories", desc: "Cases, MagSafe charging, cables & straps" }
          ].map((item) => (
            <Link to={item.path} key={item.name} className="explore-card">
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <span className="explore-arrow">Shop {item.name} →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
