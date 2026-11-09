/**
 * SectionRenderer — Unified Dynamic Section System
 * Fetches published website_sections for a given category from the backend
 * and renders them using the correct layout component.
 *
 * Props:
 *   category {string}  — The category/page name (e.g. "Mac", "iPhone", "TV & Home")
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { normalise, categoryMatches } from '../constants/sectionRegistry';
import './SectionRenderer.css';

// Placeholder image for missing assets
const placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+M6ZcAAAAASUVORK5CYII=";

const API_BASE = 'http://localhost:5000/api';

// ─────────────────────────────────────────────
// Layout Components
// ─────────────────────────────────────────────

/** Hero Banner — full-width with large headline, optional image */
function HeroBanner({ section }) {
  const img = section.image_url || section.product_image;
  return (
    <div className="sr-hero">
      {img && (
        <div className="sr-hero__media">
          <img src={img} alt={section.title} loading="lazy" onError={e=>e.target.src=placeholder} />
        </div>
      )}
      <div className="sr-hero__content">
        {section.badge_text && (
          <span className="sr-eyebrow-badge">{section.badge_text}</span>
        )}
        <h2 className="sr-hero__title">{section.title}</h2>
        {section.subtitle && (
          <p className="sr-hero__subtitle">{section.subtitle}</p>
        )}
        {section.product_price && (
          <p className="sr-hero__price">
            From ${Number(section.product_price).toLocaleString()}
          </p>
        )}
        <div className="sr-hero__actions">
          {section.button_text && (
            <Link to={section.button_link || '#'} className="sr-btn sr-btn--primary">
              {section.button_text} <span aria-hidden>›</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/** Product Promotion Card — split layout, image left or right */
function ProductPromoCard({ section }) {
  const img = section.image_url || section.product_image;
  return (
    <div className="sr-promo">
      <div className="sr-promo__content">
        {section.badge_text && (
          <span className="sr-eyebrow-badge">{section.badge_text}</span>
        )}
        {section.subtitle && (
          <span className="sr-promo__eyebrow">{section.subtitle}</span>
        )}
        <h2 className="sr-promo__title">{section.title}</h2>
        {section.product_price && (
          <p className="sr-promo__price">
            From ${Number(section.product_price).toLocaleString()}
          </p>
        )}
        <div className="sr-promo__actions">
          {section.button_text && (
            <Link to={section.button_link || '#'} className="sr-btn sr-btn--primary">
              {section.button_text} <span aria-hidden>›</span>
            </Link>
          )}
        </div>
      </div>
      {img && (
        <div className="sr-promo__media">
          <img src={img} alt={section.title} loading="lazy" onError={e=>e.target.src=placeholder} />
        </div>
      )}
    </div>
  );
}

/** Product Grid — multi-product curated group showcase OR single dark card */
function ProductGrid({ section }) {
  const assigned = section.assigned_products;

  // Multi-product Curated Group Showcase
  if (Array.isArray(assigned) && assigned.length > 0) {
    return (
      <div className="sr-multigrid-wrapper">
        <div className="sr-multigrid-header">
          {section.badge_text && (
            <span className="sr-eyebrow-badge">{section.badge_text}</span>
          )}
          <h2 className="sr-multigrid-title">{section.title}</h2>
          {section.subtitle && (
            <p className="sr-multigrid-subtitle">{section.subtitle}</p>
          )}
        </div>
        <div className="sr-multigrid-items">
          {assigned.map((prod) => (
            <div key={prod.id} className="sr-multigrid-card">
              <span className="sr-multigrid-card__badge">
                {prod.badge_text || ''}
              </span>
              <div className="sr-multigrid-card__thumb">
                {prod.image_url ? (
                  <img src={prod.image_url} alt={prod.title} loading="lazy" onError={e=>e.target.src=placeholder} />
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>No image</span>
                )}
              </div>
              <h3 className="sr-multigrid-card__title">{prod.title}</h3>
              {prod.description && (
                <p className="sr-multigrid-card__desc">{prod.description}</p>
              )}
              {prod.price_upfront && (
                <p className="sr-multigrid-card__price">
                  From ${Number(prod.price_upfront).toLocaleString()}
                </p>
              )}
              <div className="sr-multigrid-card__actions">
                <Link to={`/product/${prod.id}`} className="sr-btn sr-btn--primary">
                  Buy <span aria-hidden>›</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Single-product fallback
  const img = section.image_url || section.product_image;
  return (
    <div className="sr-grid-card">
      <div className="sr-grid-card__content">
        {section.badge_text && (
          <span className="sr-eyebrow-badge">{section.badge_text}</span>
        )}
        <h2 className="sr-grid-card__title">{section.title}</h2>
        {section.subtitle && (
          <p className="sr-grid-card__subtitle">{section.subtitle}</p>
        )}
        {section.product_price && (
          <p className="sr-grid-card__price">
            From ${Number(section.product_price).toLocaleString()}
          </p>
        )}
        <div className="sr-grid-card__actions">
          {section.button_text && (
            <Link to={section.button_link || '#'} className="sr-btn sr-btn--light">
              {section.button_text} <span aria-hidden>›</span>
            </Link>
          )}
        </div>
      </div>
      {img && (
        <div className="sr-grid-card__media">
          <img src={img} alt={section.title} loading="lazy" onError={e=>e.target.src=placeholder} />
        </div>
      )}
    </div>
  );
}

/** Feature Section — centered headline, full-width image below */
function FeatureSection({ section }) {
  const img = section.image_url || section.product_image;
  return (
    <div className="sr-feature">
      <div className="sr-feature__header">
        {section.badge_text && (
          <span className="sr-eyebrow-badge">{section.badge_text}</span>
        )}
        <h2 className="sr-feature__title">{section.title}</h2>
        {section.subtitle && (
          <p className="sr-feature__subtitle">{section.subtitle}</p>
        )}
        <div className="sr-feature__actions">
          {section.button_text && (
            <Link to={section.button_link || '#'} className="sr-btn sr-btn--primary">
              {section.button_text} <span aria-hidden>›</span>
            </Link>
          )}
        </div>
      </div>
      {img && (
        <div className="sr-feature__media">
          <img src={img} alt={section.title} loading="lazy" />
        </div>
      )}
    </div>
  );
}

/** Benefits Section — icon/image + title + description, card style */
function BenefitsSection({ section }) {
  const img = section.image_url || section.product_image;
  return (
    <div className="sr-benefit">
      {img && (
        <div className="sr-benefit__media">
          <img src={img} alt={section.title} loading="lazy" onError={e=>e.target.src=placeholder} />
        </div>
      )}
      <div className="sr-benefit__content">
        {section.badge_text && (
          <span className="sr-eyebrow-badge">{section.badge_text}</span>
        )}
        {section.subtitle && (
          <span className="sr-benefit__eyebrow">{section.subtitle}</span>
        )}
        <h3 className="sr-benefit__title">{section.title}</h3>
        {section.button_text && (
          <Link to={section.button_link || '#'} className="sr-btn sr-btn--link">
            {section.button_text} <span aria-hidden>›</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/** Image & Text — horizontal two-column layout */
function ImageText({ section }) {
  const img = section.image_url || section.product_image;
  return (
    <div className="sr-imgtext">
      {img && (
        <div className="sr-imgtext__media">
          <img src={img} alt={section.title} loading="lazy" />
        </div>
      )}
      <div className="sr-imgtext__content">
        {section.badge_text && (
          <span className="sr-eyebrow-badge">{section.badge_text}</span>
        )}
        <h2 className="sr-imgtext__title">{section.title}</h2>
        {section.subtitle && (
          <p className="sr-imgtext__subtitle">{section.subtitle}</p>
        )}
        {section.product_price && (
          <p className="sr-imgtext__price">
            From ${Number(section.product_price).toLocaleString()}
          </p>
        )}
        <div className="sr-imgtext__actions">
          {section.button_text && (
            <Link to={section.button_link || '#'} className="sr-btn sr-btn--primary">
              {section.button_text} <span aria-hidden>›</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/** Comparison Section — light card, compare framing */
function ComparisonSection({ section }) {
  const img = section.image_url || section.product_image;
  return (
    <div className="sr-compare">
      <div className="sr-compare__content">
        {section.badge_text && (
          <span className="sr-eyebrow-badge">{section.badge_text}</span>
        )}
        <h2 className="sr-compare__title">{section.title}</h2>
        {section.subtitle && (
          <p className="sr-compare__subtitle">{section.subtitle}</p>
        )}
        <div className="sr-compare__actions">
          {section.button_text && (
            <Link to={section.button_link || '#'} className="sr-btn sr-btn--outline">
              {section.button_text} <span aria-hidden>›</span>
            </Link>
          )}
        </div>
      </div>
      {img && (
        <div className="sr-compare__media">
          <img src={img} alt={section.title} loading="lazy" />
        </div>
      )}
    </div>
  );
}

/** Promotional Banner — accent gradient background, CTA */
function PromoBanner({ section }) {
  const img = section.image_url || section.product_image;
  return (
    <div className="sr-promobanner">
      <div className="sr-promobanner__content">
        {section.badge_text && (
          <span className="sr-eyebrow-badge">{section.badge_text}</span>
        )}
        <h2 className="sr-promobanner__title">{section.title}</h2>
        {section.subtitle && (
          <p className="sr-promobanner__subtitle">{section.subtitle}</p>
        )}
        <div className="sr-promobanner__actions">
          {section.button_text && (
            <Link to={section.button_link || '#'} className="sr-btn sr-btn--white">
              {section.button_text} <span aria-hidden>›</span>
            </Link>
          )}
        </div>
      </div>
      {img && (
        <div className="sr-promobanner__media">
          <img src={img} alt={section.title} loading="lazy" />
        </div>
      )}
    </div>
  );
}

/** Custom Content — flexible fallback */
function CustomContent({ section }) {
  const img = section.image_url || section.product_image;
  return (
    <div className="sr-custom">
      <div className="sr-custom__content">
        {section.badge_text && (
          <span className="sr-eyebrow-badge">{section.badge_text}</span>
        )}
        <h2 className="sr-custom__title">{section.title}</h2>
        {section.subtitle && (
          <p className="sr-custom__subtitle">{section.subtitle}</p>
        )}
        {section.button_text && (
          <Link to={section.button_link || '#'} className="sr-btn sr-btn--primary">
            {section.button_text} <span aria-hidden>›</span>
          </Link>
        )}
      </div>
      {img && (
        <div className="sr-custom__media">
          <img src={img} alt={section.title} loading="lazy" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Layout Registry
// ─────────────────────────────────────────────
const LAYOUT_REGISTRY = {
  hero:              HeroBanner,
  product_promotion: ProductPromoCard,
  product_grid:      ProductGrid,
  feature:           FeatureSection,
  benefits:          BenefitsSection,
  image_text:        ImageText,
  comparison:        ComparisonSection,
  promo_banner:      PromoBanner,
  custom:            CustomContent,
};

function renderSection(section) {
  const type = (section.layout_type || 'hero').toLowerCase();
  const theme = (section.background_theme || 'default').toLowerCase();
  const Component = LAYOUT_REGISTRY[type] || CustomContent;

  return (
    <article
      key={section.id}
      className={`sr-section sr-section--${type} sr-theme--${theme}`}
      data-category={section.category || section.target_page}
      data-id={section.id}
    >
      <Component section={section} />
    </article>
  );
}

// ─────────────────────────────────────────────
// Main SectionRenderer Component
// ─────────────────────────────────────────────
export default function SectionRenderer({ category }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(
      `${API_BASE}/website-sections?category=${encodeURIComponent(category)}&page=${encodeURIComponent(category)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          setSections([]);
          return;
        }

        // Filter using shared category matching rules
        const filtered = data.filter((sec) => {
          if (sec.status !== 'Published') return false;
          return categoryMatches(sec, category);
        });

        // Sort by display_order ascending
        filtered.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
        setSections(filtered);
      })
      .catch((err) => {
        console.error(`SectionRenderer: failed to load sections for "${category}":`, err);
        setSections([]);
      })
      .finally(() => setLoading(false));
  }, [category]);

  // Render nothing while loading or when empty
  if (loading || sections.length === 0) return null;

  return (
    <div className="sr-wrapper" data-page-category={category}>
      {sections.map(renderSection)}
    </div>
  );
}
