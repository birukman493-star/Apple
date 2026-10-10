import React, { useEffect, useState, useRef } from "react";
import "./AirPods.css";

import airpods1 from "../assets/airpads1.jpg";
import airpods2 from "../assets/airpads2.jpg";
import airpods4 from "../assets/airpads4.jpg";
import airpods5 from "../assets/airpads5.jpg";


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
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 18v-4a9 9 0 0 1 18 0v4M3 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zm18 0h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"
          />
        </svg>
      );

    case "compare":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="4" width="7" height="16" rx="2" />
          <rect
            x="14"
            y="4"
            width="7"
            height="16"
            rx="2"
            strokeDasharray="3 3"
          />
        </svg>
      );

    case "accessories":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M12 13v8M9 21h6" strokeLinecap="round" />
        </svg>
      );

    case "apple-music":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

const columnsData = [
  {
    id: 1,
    ancText:
      "Up to 1.5x more Active Noise Cancellation than AirPods 4 with Active Noise Cancellation◊◊◊",
    hasHeartRate: false,
  },
  {
    id: 2,
    ancText:
      "Up to 1.5x more Active Noise Cancellation than AirPods 4 with Active Noise Cancellation◊◊◊",
    hasHeartRate: false,
  },
  {
    id: 3,
    ancText:
      "Up to 3x more Active Noise Cancellation than AirPods 5Δ",
    hasHeartRate: true,
  },
  {
    id: 4,
    ancText:
      "Up to 1.5x more Active Noise Cancellation than original AirPods MaxΔΔ",
    hasHeartRate: false,
  },
];

const airPodsKnowCards = [
  {
    id: 1,
    category: "Active Noise Cancellation",
    title: "Control what you hear. And what you don't.",
    type: "anc",
  },
  {
    id: 2,
    category: "Live Translation",
    title: "Easily communicate across languages.",
    type: "translation",
    description: (
      <>
        Available in select languages and regions. For more information, see{" "}
        <a href="#">Feature Availability</a>.
      </>
    ),
  },
  {
    id: 3,
    category: "Heart Rate Sensing",
    title:
      "Track your heart rate and calories burned during workouts.",
    type: "heart",
  },
  {
    id: 4,
    category: "Personalized Spatial Audio",
    title: "Sound tuned specifically to your ear shape.",
    type: "spatial",
  },
];

