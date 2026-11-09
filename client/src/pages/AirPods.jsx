import React, { useEffect, useState } from "react";
import "./AirPods.css";
import SectionRenderer from "../components/SectionRenderer";

import airpods4Basic from "../assets/airpods_4.jpg";
import airpods4Anc from "../assets/airpods_4_anc.jpg";
import airpodsPro from "../assets/airpods_pro.jpg";
import airpodsMax from "../assets/airpods_max.jpg";

// Local image map: prioritized to ensure crisp, working Apple studio imagery
const localAirPodsImages = {
  "active noise": airpods4Anc,
  "airpods 4 with": airpods4Anc,
  "airpods 4": airpods4Basic,
  "airpods pro": airpodsPro,
  "airpods max": airpodsMax,
};

const getCompareImage = (card) => {
  const name = (card.product_name || "").toLowerCase();
  for (const [key, img] of Object.entries(localAirPodsImages)) {
    if (name.includes(key)) return img;
  }
  return card.image_url || airpods4Basic;
};

const getAirPodsIcon = (icon) => {
  switch (icon) {
    case "airpods":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h1v5a1 1 0 1 0 2 0V6a3 3 0 0 0-3-3H7zm10 0a3 3 0 0 0-3 3v12a1 1 0 1 0 2 0v-5h1a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3h-1z" />
        </svg>
      );
    case "airpods-pro":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h1v5a1 1 0 1 0 2 0V7a3 3 0 0 0-3-3H6zm12 0a3 3 0 0 0-3 3v10a1 1 0 1 0 2 0v-5h1a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-1z" />
        </svg>
      );
    case "airpods-max":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 18v-4a9 9 0 0 1 18 0v4M3 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zm18 0h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"
          />
        </svg>
      );
    case "compare":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="7" height="16" rx="2" />
          <rect x="14" y="4" width="7" height="16" rx="2" strokeDasharray="3 3" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

