
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchQuery = query.trim();

    if (!searchQuery) {
      setProducts([]);
      setSearched(false);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      setSearched(true);

      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Product search is unavailable.");
        }

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load local products. Try Apple's website below.");
          setProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const appleSearchUrl = `https://www.apple.com/search/?q=${encodeURIComponent(
    query.trim()
  )}`;

  const categories = [
    { name: "iPhone", image: "/iphone.png" },
    { name: "Mac", image: "/mac.png" },
    { name: "iPad", image: "/ipad.png" },
    { name: "Watch", image: "/watch.png" },
    { name: "Vision", image: "/vision.png" },
    { name: "AirPods", image: "/airpods.png" },
  ];

  return (
    <main className="apple-search-page">
      <section className="apple-search-hero">
        <h1>Search</h1>
        <p>Find the Apple products you're looking for.</p>

        <form
          className="apple-search-form"
          onSubmit={(e) => {
            e.preventDefault();

            if (query.trim()) {
              window.location.href = appleSearchUrl;
            }
          }}
        >
          <i className="bi bi-search" aria-hidden="true"></i>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apple.com"
            aria-label="Search products"
          />

          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </form>

        {query.trim() && (
          <a
            className="apple-external-search"
            href={appleSearchUrl}
            target="_blank"
            rel="noreferrer"
          >
            Search Apple's website for "{query.trim()}" ↗
          </a>
        )}
      </section>

      {query.trim() ? (
        <section className="search-results">
          <h2>Search results</h2>

          {loading && <p>Searching products...</p>}

          {!loading && error && (
            <p className="search-error">{error}</p>
          )}

          {!loading && !error && searched && products.length === 0 && (
            <p>
              No matching products in your website's database.
              Try searching Apple's website directly.
            </p>
          )}

          {!loading && products.length > 0 && (
            <div className="search-product-grid">
              {products.map((product) => (
                <article
                  className="search-product-card"
                  key={product.id}
                >
                  <img
                    src={
                      product.image
                        ? product.image.startsWith("http")
                          ? product.image
                          : `/uploads/${product.image}`
                        : "/product-placeholder.png"
                    }
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = "/product-placeholder.png";
                    }}
                  />

                  <h3>{product.name}</h3>

                  {product.description && (
                    <p>{product.description}</p>
                  )}

                  {product.price != null && (
                    <p className="search-product-price">
                      ${product.price}
                    </p>
                  )}

                  <Link
                    to={
                      product.slug
                        ? `/product/${product.slug}`
                        : `/product/${product.id}`
                    }
                    className="search-learn-more"
                  >
                    Learn more →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="search-browse-section">
          <h2>Explore by product</h2>

          <div className="support-category-grid">
            {categories.map((item) => (
              <button
                type="button"
                className="support-category-item"
                key={item.name}
                onClick={() => setQuery(item.name)}
              >
                <div className="support-icon-wrap">
                  <img src={item.image} alt={item.name} />
                </div>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <h2 className="search-quick-title">Quick Links</h2>

          <div className="search-quick-links">
            {["MacBook", "iPhone", "iPad", "AirPods", "Apple Watch"].map(
              (name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setQuery(name)}
                >
                  {name} →
                </button>
              )
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default Search;
