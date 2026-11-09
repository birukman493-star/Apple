import React from 'react';
import { Link } from 'react-router-dom';

// Local fallback assets (used when DB images are not available)
import macbookAirImg   from '../../assets/images (8).jpg';
import ipadProImg      from '../../assets/images (11).jpg';
import watchUltraImg   from '../../assets/watch2.jpg';
import airpodsImg      from '../../assets/airpads2.jpg';
import tradeInImg      from '../../assets/TradeIn.jpg';
import cardImg         from '../../assets/Card.jpg';

/**
 * ApplePromoGrid – 2-column product promo cards matching Apple.com home grid.
 *
 * Layout per card (matches Apple.com exactly):
 *   • Eyebrow label at top
 *   • Large product title
 *   • Subtitle line
 *   • Optional description & price
 *   • CTA buttons (Learn more | Buy)
 *   • Product image fills the bottom of the card
 *
 * Data is driven from `section.assigned_products` from the DB.
 * Falls back to curated default items if no DB products are configured.
 */

const FALLBACK_IMAGES = [macbookAirImg, ipadProImg, watchUltraImg, airpodsImg, tradeInImg, cardImg];

const defaultItems = [
  {
    id: 'macbook-air',
    eyebrow: 'Supercharged by M3',
    title: 'MacBook Air',
    subtitle: 'Lean. Mean. M3 machine.',
    desc: null,
    image: macbookAirImg,
    link: '/mac',
    buyLink: '/store',
    theme: 'light',
  },
  {
    id: 'ipad-pro',
    eyebrow: 'Ultra Retina XDR',
    title: 'iPad Pro',
    subtitle: 'Thinpossible.',
    desc: null,
    image: ipadProImg,
    link: '/ipad',
    buyLink: '/store',
    theme: 'dark',
  },
  {
    id: 'watch-ultra',
    eyebrow: 'Tough & Capable',
    title: 'Apple Watch Ultra 2',
    subtitle: 'New finish. Never quit.',
    desc: null,
    image: watchUltraImg,
    link: '/watch',
    buyLink: '/store',
    theme: 'dark',
  },
  {
    id: 'airpods-4',
    eyebrow: 'Active Noise Cancellation',
    title: 'AirPods 4',
    subtitle: 'Iconic. Now supersonic.',
    desc: null,
    image: airpodsImg,
    link: '/airpods',
    buyLink: '/store',
    theme: 'light',
  },
  {
    id: 'trade-in',
    eyebrow: 'Apple Trade In',
    title: 'Trade In',
    subtitle: 'Get $180–$650 in credit when you trade in iPhone 11 or higher.',
    desc: null,
    image: tradeInImg,
    link: '/store',
    buyLink: '/store',
    theme: 'light',
  },
  {
    id: 'apple-card',
    eyebrow: 'Apple Card',
    title: 'Card',
    subtitle: 'Get up to 3% Daily Cash back with every purchase.',
    desc: null,
    image: cardImg,
    link: '/store',
    buyLink: '/store',
    theme: 'light',
  },
];

export default function ApplePromoGrid({ section }) {
  // Use DB-assigned products if available
  const assigned = section?.assigned_products;

  let displayItems = defaultItems;

  if (Array.isArray(assigned) && assigned.length > 0) {
    displayItems = assigned.map((p, index) => {
      const fallbackImg = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
      const isDark = p.category === 'Watch' || p.category === 'Vision' || index % 3 === 1;
      const categorySlug = p.category
        ? `/${p.category.toLowerCase().replace(/[^a-z0-9]/g, '')}`
        : '/store';

      return {
        id: p.id || `db-item-${index}`,
        eyebrow: p.badge_text || p.category || '',
        title: p.title || p.name || 'Product',
        subtitle: p.subtitle || '',
        desc: p.description || null,
        image: p.image_url || fallbackImg,
        price: p.price_upfront || p.price || null,
        link: categorySlug,
        buyLink: '/store',
        theme: isDark ? 'dark' : 'light',
      };
    });
  }

  return (
    <section className="apple-promo-grid-section" aria-label="Product Showcase Grid">
      <div className="apple-promo-grid">
        {displayItems.map((item, idx) => {
          const secondaryClass =
            item.theme === 'dark'
              ? 'apple-btn--secondary-dark'
              : 'apple-btn--secondary-light';

          return (
            <div
              key={item.id || idx}
              className={`apple-promo-card apple-promo-card--${item.theme || 'light'}`}
            >
              {/* ── Top text header ────────────────────────── */}
              <div className="apple-promo-card-header">
                {item.eyebrow && (
                  <span className="apple-promo-eyebrow">{item.eyebrow}</span>
                )}

                <h3 className="apple-promo-title">{item.title}</h3>

                {item.subtitle && (
                  <p className="apple-promo-subtitle">{item.subtitle}</p>
                )}

                {item.desc && (
                  <p className="apple-promo-desc">{item.desc}</p>
                )}

                {item.price && (
                  <p className="apple-promo-price">
                    From ${Number(item.price).toLocaleString()}
                  </p>
                )}

                {/* CTA buttons */}
                <div className="apple-promo-actions">
                  <Link
                    to={item.link || '#'}
                    className="apple-btn apple-btn--primary"
                  >
                    Learn more
                  </Link>
                  <Link
                    to={item.buyLink || '#'}
                    className={`apple-btn ${secondaryClass}`}
                  >
                    Buy
                  </Link>
                </div>
              </div>

              {/* ── Product image at bottom ─────────────────── */}
              <div className="apple-promo-media">
                <img
                  src={item.image}
                  alt={item.title}
                  className="apple-promo-image"
                  loading="lazy"
                  onError={(e) => {
                    const fb = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                    if (fb && e.currentTarget.src !== fb) {
                      e.currentTarget.src = fb;
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
