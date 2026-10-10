import React from 'react'
import './TVHome.css'
import tvhome3 from '../assets/tvhome3.jpg'
import tvhome2 from '../assets/tvhome2.jpg'
import tvhome1 from '../assets/tvhome1.jpg'
import tvhome from '../assets/tvhome.jpg'
import tvhome4 from '../assets/tvhome4.jpg'
import tvhome5 from '../assets/tvhome5.jpg'
import tvhome6 from '../assets/tvhome6.jpg'
import tvhome7 from '../assets/tvhome7.jpg'
import lighting from '../assets/lighting.avif'
import security from '../assets/security.jpg'
import comfort from '../assets/confort.jpg'
import entry from '../assets/entry.jpg'
import tvvideo from '../assets/tvvideo.mp4'

const appleGridProducts = [
  {
    id: "homepod",
    type: "product",
    theme: "dark",
    label: "HomePod",
    title: "Profound sound.",
    price: "$349",
    image: tvhome3,
    imageAlt: "HomePod Speakers",
    button: "Buy",
    linkText: "Learn more",
    link: "#learn-more",
  },

  {
    id: "homepod-mini",
    type: "product",
    theme: "light",
    label: "HomePod mini",
    title: "Surprising sound for its size.",
    price: "$129",
    image: tvhome2,
    imageAlt: "HomePod mini in multiple colors",
    button: "Buy",
    linkText: "Learn more",
    link: "#learn-more",
  },

  {
    id: "appletv",
    type: "product",
    theme: "light",
    logo: "tv",
    logoSuffix: "4K",
    title: "The Apple experience.",
    titleSecondLine: "Cinematic in every sense.",
    price: "Starting at $199",
    image: tvhome1,
    imageAlt: "Apple TV 4K box and Siri Remote",
    button: "Buy",
    linkText: "Learn more",
    link: "#learn-more",
  },

  {
    id: "home-app",
    type: "app",
    theme: "light",
    icon: "🏠",
    label: "Home app",
    title: "The foundation",
    titleSecondLine: "for a smarter home.",
    image: tvhome,
    imageAlt: "iPhone displaying Home App UI",
    linkText: "Learn more",
    link: "#learn-more",
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
const smartHomeCards = [
  {
    id: 1,
    title:
      "Easily control your home from anywhere with your favorite devices.",
    linkText: "Learn more about the Home app",
    link: "#",
    img: tvhome4,
  },
  {
    id: 2,
    title:
      "Seamlessly connected entertainment in every room.",
    linkText: "Learn more about HomePod",
    link: "#",
    img: tvhome5,
  },
  {
    id: 3,
    title: "Run it all with your voice.",
    linkText: "Learn more about Siri",
    link: "#",
    img: tvhome6,
  },
  {
    id: 4,
    title: "you can run all with video .",
    linkText: "Learn more about Siri",
    link: "#",
    img: tvhome7,
  },
];

{/* =========================
    SMART HOME ACCESSORIES
========================= */}

const smartHomeAccessories = [
  {
    id: 1,
    category: "Lighting",
    description:
      "Put your routine on a timer. Or set the mood with bulbs and switches.",
    linkText: "Shop Lights & Bulbs, Outlets, and Switches",
    link: "#",
    img: lighting,
  },
  {
    id: 2,
    category: "Security",
    description:
      "Keep an eye on what matters most with cameras, doorbells, and more.",
    linkText: "Shop Cameras and Sensors",
    link: "#",
    img: security,
  },
  {
    id: 3,
    category: "Comfort",
    description:
      "Turn up the heat or keep your cool with temperature controls and fans.",
    linkText: "Shop Thermostats",
    link: "#",
    img: comfort,
  },
  {
    id: 4,
    category: "Entry",
    description:
      "Unlock more ways to access your home.",
    linkText: "Shop Sensors and Locks1",
    link: "#",
    img: entry,
  },
];

const tvHomeVideoSection = {
  title: "Watch, sing, play, and work out.",
  subtitle: "On the big screen.",
  video: tvvideo,
};

// =========================
// SERVICES & SHOPPING PERKS
// =========================

const tvHomeServices = [
  {
    id: 1,
    logo: "tv",
    description:
      "Stream award-winning Apple Originals on every screen.",
    buttonText: "Try it free²",
    linkText: "Learn more",
    link: "#",
  },
  {
    id: 2,
    logo: "Music",
    description:
      "All music. Highest audio quality. Zero ads.",
    buttonText: "Try it free³",
    linkText: "Learn more",
    link: "#",
  },
  {
    id: 3,
    logo: "Arcade",
    description:
      "Best collection of mobile games for every player.",
    buttonText: "Get started",
    linkText: "Learn more",
    link: "#",
  },
  {
    id: 4,
    logo: "Fitness+",
    description:
      "From HIIT to Meditation, there's something for everyone.",
    buttonText: "Try it free⁴",
    linkText: "Learn more",
    link: "#",
  },
];

const tvHomePerks = [
  {
    id: 1,
    icon: "🚚",
    title: "Fast, free delivery",
    description:
      "Or pick up available items at an Apple Store.",
    linkText: "Learn more",
    link: "#",
  },
  {
    id: 2,
    icon: "💬",
    title: "Get help buying",
    description:
      "Have a question? Call a Specialist or chat online.",
    linkText: "Contact us",
    link: "#",
  },
];
const TVHome = () => {
  return (
    <div>
      <nav className="tvhome-subnav">
        <div className="tvhome-subnav-container">
          {subNavItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="tvhome-subnav-item"
            >
              <div className="tvhome-subnav-icon-container">
                {item.icon}
              </div>

              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </nav>


      <section className="tvhome-product-grid">
        <div className="tvhome-product-grid-container">

          {appleGridProducts.map((product) => (

            <div
              key={product.id}
              className={`tvhome-product-card ${product.theme === "dark"
                ? "tvhome-dark-card"
                : "tvhome-light-card"
                }`}
            >

              {/* CONTENT */}
              <div className="tvhome-product-content">

                {/* Logo */}
                {product.logo && (
                  <div className="tvhome-product-logo">
                    <span>{product.logo}</span>
                    <strong>{product.logoSuffix}</strong>
                  </div>
                )}

                {/* Icon */}
                {product.icon && (
                  <div className="tvhome-home-icon">
                    {product.icon}
                  </div>
                )}

                {/* Label */}
                {product.label && (
                  <h3>{product.label}</h3>
                )}

                {/* Title */}
                {product.title && (
                  <h2>
                    {product.title}

                    {product.titleSecondLine && (
                      <>
                        <br />
                        {product.titleSecondLine}
                      </>
                    )}
                  </h2>
                )}

                {/* Price */}
                {product.price && (
                  <p>{product.price}</p>
                )}

                {/* Actions */}
                <div
                  className={`tvhome-product-actions ${!product.button
                    ? "tvhome-learn-only"
                    : ""
                    }`}
                >

                  {product.button && (
                    <button>
                      {product.button}
                    </button>
                  )}

                  {product.linkText && (
                    <a href={product.link}>
                      {product.linkText} &gt;
                    </a>
                  )}

                </div>

              </div>


              {/* IMAGE */}
              <div
                className={`tvhome-product-image ${product.id === "homepod"
                  ? "tvhome-homepod-image"
                  : product.id === "homepod-mini"
                    ? "tvhome-homepod-mini-image"
                    : product.id === "appletv"
                      ? "tvhome-appletv-image"
                      : "tvhome-homeapp-image"
                  }`}
              >
                <img
                  src={product.image}
                  alt={product.imageAlt}
                />
              </div>

            </div>

          ))}

        </div>
      </section>

      {/* =========================
    SMART HOME CARD SLIDER
========================= */}
      <section className="tvhome-smart-slider">
        <div className="tvhome-smart-slider-track">
          {smartHomeCards.map((card) => (
            <article
              key={card.id}
              className="tvhome-smart-slider-card"
            >
              {/* Card Header */}
              <div className="tvhome-smart-slider-content">
                <h3>{card.title}</h3>

                <a href={card.link || "#"}>
                  {card.linkText} <span>›</span>
                </a>
              </div>

              {/* Card Image */}
              <div className="tvhome-smart-slider-image">
                <img
                  src={card.img}
                  alt={card.title}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tvhome-accessories">
        {/* Section Header */}
        <div className="tvhome-accessories-header">
          <h2>
            Accessories. Around your home
            <br />
            and across your devices.
          </h2>

          <a href="#">
            Shop accessories <span>›</span>
          </a>
        </div>

        {/* Accessories Carousel */}
        <div className="tvhome-accessories-track">
          {smartHomeAccessories.map((card) => (
            <article
              key={card.id}
              className="tvhome-accessories-card"
            >
              <div className="tvhome-accessories-card-content">
                <h3>{card.category}</h3>

                <p>{card.description}</p>

                <a href={card.link}>
                  {card.linkText} <span>›</span>
                </a>
              </div>

              <div className="tvhome-accessories-image">
                <img
                  src={card.img}
                  alt={card.category}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tvhome-video-section">
        <div className="tvhome-video-header">
          <h2>
            {tvHomeVideoSection.title}
            <br />
            {tvHomeVideoSection.subtitle}
          </h2>
        </div>

        <div className="tvhome-video-container">
          <video
            className="tvhome-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source
              src={tvHomeVideoSection.video}
              type="video/mp4"
            />

            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <section className="tvhome-services-perks">

        {/* Services */}
        <div className="tvhome-services-grid">
          {tvHomeServices.map((service) => (
            <div
              key={service.id}
              className="tvhome-service-item"
            >
              <h3>{service.logo}</h3>

              <p>{service.description}</p>

              <a
                href={service.link}
                className="tvhome-service-button"
              >
                {service.buttonText}
              </a>

              <a
                href={service.link}
                className="tvhome-service-link"
              >
                {service.linkText} <span>›</span>
              </a>
            </div>
          ))}
        </div>

        {/* Shopping Perks */}
        <div className="tvhome-perks-grid">
          {tvHomePerks.map((perk) => (
            <div
              key={perk.id}
              className="tvhome-perk-item"
            >
              <div className="tvhome-perk-icon">
                {perk.icon}
              </div>

              <h4>{perk.title}</h4>

              <p>{perk.description}</p>

              <a href={perk.link}>
                {perk.linkText} <span>›</span>
              </a>
            </div>
          ))}
        </div>

      </section>
    </div>
  )
}

export default TVHome