const getServiceIcon = (iconType) => {
  switch (iconType) {
    case "delivery":
      return (
        <svg className="airpods-service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "payment":
      return (
        <svg className="airpods-service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12M9.5 9.5c0-1.4 1.1-2.5 2.5-2.5h1c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5h-2c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5h1c1.4 0 2.5-1.1 2.5-2.5" />
        </svg>
      );
    case "chat":
      return (
        <svg className="airpods-service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "engrave":
      return (
        <svg className="airpods-service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      );
    default:
      return (
        <svg className="airpods-service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

const NoiseCancellationIcon = () => (
  <svg className="airpods-feature-icon airpods-noise-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" fill="currentColor" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
  </svg>
);

const AudioModesIcon = () => (
  <svg className="airpods-feature-icon airpods-audio-icon" viewBox="0 0 36 24" fill="currentColor">
    <g transform="translate(0, 2)">
      <circle cx="6" cy="10" r="3" />
      <path d="M2 18c0-2.2 1.8-4 4-4s4 1.8 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 3l1 1M8 3l-1 1" stroke="currentColor" strokeWidth="1.5" />
    </g>
    <g transform="translate(12, 2)">
      <circle cx="6" cy="10" r="3" />
      <path d="M2 18c0-2.2 1.8-4 4-4s4 1.8 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 1v2M2 4l1.5 1.5M10 4L8.5 5.5" stroke="currentColor" strokeWidth="1.5" />
    </g>
    <g transform="translate(24, 2)">
      <circle cx="6" cy="10" r="3" />
      <path d="M2 18c0-2.2 1.8-4 4-4s4 1.8 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M0 10a6 6 0 0 1 2-4M12 10a6 6 0 0 0-2-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </g>
  </svg>
);

const HeartRateIcon = () => (
  <svg className="airpods-feature-icon airpods-heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const EarIcon = () => (
  <svg className="airpods-feature-icon airpods-ear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-3 8.5-4 10.5M11 12a2 2 0 1 0 2 2" />
    <path d="M4 17c1.5 1 3 1.5 5 1.5" />
  </svg>
);

const LiveTranslationIcon = () => (
  <div className="airpods-translation-icon">
    <div className="airpods-translation-a">A</div>
    <div className="airpods-translation-chinese">文</div>
  </div>
);

const TouchControlIcon = () => (
  <svg className="airpods-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-4 0v5" />
    <path d="M14 10V4a2 2 0 0 0-4 0v6" />
    <path d="M10 10.5V2a2 2 0 0 0-4 0v9" />
    <path d="M18 11a2 2 0 0 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.8-6-2.5L3 16.5" />
  </svg>
);

const DigitalCrownIcon = () => (
  <svg className="airpods-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="8" width="14" height="8" rx="4" />
    <path d="M8 8v8M12 8v8M16 8v8" />
    <path d="M10 5a8 8 0 0 1 4 0M10 19a8 8 0 0 0 4 0" />
  </svg>
);

export default function AirPads() {
  const [airPodsNavItems, setAirPodsNavItems] = useState([]);
  const [compareCards, setCompareCards] = useState([]);
  const [featureComparison, setFeatureComparison] = useState([]);
  const [bottomComparison, setBottomComparison] = useState([]);
  const [knowCards, setKnowCards] = useState([]);
  const [services, setServices] = useState([]);
  const [promos, setPromos] = useState([]);

  const BASE = "http://localhost:5000";

  useEffect(() => {
    const endpoints = [
      { url: `${BASE}/api/airpods-nav`, setter: setAirPodsNavItems },
      { url: `${BASE}/api/airpods-compare-cards`, setter: setCompareCards },
      { url: `${BASE}/api/airpods-feature-comparison`, setter: setFeatureComparison },
      { url: `${BASE}/api/airpods-bottom-comparison`, setter: setBottomComparison },
      { url: `${BASE}/api/airpods-know-cards`, setter: setKnowCards },
      { url: `${BASE}/api/airpods-services`, setter: setServices },
      { url: `${BASE}/api/airpods-promos`, setter: setPromos },
    ];

    endpoints.forEach(({ url, setter }) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => setter(Array.isArray(data) ? data : []))
        .catch((err) => console.error(`Failed to load ${url}:`, err));
    });
  }, []);

  return (
    <>
      {/* =========================================
          DYNAMIC AIRPODS NAVIGATION
      ========================================= */}
      <section className="airpods-product-nav">
        <div className="airpods-product-nav-inner">
          {airPodsNavItems.map((item) => (
            <a
              key={item.id}
              href={item.href || "#"}
              className="airpods-product-nav-item"
            >
              <div className="airpods-product-nav-icon">
                {getAirPodsIcon(item.icon)}
              </div>
              <span className="airpods-product-nav-name">{item.name}</span>
              {Boolean(item.is_new) && (
                <span className="airpods-product-nav-new">New</span>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* =========================================
          COMPARE AIRPODS MODELS (Dynamic)
      ========================================= */}
      <section className="airpods-compare-section">
        <div className="airpods-compare-container">
          <h2 className="airpods-compare-title">Compare AirPods models</h2>
          <div className="airpods-compare-grid">
            {compareCards.map((card) => (
              <div key={card.id} className="airpods-compare-card">
                <div className="airpods-compare-image-wrapper">
                  <img
                    src={getCompareImage(card)}
                    alt={card.product_name}
                    className="airpods-compare-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = airpods4Basic;
                    }}
                  />
                </div>
                {card.badge_text && (
                  <div className="airpods-compare-badge">{card.badge_text}</div>
                )}
                <h3 className="airpods-compare-product-name">
                  {card.product_name}
                </h3>
                {card.subtitle && (
                  <h4 className="airpods-compare-subtitle">{card.subtitle}</h4>
                )}
                {card.description && (
                  <p className="airpods-compare-description">{card.description}</p>
                )}
                {card.price && (
                  <div className="airpods-compare-price">
                    ${Number(card.price).toFixed(0)}
                  </div>
                )}
                <a href={card.buy_link || "#"} className="airpods-compare-buy">
                  Buy
                </a>
                <a href={card.learn_more_link || "#"} className="airpods-compare-learn">
                  Learn more <span>›</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          FEATURE COMPARISON (Dynamic)
      ========================================= */}
      <section className="airpods-feature-comparison">
        <div className="airpods-feature-comparison-container">
          <div className="airpods-feature-grid">
            {featureComparison.map((col) => (
              <div key={col.id} className="airpods-feature-column">
                {/* Active Noise Cancellation */}
                <div className="airpods-feature-row airpods-anc-row">
                  <NoiseCancellationIcon />
                  <p>{col.anc_text}</p>
                </div>

                {/* Audio Modes */}
                <div className="airpods-feature-row airpods-audio-row">
                  <AudioModesIcon />
                  <p>
                    Adaptive Audio,<sup>ΔΔΔ</sup>
                    <br />
                    Transparency, and Personalized Spatial Audio with dynamic
                    head tracking<sup>ΔΔΔΔ</sup>
                  </p>
                </div>

                {/* Heart Rate */}
                <div className="airpods-feature-row airpods-heart-row">
                  {Boolean(col.has_heart_rate) ? (
                    <>
                      <HeartRateIcon />
                      <p>
                        Heart rate sensing during workouts<sup>◊◊</sup>
                      </p>
                    </>
                  ) : (
                    <span className="airpods-feature-empty">—</span>
                  )}
                </div>

                {/* Ear Icon */}
                <div className="airpods-feature-bottom">
                  {Boolean(col.has_ear_icon) ? <EarIcon /> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          BOTTOM COMPARISON (Dynamic)
      ========================================= */}
      <section className="airpods-bottom-comparison">
        <div className="airpods-bottom-comparison-container">
          <div className="airpods-bottom-comparison-grid">
            {bottomComparison.map((col) => (
              <div key={col.id} className="airpods-bottom-comparison-column">
                {/* Live Translation & Siri */}
                <div className="airpods-translation-feature">
                  <LiveTranslationIcon />
                  <p>{col.translation_text}</p>
                </div>

                {/* Controls */}
                <div className="airpods-control-feature">
                  {col.control_icon === "touch" ? (
                    <TouchControlIcon />
                  ) : (
                    <DigitalCrownIcon />
                  )}
                  <p>{col.control_text}</p>
                </div>

                {/* Battery Life */}
                <div className="airpods-battery-feature">
                  <span className="airpods-battery-hours">
                    {col.battery_hours}
                  </span>
                  <p>{col.battery_text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Link */}
          <div className="airpods-bottom-comparison-link">
            <a href="#">
              Compare all AirPods models<span>›</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================
          GET TO KNOW AIRPODS (Dynamic)
      ========================================= */}
      <section className="airpods-know-section">
        <div className="airpods-know-title-container">
          <h2>Get to know AirPods.</h2>
        </div>

        <div className="airpods-know-scroll">
          {knowCards.map((card) => (
            <div key={card.id} className="airpods-know-card">
              <div className="airpods-know-card-header">
                <p className="airpods-know-category">{card.category_label}</p>
                <h3>{card.title}</h3>
                {card.description && (
                  <p className="airpods-know-description">{card.description}</p>
                )}
              </div>

              <div className="airpods-know-visual">
                {card.card_type === "anc" && (
                  <div className="airpods-anc-visual">
                    <div className="airpods-anc-ring airpods-anc-ring-1"></div>
                    <div className="airpods-anc-ring airpods-anc-ring-2"></div>
                    <div className="airpods-anc-earbud">
                      <div className="airpods-anc-earbud-tip"></div>
                    </div>
                  </div>
                )}

                {card.card_type === "translation" && (
                  <div className="airpods-translation-visual">
                    <div className="airpods-language-box airpods-language-a">
                      A
                    </div>
                    <div className="airpods-language-box airpods-language-chinese">
                      文
                    </div>
                  </div>
                )}

                {card.card_type === "heart" && (
                  <div className="airpods-heart-visual">
                    <div className="airpods-heart-earbud"></div>
                    <div className="airpods-watch">
                      <div className="airpods-watch-time">9:41</div>
                      <div className="airpods-heart-rate">
                        144 <span>♥</span>
                      </div>
                      <div className="airpods-calories">
                        <div>
                          <strong>122</strong>
                          <small>ACTIVE CAL</small>
                        </div>
                        <div>
                          <strong>146</strong>
                          <small>TOTAL CAL</small>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {card.card_type === "spatial" && (
                  <div className="airpods-spatial-visual">
                    <div className="airpods-spatial-ring">
                      <span>◉</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          PROMOS + SERVICES (Dynamic)
      ========================================= */}
      <section className="airpods-promos-services">
        {/* Top Promos */}
        {promos.map((promo) => (
          <div key={promo.id} className="airpods-promo-container">
            <div className="airpods-promo-content">
              <div className="airpods-promo-text">
                <h2>{promo.title}</h2>
                <a href={promo.link_url || "#"}>
                  {promo.link_text || "Learn more"}
                  <span>›</span>
                </a>
              </div>
              {promo.image_url && (
                <div className="airpods-promo-image">
                  <img src={promo.image_url} alt="AirPods promo" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Services */}
        <div className="airpods-services">
          <div className="airpods-services-container">
            {services.map((service) => (
              <div key={service.id} className="airpods-service-item">
                {getServiceIcon(service.icon_type)}
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                {service.link_text && service.link_url && (
                  <a href={service.link_url}>
                    {service.link_text}
                    <span>›</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionRenderer category="AirPods" />
    </>
  );
}