import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import AppleRibbon     from '../components/home-new/AppleRibbon';
import AppleHeroSection from '../components/home-new/AppleHeroSection';
import ApplePromoGrid  from '../components/home-new/ApplePromoGrid';
import AppleTvStream   from '../components/home-new/AppleTvStream';
import './HomeNew.css';

// Local fallback assets (shown when DB is empty / unreachable)
import iphoneProImg  from '../assets/iphone1.png';
import iphone16Img   from '../assets/iphone2.png';
import watch10Img    from '../assets/watch1.jpg';

const API_BASE = 'http://localhost:5000/api';

/**
 * HomeNew – dynamic Apple.com–style home page.
 *
 * Sections are fetched from the database via /api/website-sections?page=home-new.
 * Each section has a `layout_type` that determines which component renders it:
 *   "ribbon"       → AppleRibbon  (announcement banner)
 *   "hero"         → AppleHeroSection (full-width product showcases)
 *   "product_grid" → ApplePromoGrid (2-column promo cards)
 *   "promo_banner" / "video_banner" → AppleTvStream (TV+ showcase)
 *
 * Falls back to curated Apple.com–matching default sections if DB is empty.
 */
export default function HomeNew() {
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    document.title = 'Apple';
  }, []);

  // Fetch published sections for the home-new page
  useEffect(() => {
    let alive = true;

    async function loadSections() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/website-sections?page=home-new`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive && Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => (Number(a.display_order) || 0) - (Number(b.display_order) || 0));
          setSections(sorted);
        }
      } catch (err) {
        console.warn('[HomeNew] Could not load sections from DB:', err.message);
      } finally {
        if (alive) setLoading(false);
      }
    }

    async function loadProducts() {
      try {
        const res = await fetch(`${API_BASE}/products?status=all`);
        if (res.ok) {
          const prodData = await res.json();
          if (alive && Array.isArray(prodData)) {
            setProducts(prodData);
          }
        }
      } catch (err) {
        console.warn('[HomeNew] Could not load products from DB:', err.message);
      }
    }

    loadSections();
    loadProducts();
    return () => { alive = false; };
  }, []);

  // ─── Default (fallback) sections matching Apple.com home ────────────────────
  const defaultSections = [
    {
      id: 'default-hero-1',
      title: 'iPhone 16 Pro',
      subtitle: 'Hello, Apple Intelligence.',
      description: 'Built for Apple Intelligence. Titanium. Camera Control. 48MP Fusion camera.',
      badge_text: 'Pro Performance',
      image_url: iphoneProImg,
      button_text: 'Learn more',
      button_link: '/iphone',
      secondary_button_text: 'Buy',
      secondary_button_link: '/store',
      layout_type: 'hero',
      background_theme: 'dark',
      background_color: '#000000',
      display_order: 1,
    },
    {
      id: 'default-hero-2',
      title: 'iPhone 16',
      subtitle: 'Hello, Apple Intelligence.',
      description: 'Camera Control. 48MP Fusion camera. Five vibrant colors. A18 chip.',
      image_url: iphone16Img,
      button_text: 'Learn more',
      button_link: '/iphone',
      secondary_button_text: 'Buy',
      secondary_button_link: '/store',
      layout_type: 'hero',
      background_theme: 'light',
      background_color: '#f5f5f7',
      display_order: 2,
    },
    {
      id: 'default-hero-3',
      title: 'Watch Series 10',
      subtitle: 'Thinscredible.',
      description: 'Our thinnest watch ever. Biggest display. Advanced sleep apnea detection.',
      image_url: watch10Img,
      button_text: 'Learn more',
      button_link: '/watch',
      secondary_button_text: 'Buy',
      secondary_button_link: '/store',
      layout_type: 'hero',
      background_theme: 'white',
      background_color: '#ffffff',
      display_order: 3,
    },
    {
      id: 'default-promo-grid',
      title: 'Latest Innovations & Apple Services',
      layout_type: 'product_grid',
      display_order: 4,
    },
    {
      id: 'default-tv',
      title: 'Stream now on Apple TV+',
      subtitle: 'Award-winning Apple Originals. Watch in the Apple TV app.',
      button_link: '/entertainment',
      layout_type: 'promo_banner',
      display_order: 5,
    },
  ];

  // Use DB sections if available, otherwise fall back
  const activeSections = sections.length > 0 ? sections : defaultSections;

  // Enrich product_grid sections with full product objects based on assigned_product_ids
  const enrichedSections = activeSections.map(sec => {
    if (sec.layout_type === 'product_grid' && Array.isArray(sec.assigned_product_ids) && sec.assigned_product_ids.length > 0 && products.length > 0) {
      const assigned = sec.assigned_product_ids.map(id => products.find(p => p.id === id) || null).filter(Boolean);
      return { ...sec, assigned_products: assigned };
    }
    return sec;
  });

  // ─── Separate sections by layout_type ───────────────────────────────────────
  const ribbonSection = enrichedSections.find(s => s.layout_type === 'ribbon');
  const heroSections  = enrichedSections.filter(s => s.layout_type === 'hero');
  const gridSection   = enrichedSections.find(s => s.layout_type === 'product_grid');
  const tvSection     = enrichedSections.find(
    s => s.layout_type === 'promo_banner' || s.layout_type === 'video_banner'
  );

  return (
    <main className="apple-home-new" id="main-content">
      {/* 1. Announcement ribbon — driven by DB or default */}
      <AppleRibbon
        message={ribbonSection?.description || ribbonSection?.title ||
          'Get $180–$650 in credit when you trade in iPhone 11 or higher.'}
        linkText={ribbonSection?.button_text || 'Shop iPhone'}
        linkUrl={ribbonSection?.button_link  || '/iphone'}
      />

      {/* Loading state */}
      {loading && sections.length === 0 ? (
        <div className="apple-home-loading">
          <div className="apple-home-spinner" role="status" aria-label="Loading" />
          <p>Loading…</p>
        </div>
      ) : (
        <>
          {/* 2. Hero sections (iPhone Pro, iPhone, Watch, etc.) */}
          {heroSections.map((sec, index) => (
            <AppleHeroSection
              key={sec.id || `hero-${index}`}
              section={sec}
              isFirst={index === 0}
            />
          ))}

          {/* 3. 2-column product promo grid */}
          <ApplePromoGrid section={gridSection} />

          {/* 4. Apple TV+ carousel */}
          <AppleTvStream section={tvSection} />
        </>
      )}
      <Footer />
    </main>
  );
}
