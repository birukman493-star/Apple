import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AppleHeroSection – Faithfully matches apple.com hero card layout:
 *   • Centered text block at top (eyebrow → headline → subhead → description → CTAs)
 *   • Large product image or video filling the bottom portion of the section
 *   • Section data driven dynamically from CMS / database via `section` prop
 */
export default function AppleHeroSection({ section, isFirst = false }) {
  if (!section) return null;

  const {
    title,
    subtitle,
    description,
    badge_text,
    image_url,
    video_url,
    button_text,
    button_link,
    secondary_button_text,
    secondary_button_link,
    background_theme = 'light',
    background_color,
    product_price,
    product_image,
  } = section;

  // Determine theme class
  const isDark =
    background_theme === 'dark' ||
    background_color === '#000000' ||
    background_color === '#000';

  const isWhite = background_theme === 'white' || background_color === '#ffffff' || background_color === '#fff';

  const themeClass = isDark
    ? 'apple-hero--dark'
    : isWhite
    ? 'apple-hero--white'
    : 'apple-hero--light';

  // Inline style for custom background colors
  const containerStyle = {};
  if (background_color && !isDark && !isWhite) {
    containerStyle.backgroundColor = background_color;
  }

  // Media source — prefer image_url, fallback to product_image field
  const mediaSrc = image_url || product_image;

  // Choose secondary button variant based on theme
  const secondaryClass = isDark ? 'apple-btn--secondary-dark' : 'apple-btn--secondary-light';

  return (
    <section
      className={`apple-hero ${themeClass}`}
      style={containerStyle}
      aria-label={title || 'Product Showcase'}
    >
      {/* ── Text header at top ──────────────────────────── */}
      <div className="apple-hero-header">
        {/* Eyebrow / badge */}
        {badge_text && (
          <span className="apple-hero-eyebrow">{badge_text}</span>
        )}

        {/* Main headline */}
        {title && (
          <h2 className="apple-hero-headline">{title}</h2>
        )}

        {/* Subheadline */}
        {subtitle && (
          <p className="apple-hero-subhead">{subtitle}</p>
        )}

        {/* Description */}
        {description && (
          <p className="apple-hero-description">{description}</p>
        )}

        {/* Optional price line */}
        {product_price && (
          <p className="apple-hero-pricing">
            From ${Number(product_price).toLocaleString()} or{' '}
            ${(Number(product_price) / 24).toFixed(2)}/mo. for 24 mo.
            <sup>*</sup>
          </p>
        )}

        {/* CTA buttons */}
        <div className="apple-hero-actions">
          {button_text && (
            <Link
              to={button_link || '#'}
              className="apple-btn apple-btn--primary"
            >
              {button_text}
            </Link>
          )}
          {secondary_button_text && (
            <Link
              to={secondary_button_link || '#'}
              className={`apple-btn ${secondaryClass}`}
            >
              {secondary_button_text}
            </Link>
          )}
        </div>
      </div>

      {/* ── Product media fills the bottom ──────────────── */}
      <div className="apple-hero-media">
        {video_url ? (
          <video
            className="apple-hero-video"
            autoPlay
            muted
            loop
            playsInline
            src={video_url}
            aria-label={title || 'Product video'}
          />
        ) : mediaSrc ? (
          <img
            src={mediaSrc}
            alt={title || 'Product'}
            className="apple-hero-image"
            loading={isFirst ? 'eager' : 'lazy'}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