const servicesData = [
  {
    id: 1,
    title: "Fast delivery or pickup",
    description: "Or pick up available items at an Apple Store.",
    linkText: "Learn more",
    linkUrl: "#",
    icon: (
      <svg
        className="airpods-service-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Pay monthly at 0% APR",
    description:
      "You can pay over time when you choose to check out at Apple with Apple Card Monthly Installments.⁺",
    linkText: null,
    linkUrl: null,
    icon: (
      <svg
        className="airpods-service-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M9.5 9.5c0-1.4 1.1-2.5 2.5-2.5h1c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5h-2c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5h1c1.4 0 2.5-1.1 2.5-2.5" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Get help buying",
    description: "Have a question? Call a Specialist or chat online.",
    linkText: "Contact us",
    linkUrl: "#",
    icon: (
      <svg
        className="airpods-service-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M14 8a2 2 0 0 1-2 2H9" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Make them yours",
    description:
      "Engrave your AirPods with your initials or favorite emoji — free. Only at Apple.",
    linkText: "Learn more",
    linkUrl: "#",
    icon: (
      <svg
        className="airpods-service-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
];

const subNavItems = [
  {
    id: "apple-tv-4k",
    label: "Apple TV 4K",
    icon: (
      <svg
        className="tvhome-subnav-icon tvhome-tv4k-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <rect x="2" y="7" width="20" height="10" rx="3" />
        <path
          d="M12 9.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
          fill="#f5f5f7"
        />
      </svg>
    ),
  },

  {
    id: "apple-tv-app",
    label: "Apple TV app",
    icon: (
      <svg
        className="tvhome-subnav-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path
          d="M8.5 7.5l2 2.5-2 2.5h1.8l1.2-1.8 1.2 1.8h1.8l-2-2.5 2-2.5h-1.8l-1.2 1.8-1.2-1.8H8.5z"
          fill="#f5f5f7"
        />
      </svg>
    ),
  },

  {
    id: "apple-tv",
    label: "Apple TV+",
    icon: (
      <div className="tvhome-apple-tv-logo">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.57-.69.96-1.66.85-2.63-.83.03-1.85.56-2.44 1.25-.53.61-.99 1.6-.87 2.55.93.07 1.89-.48 2.46-1.17z" />
        </svg>

        <span>tv</span>
      </div>
    ),
  },

  {
    id: "homepod",
    label: "HomePod",
    icon: (
      <svg
        className="tvhome-subnav-icon tvhome-homepod-icon"
        viewBox="0 0 24 30"
        fill="currentColor"
      >
        <rect x="3" y="2" width="18" height="26" rx="9" />
        <ellipse
          cx="12"
          cy="5"
          rx="6"
          ry="1.5"
          fill="#f5f5f7"
          opacity="0.3"
        />
      </svg>
    ),
  },

  {
    id: "homepod-mini",
    label: "HomePod mini",
    icon: (
      <svg
        className="tvhome-subnav-icon tvhome-homepod-mini-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="10" />
        <ellipse
          cx="12"
          cy="4"
          rx="4"
          ry="1"
          fill="#f5f5f7"
          opacity="0.3"
        />
      </svg>
    ),
  },

  {
    id: "home-app",
    label: "Home app",
    icon: (
      <svg
        className="tvhome-subnav-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5z" />
        <path d="M9 21V12a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v9" />
      </svg>
    ),
  },

  {
    id: "accessories",
    label: "Accessories",
    icon: (
      <svg
        className="tvhome-subnav-icon tvhome-accessories-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2a6 6 0 0 0-6 6c0 2.38 1.39 4.43 3.41 5.41.38.18.59.58.59 1v1.59h4v-1.59c0-.42.21-.82.59-1C16.61 12.43 18 10.38 18 8a6 6 0 0 0-6-6z" />
        <rect x="9.5" y="17" width="5" height="1.5" rx="0.5" />
        <rect x="10" y="19.5" width="4" height="1.5" rx="0.5" />
      </svg>
    ),
  },
];
const NoiseCancellationIcon = () => (
  <svg
    className="airpods-feature-icon airpods-noise-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" fill="currentColor" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
  </svg>
);

const AudioModesIcon = () => (
  <svg
    className="airpods-feature-icon airpods-audio-icon"
    viewBox="0 0 36 24"
    fill="currentColor"
  >
    <g transform="translate(0, 2)">
      <circle cx="6" cy="10" r="3" />
      <path
        d="M2 18c0-2.2 1.8-4 4-4s4 1.8 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 3l1 1M8 3l-1 1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>

    <g transform="translate(12, 2)">
      <circle cx="6" cy="10" r="3" />
      <path
        d="M2 18c0-2.2 1.8-4 4-4s4 1.8 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 1v2M2 4l1.5 1.5M10 4L8.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>

    <g transform="translate(24, 2)">
      <circle cx="6" cy="10" r="3" />
      <path
        d="M2 18c0-2.2 1.8-4 4-4s4 1.8 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M0 10a6 6 0 0 1 2-4M12 10a6 6 0 0 0-2-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
  </svg>
);

const HeartRateIcon = () => (
  <svg
    className="airpods-feature-icon airpods-heart-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const EarIcon = () => (
  <svg
    className="airpods-feature-icon airpods-ear-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
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
  <svg
    className="airpods-control-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 11V6a2 2 0 0 0-4 0v5" />
    <path d="M14 10V4a2 2 0 0 0-4 0v6" />
    <path d="M10 10.5V2a2 2 0 0 0-4 0v9" />
    <path d="M18 11a2 2 0 0 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.8-6-2.5L3 16.5" />
    <path d="M12 2v2M8 3l1 1M16 3l-1 1" />
  </svg>
);

const DigitalCrownIcon = () => (
  <svg
    className="airpods-control-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="8" width="14" height="8" rx="4" />
    <path d="M8 8v8M12 8v8M16 8v8" />
    <path d="M10 5a8 8 0 0 1 4 0M10 19a8 8 0 0 0 4 0" />
  </svg>
);
const compareData = [
  {
    id: 1,
    translationText: "Live Translation^^ and Siri AI^^^",
    controlIcon: "touch",
    controlText: "Force sensor to manage playback and calls",
    hours: "4 hrs",
    batteryText:
      "Up to 4 hours of battery life on one charge with Active Noise Cancellation^^^^ and up to 20 hours with the case and ANC enabled^^^^^",
  },
  {
    id: 2,
    translationText: "Live Translation^^ and Siri AI^^^",
    controlIcon: "touch",
    controlText:
      "Force sensor with volume swipe to manage playback and calls",
    hours: "5 hrs",
    batteryText:
      "Up to 5 hours of battery life on one charge with Active Noise Cancellation^^^^^^ and up to 22 hours with the case and ANC enabled^^^^^^^",
  },
  {
    id: 3,
    translationText: "Live Translation^^ and Siri AI^^^",
    controlIcon: "touch",
    controlText:
      "Force sensor with volume swipe to manage playback and calls",
    hours: "8 hrs",
    batteryText:
      "Up to 8 hours of battery life on one charge with Active Noise Cancellation^^^^^^^^, and up to 24 hours with the case and ANC enabled^^^^^^^^^",
  },
  {
    id: 4,
    translationText: "Live Translation^^ and Siri AI^^^",
    controlIcon: "crown",
    controlText: "Digital Crown",
    hours: "20 hrs",
    batteryText:
      "Up to 20 hours of battery life on one charge with Active Noise Cancellation^^^^^^^^^^",
  },
];



export default function AirPads() {
  const [airPodsNavItems, setAirPodsNavItems] = useState([]);
  const [airPodsProducts, setAirPodsProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products?category=airpods")
      .then((res) => res.json())
      .then((data) => {
        setAirPodsProducts(data);
      })
      .catch((error) => {
        console.error("Error loading AirPods products:", error);
      });
  }, []);

  useEffect(() => {
    const fetchAirPodsNavItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/airpods-nav"
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        console.log("AirPods navigation:", data);

        setAirPodsNavItems(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Failed to load AirPods navigation:",
          error
        );
      }
    };

    fetchAirPodsNavItems();
  }, []);

  return (
    <>
      <section className="airpods-product-nav">
        <div className="airpods-product-nav-inner">
          <a href="#" className="airpods-product-nav-item">
            <div className="airpods-product-nav-icon">
              {getAirPodsIcon("airpods")}
            </div>

            <span className="airpods-product-nav-name">
              AirPods
            </span>
          </a>

          <a href="#" className="airpods-product-nav-item">
            <div className="airpods-product-nav-icon">
              {getAirPodsIcon("airpods-pro")}
            </div>

            <span className="airpods-product-nav-name">
              AirPods Pro 3
            </span>

            <span className="airpods-product-nav-new">
              New
            </span>
          </a>

          <a href="#" className="airpods-product-nav-item">
            <div className="airpods-product-nav-icon">
              {getAirPodsIcon("airpods-max")}
            </div>

            <span className="airpods-product-nav-name">
              AirPods Max
            </span>
          </a>

          <a href="#" className="airpods-product-nav-item">
            <div className="airpods-product-nav-icon">
              {getAirPodsIcon("compare")}
            </div>

            <span className="airpods-product-nav-name">
              Compare
            </span>
          </a>
        </div>
      </section>

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

              <span className="airpods-product-nav-name">
                {item.name}
              </span>

              {Boolean(item.is_new) && (
                <span className="airpods-product-nav-new">
                  New
                </span>
              )}
            </a>
          ))}
        </div>
      </section>

      <section className="airpods-compare-section">
        <div className="airpods-compare-container">
          <h2 className="airpods-compare-title">
            Compare AirPods models
          </h2>

          <div className="airpods-compare-grid">

            {/* AirPods 4 */}
            <div className="airpods-compare-card">
              <div className="airpods-compare-image-wrapper">
                <img
                  src={airpods1}
                  alt="AirPods 4"
                  className="airpods-compare-image"
                />
              </div>

              <div className="airpods-compare-badge">
                New
              </div>

              <h3 className="airpods-compare-product-name">
                AirPods 4
              </h3>

              <h4 className="airpods-compare-subtitle">
                The next evolution of sound.
              </h4>

              <p className="airpods-compare-description">
                Personalized Spatial Audio with dynamic head tracking,
                Voice Isolation, and an all-new fit.
              </p>

              <div className="airpods-compare-price">
                $129
              </div>

              <a
                href="#"
                className="airpods-compare-buy"
              >
                Buy
              </a>

              <a
                href="#"
                className="airpods-compare-learn"
              >
                Learn more <span>›</span>
              </a>
            </div>

            {/* AirPods 4 with Active Noise Cancellation */}
            <div className="airpods-compare-card">
              <div className="airpods-compare-image-wrapper">
                <img
                  src={airpods2}
                  alt="AirPods 4 with Active Noise Cancellation"
                  className="airpods-compare-image"
                />
              </div>

              <div className="airpods-compare-badge">
                New
              </div>

              <h3 className="airpods-compare-product-name">
                AirPods 4 with Active Noise Cancellation
              </h3>

              <h4 className="airpods-compare-subtitle">
                Active Noise Cancellation. Made simple.
              </h4>

              <p className="airpods-compare-description">
                Active Noise Cancellation, Transparency mode,
                Adaptive Audio, and Conversation Awareness.
              </p>

              <div className="airpods-compare-price">
                $179
              </div>

              <a
                href="#"
                className="airpods-compare-buy"
              >
                Buy
              </a>

              <a
                href="#"
                className="airpods-compare-learn"
              >
                Learn more <span>›</span>
              </a>
            </div>

            {/* AirPods Pro 3 */}
            <div className="airpods-compare-card">
              <div className="airpods-compare-image-wrapper">
                <img
                  src={airpods4}
                  alt="AirPods Pro 3"
                  className="airpods-compare-image"
                />
              </div>

              <div className="airpods-compare-badge">
                New
              </div>

              <h3 className="airpods-compare-product-name">
                AirPods Pro 3
              </h3>

              <h4 className="airpods-compare-subtitle">
                The ultimate AirPods experience.
              </h4>

              <p className="airpods-compare-description">
                The ultimate wireless headphones experience with
                powerful noise cancellation and immersive sound.
              </p>

              <div className="airpods-compare-price">
                $249
              </div>

              <a
                href="#"
                className="airpods-compare-buy"
              >
                Buy
              </a>

              <a
                href="#"
                className="airpods-compare-learn"
              >
                Learn more <span>›</span>
              </a>
            </div>

            {/* AirPods Max */}
            <div className="airpods-compare-card">
              <div className="airpods-compare-image-wrapper">
                <img
                  src={airpods5}
                  alt="AirPods Max"
                  className="airpods-compare-image"
                />
              </div>

              <div className="airpods-compare-badge">
                New
              </div>

              <h3 className="airpods-compare-product-name">
                AirPods Max
              </h3>

              <h4 className="airpods-compare-subtitle">
                A radically original composition.
              </h4>

              <p className="airpods-compare-description">
                High-fidelity audio, Active Noise Cancellation,
                and personalized Spatial Audio in an over-ear design.
              </p>

              <div className="airpods-compare-price">
                $549
              </div>

              <a
                href="#"
                className="airpods-compare-buy"
              >
                Buy
              </a>

              <a
                href="#"
                className="airpods-compare-learn"
              >
                Learn more <span>›</span>
              </a>
            </div>

          </div>
        </div>
      </section>


      <section className="airpods-feature-comparison">
        <div className="airpods-feature-comparison-container">
          <div className="airpods-feature-grid">
            {columnsData.map((col) => (
              <div
                key={col.id}
                className="airpods-feature-column"
              >
                {/* Active Noise Cancellation */}
                <div className="airpods-feature-row airpods-anc-row">
                  <NoiseCancellationIcon />

                  <p>
                    {col.ancText}
                  </p>
                </div>

                {/* Audio Modes */}
                <div className="airpods-feature-row airpods-audio-row">
                  <AudioModesIcon />

                  <p>
                    Adaptive Audio,
                    <sup>ΔΔΔ</sup>
                    <br />
                    Transparency, and Personalized Spatial Audio
                    with dynamic head tracking
                    <sup>ΔΔΔΔ</sup>
                  </p>
                </div>

                {/* Heart Rate */}
                <div className="airpods-feature-row airpods-heart-row">
                  {col.hasHeartRate ? (
                    <>
                      <HeartRateIcon />

                      <p>
                        Heart rate sensing during workouts
                        <sup>◊◊</sup>
                      </p>
                    </>
                  ) : (
                    <span className="airpods-feature-empty">
                      —
                    </span>
                  )}
                </div>

                {/* Bottom Ear Feature */}
                <div className="airpods-feature-bottom">
                  {col.id === 3 || col.id === 4 ? (
                    <EarIcon />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="airpods-bottom-comparison">
        <div className="airpods-bottom-comparison-container">
          <div className="airpods-bottom-comparison-grid">
            {compareData.map((col) => (
              <div
                key={col.id}
                className="airpods-bottom-comparison-column"
              >
                {/* Live Translation & Siri */}
                <div className="airpods-translation-feature">
                  <LiveTranslationIcon />

                  <p>
                    {col.translationText}
                  </p>
                </div>

                {/* Controls */}
                <div className="airpods-control-feature">
                  {col.controlIcon === "touch" ? (
                    <TouchControlIcon />
                  ) : (
                    <DigitalCrownIcon />
                  )}

                  <p>
                    {col.controlText}
                  </p>
                </div>

                {/* Battery Life */}
                <div className="airpods-battery-feature">
                  <span className="airpods-battery-hours">
                    {col.hours}
                  </span>

                  <p>
                    {col.batteryText}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Link */}
          <div className="airpods-bottom-comparison-link">
            <a href="#">
              Compare all AirPods models
              <span>›</span>
            </a>
          </div>
        </div>
      </section>

      <section className="airpods-know-section">
      <div className="airpods-know-title-container">
        <h2>Get to know AirPods.</h2>
      </div>

      <div className="airpods-know-scroll">
        {airPodsKnowCards.map((card) => (
          <div
            key={card.id}
            className="airpods-know-card"
          >
            <div className="airpods-know-card-header">
              <p className="airpods-know-category">
                {card.category}
              </p>

              <h3>{card.title}</h3>

              {card.description && (
                <p className="airpods-know-description">
                  {card.description}
                </p>
              )}
            </div>

            <div className="airpods-know-visual">
              {card.type === "anc" && (
                <div className="airpods-anc-visual">
                  <div className="airpods-anc-ring airpods-anc-ring-1"></div>
                  <div className="airpods-anc-ring airpods-anc-ring-2"></div>

                  <div className="airpods-anc-earbud">
                    <div className="airpods-anc-earbud-tip"></div>
                  </div>
                </div>
              )}

              {card.type === "translation" && (
                <div className="airpods-translation-visual">
                  <div className="airpods-language-box airpods-language-a">
                    A
                  </div>

                  <div className="airpods-language-box airpods-language-chinese">
                    文
                  </div>
                </div>
              )}

              {card.type === "heart" && (
                <div className="airpods-heart-visual">
                  <div className="airpods-heart-earbud"></div>

                  <div className="airpods-watch">
                    <div className="airpods-watch-time">
                      9:41
                    </div>

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

              {card.type === "spatial" && (
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

    <section className="airpods-promos-services">

      {/* Top Promo */}
      <div className="airpods-promo-container">
        <div className="airpods-promo-content">

          <div className="airpods-promo-text">
            <h2>
              Get 3 months of Apple Music free with your AirPods.*
            </h2>

            <a href="#">
              Learn more
              <span>›</span>
            </a>
          </div>

          <div className="airpods-promo-image">
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
              alt="Person listening to music"
            />
          </div>

        </div>
      </div>

      {/* Services */}
      <div className="airpods-services">
        <div className="airpods-services-container">

          {servicesData.map((service) => (
            <div
              key={service.id}
              className="airpods-service-item"
            >
              {service.icon}

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              {service.linkText && (
                <a href={service.linkUrl}>
                  {service.linkText}
                  <span>›</span>
                </a>
              )}
            </div>
          ))}

        </div>
      </div>

    </section>
    
    
    </>
  );
}