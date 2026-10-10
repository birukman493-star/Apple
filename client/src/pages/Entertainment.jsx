import React from 'react'
import {useState, useRef} from 'react'

import './Entertainment.css'
import appleLogo from '../assets/applelog.png'
import video from '../assets/entertainment1.mp4'
import video1 from '../assets/entertainment2.mp4'
import knifeedge from '../assets/knifeedge.webp'
import mayday from '../assets/mayday.webp'
import smallprophets from '../assets/smallprophets.webp'
import lucky from '../assets/lucky.webp'
import thedynasty from '../assets/thedynasty.webp'
import thedink from '../assets/thedink.webp'
import audio1 from '../assets/audio1.jpg'
import audio2 from '../assets/audio2.jpg'
import audio3 from '../assets/audio3.jpg'
import audio4 from '../assets/audio4.jpg'
import audio5 from '../assets/audio5.jpg'
import audio6 from '../assets/audio6.jpg'
import video2 from '../assets/video2.mp4'

// =========================
// ENTERTAINMENT SUB NAV
// =========================

const entertainmentItems = [
  {
    id: 1,
    name: "Apple One",
    icon: "One",
    link: "#apple-one",
  },
  {
    id: 2,
    name: "Apple TV+",
    icon: "tv",
    link: "#apple-tv",
  },
  {
    id: 3,
    name: "Apple Music",
    icon: "🎵",
    link: "#apple-music",
  },
  {
    id: 4,
    name: "Apple Arcade",
    icon: "🕹️",
    link: "#apple-arcade",
  },
  {
    id: 5,
    name: "Apple Fitness+",
    icon: "🎯",
    link: "#apple-fitness",
  },
  {
    id: 6,
    name: "Apple News+",
    icon: "📰",
    link: "#apple-news",
  },
  {
    id: 7,
    name: "Apple Podcasts",
    icon: "🎙️",
    link: "#apple-podcasts",
  },
  {
    id: 8,
    name: "Apple Books",
    icon: "📖",
    link: "#apple-books",
  },
];
// =========================
// ENTERTAINMENT HERO
// =========================

const entertainmentHero = {
  title: "Meet the A-list of entertainment.",
  description:
    "Award-winning movies. Binge-worthy shows. Your favorite music mastered in Spatial Audio. The most epic collection of mobile games. And the world’s largest library of 4K Ultra HD fitness content. The best entertainment and experiences live here — only on Apple.",
  promoLogo: appleLogo,
  promoText:
    "Get up to six services in one subscription with Apple One.",
  buttonText: "Learn more",
  buttonLink: "#learn-more",
};

const entertainmentShows = [
  {
    id: 1,
    title: "The Dink",
    genre: "Comedy",
    img: thedink,
  },
  {
    id: 2,
    title: "Silo",
    genre: "Sci-Fi",
    img: knifeedge,
  },
  {
    id: 3,
    title: "The Dynasty: UConn Huskies",
    genre: "Documentary",
    img: thedynasty,
  },
  {
    id: 4,
    title: "Lucky",
    genre: "Action",
    img: lucky,
  },
  {
    id: 5,
    title: "Ted Lasso",
    genre: "Comedy",
    img: mayday,
  },
  {
    id: 6,
    title: "The Morning Show",
    genre: "Drama",
    img: smallprophets,
  },
];

const musicItems = [
  {
    id: 1,
    title: "¡Dale Play!",
    subtitle: "Apple Music Latin",
    img: audio1,
  },
  {
    id: 2,
    title: "Miley: The Zane Lowe Interview",
    subtitle: "The pop superstar unveils Bass Pe...",
    img: audio2,
  },
  {
    id: 3,
    title: "New Music Daily",
    subtitle: "Apple Music",
    img: audio3,
  },
  {
    id: 4,
    title: "Today's Hits",
    subtitle: "Apple Music Hits",
    img: audio4,
  },
  {
    id: 5,
    title: "Last night's Hits",
    subtitle: "Apple Music Country",
    img: audio5,
  },
   {
    id: 5,
    title: "Last night's Hits",
    subtitle: "Apple Music Country",
    img: audio6,
  },
];
const Entertainment = () => {
  const [isPlaying, setIsPlaying] = useState(true);
const videoRef = useRef(null);

const togglePlay = () => {
  if (!videoRef.current) return;

  if (isPlaying) {
    videoRef.current.pause();
  } else {
    videoRef.current.play();
  }

  setIsPlaying((prev) => !prev);
};
  return (
    <div>

      <section className="entertainment-subnav">
        <div className="entertainment-subnav-inner">
          {entertainmentItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="entertainment-subnav-item"
            >
              <div className="entertainment-subnav-icon">
                {item.icon}
              </div>

              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="entertainment-hero">
        {/* Main Hero */}
        <div className="entertainment-hero-content">
          <h1>
            {entertainmentHero.title}
          </h1>

          <p>
            {entertainmentHero.description}
          </p>
        </div>

        {/* Apple One Promo */}
        <div className="entertainment-hero-promo">
          <div className="entertainment-hero-promo-inner">

            <div className="entertainment-hero-promo-content">
              <div className="entertainment-hero-promo-logo">
                <img src={appleLogo} alt="Apple" />
                <span>One</span>
              </div>
              <p>
                {entertainmentHero.promoText}
              </p>
            </div>

            <a
              href={entertainmentHero.buttonLink}
              className="entertainment-hero-promo-button"
            >
              {entertainmentHero.buttonText}
            </a>

          </div>
        </div>
      </section>

      {/* =================================================
    APPLE TV+ FOUNDATION VIDEO
    ================================================= */}

      <section className="entertainment-foundation">

        <div className="entertainment-foundation-card">

          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="entertainment-foundation-video"
          >
            <source
              src={video}
              type="video/mp4"
            />
          </video>

          {/* Gradient Overlay */}
          <div className="entertainment-foundation-overlay"></div>

          {/* Content */}
          <div className="entertainment-foundation-content">

            {/* Left Content */}
            <div className="entertainment-foundation-info">

              {/* Badges */}
              <div className="entertainment-foundation-badges">

                <div className="entertainment-foundation-badge apple-tv-badge">
                  <img
                    src={appleLogo}
                    alt="Apple"
                  />

                  <span>tv</span>

                  <strong>Apple TV</strong>
                </div>

                <div className="entertainment-foundation-badge">
                  Bundle with One
                </div>

              </div>

              {/* Main Title */}
              <h2>
                Stream award-winning Apple Originals
                on every screen.
              </h2>

              {/* Show Name */}
              <p className="entertainment-foundation-show">
                FOUNDATION
              </p>

            </div>

            {/* Right Actions */}
            <div className="entertainment-foundation-actions">

              <button className="entertainment-foundation-free">
                Try it free¹
              </button>

              <button className="entertainment-foundation-learn">
                Learn more
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="entertainment-foundation-play"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? "Ⅱ" : "▶"}
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
    APPLE TV+ SHOW MARQUEE
    ================================================= */}

<section className="entertainment-show-marquee">

  <div className="entertainment-show-marquee-track">

    {[...entertainmentShows, ...entertainmentShows].map(
      (show, index) => (

        <div
          className="entertainment-show-card"
          key={`${show.id}-${index}`}
        >

          {/* Image Card */}

          <div className="entertainment-show-image-wrapper">

            <img
              src={show.img}
              alt={show.title}
              className="entertainment-show-image"
            />

            {/* Apple TV Badge */}

            <span className="entertainment-show-badge">
              tv
            </span>

            {/* Hover Overlay */}

            <div className="entertainment-show-overlay">

              <button
                type="button"
                className="entertainment-show-stream"
              >
                Stream now
                <span>▶</span>
              </button>

            </div>

          </div>

          {/* Show Information */}

          <div className="entertainment-show-info">

            <h4>{show.title}</h4>

            <p>{show.genre}</p>

          </div>

        </div>

      )
    )}

  </div>

</section>


 {/* APPLE TV+ FOUNDATION VIDEO */}
   {/* it is repteation */}

      <section className="entertainment-foundation">

        <div className="entertainment-foundation-card">

          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="entertainment-foundation-video"
          >
            <source
              src={video1}
              type="video/mp4"
            />
          </video>

          {/* Gradient Overlay */}
          <div className="entertainment-foundation-overlay"></div>

          {/* Content */}
          <div className="entertainment-foundation-content">

            {/* Left Content */}
            <div className="entertainment-foundation-info">

              {/* Badges */}
              <div className="entertainment-foundation-badges">

                <div className="entertainment-foundation-badge apple-tv-badge">
                  <img
                    src={appleLogo}
                    alt="Apple"
                  />

                  <span>tv</span>

                  <strong>Apple TV</strong>
                </div>

                <div className="entertainment-foundation-badge">
                  Bundle with One
                </div>

              </div>

              {/* Main Title */}
              <h2>
                All music. Highest audio <br/> quality. zero ads.2
              </h2>

              {/* Show Name */}
              <p className="entertainment-foundation-show">
                FOUNDATION
              </p>

            </div>

            {/* Right Actions */}
            <div className="entertainment-foundation-actions">

              <button className="entertainment-foundation-free">
                Try it free¹
              </button>

              <button className="entertainment-foundation-learn">
                Learn more
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="entertainment-foundation-play"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? "Ⅱ" : "▶"}
              </button>

            </div>

          </div>

        </div>

      </section>
 
<section className="entertainment-music">
  <div className="entertainment-music-track">
    {[...musicItems, ...musicItems].map((item, index) => (
      <div
        className="entertainment-music-card"
        key={`${item.id}-${index}`}
      >
        <div className="entertainment-music-image-wrapper">
          <img
            src={item.img}
            alt={item.title}
            className="entertainment-music-image"
          />

          <span className="entertainment-music-badge">
            Music
          </span>

          <div className="entertainment-music-overlay">
            <button
              type="button"
              className="entertainment-music-listen"
            >
              Listen now
              <span>▶</span>
            </button>
          </div>
        </div>

        <div className="entertainment-music-info">
          <h4>{item.title}</h4>
          <p>{item.subtitle}</p>
        </div>
      </div>
    ))}
  </div>
</section>


 {/* APPLE TV+ FOUNDATION VIDEO */}
   {/* it is repteation */}

      <section className="entertainment-foundation">

        <div className="entertainment-foundation-card">

          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="entertainment-foundation-video"
          >
            <source
              src={video}
              type="video/mp4"
            />
          </video>

          {/* Gradient Overlay */}
          <div className="entertainment-foundation-overlay"></div>

          {/* Content */}
          <div className="entertainment-foundation-content">

            {/* Left Content */}
            <div className="entertainment-foundation-info">

              {/* Badges */}
              <div className="entertainment-foundation-badges">

                <div className="entertainment-foundation-badge apple-tv-badge">
                  <img
                    src={video2}
                    alt="Apple"
                  />

                  <span>tv</span>

                  <strong>Apple Arcade</strong>
                </div>

                <div className="entertainment-foundation-badge">
                  Bundle with One
                </div>

              </div>

              {/* Main Title */}
              <h2>
                The best collection of mobile <br/> games, now in the Apple Games App.
              </h2>

              {/* Show Name */}
              <p className="entertainment-foundation-show">
                FOUNDATION
              </p>

            </div>

            {/* Right Actions */}
            <div className="entertainment-foundation-actions">

              <button className="entertainment-foundation-free">
                Get the app
              </button>

              <button className="entertainment-foundation-learn">
                Learn more
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="entertainment-foundation-play"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? "Ⅱ" : "▶"}
              </button>

            </div>

          </div>

        </div>

      </section>


{/* HORIZONTAL APPLE MUSIC / GAMES CAROUSEL */}

<section className="watch-horizontal-section">
  <div className="watch-horizontal-track">
    {[
      {
        id: 1,
        image: audio3,
        title: "Hello Kitty Island Adventure",
        category: "Adventure",
      },
      {
        id: 2,
        image: audio3,
        title: "PowerWash Simulator",
        category: "Casual",
      },
      {
        id: 3,
        image: audio2,
        title: "Toca Boca Jr Classics",
        category: "Family",
      },
      {
        id: 4,
        image: audio1,
        title: "Madden NFL 27 Arcade",
        category: "Sports",
      },
    ].map((item) => (
      <article className="watch-horizontal-card" key={item.id}>
        <div className="watch-horizontal-image">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
          />
        </div>

        <h3>{item.title}</h3>

        <p>{item.category}</p>
      </article>
    ))}

    {/* Duplicate cards for smooth infinite movement */}
    {[
      {
        id: 5,
        image: knifeedge,
        title: "Hello Kitty Island Adventure",
        category: "Adventure",
      },
      {
        id: 6,
        image: mayday,
        title: "PowerWash Simulator",
        category: "Casual",
      },
      {
        id: 7,
        image: lucky,
        title: "Toca Boca Jr Classics",
        category: "Family",
      },
      {
        id: 8,
        image: smallprophets,
        title: "Madden NFL 27 Arcade",
        category: "Sports",
      },
    ].map((item) => (
      <article className="watch-horizontal-card" key={item.id}>
        <div className="watch-horizontal-image">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
          />
        </div>

        <h3>{item.title}</h3>

        <p>{item.category}</p>
      </article>
    ))}
  </div>
</section>


  {/* =========================
    APPLE ONE SECTION
========================= */}

<section className="apple-one-section">
  <div className="apple-one-container">

    {/* LEFT SIDE */}
    <div className="apple-one-content">

      <div className="apple-one-logo">
        <span className="apple-one-apple"></span>
        <span className="apple-one-word">One</span>
      </div>

      <h2>
        Bundle up to six Apple services
        and enjoy more for less.
      </h2>

      <div className="apple-one-buttons">
        <a href="#" className="apple-one-primary">
          Try Apple One free⁶
        </a>

        <a href="#" className="apple-one-secondary">
          Learn more
        </a>
      </div>

    </div>

    {/* RIGHT SIDE */}
    <div className="apple-one-services">

      <div className="apple-one-service apple-one-music">
        <span></span>
        <strong>Music</strong>
      </div>

      <div className="apple-one-service apple-one-fitness">
        <span></span>
        <strong>Fitness+</strong>
      </div>

      <div className="apple-one-service apple-one-tv">
        <span></span>
        <strong>tv</strong>
      </div>

      <div className="apple-one-service apple-one-news">
        <span></span>
        <strong>News+</strong>
      </div>

      <div className="apple-one-service apple-one-arcade">
        <span></span>
        <strong>Arcade</strong>
      </div>

      <div className="apple-one-service apple-one-icloud">
        <span></span>
        <strong>iCloud+</strong>
      </div>

    </div>

  </div>
</section>

{/* =========================================================
    ACCESSORIES — TOP PICKS
========================================================= */}
<section className="accessories-top-picks">
  <div className="accessories-section-header">
    <h2>Our top picks.</h2>
    <h2>Your next favorites.</h2>
  </div>

  <div className="accessories-top-grid">

    {/* Crossbody Strap */}
    <div className="accessory-product-card">
      <div className="accessory-product-image">
        <img
          src="/assets/crossbody-strap.png"
          alt="Crossbody Strap"
        />
      </div>

      <div className="accessory-product-info">
        <h3>Crossbody Strap</h3>
        <p>$59.00</p>
      </div>
    </div>

    {/* iPhone Clear Case */}
    <div className="accessory-product-card">
      <div className="accessory-product-image">
        <img
          src="/assets/iphone-clear-case.png"
          alt="iPhone 18 Pro Max Clear Case with MagSafe"
        />
      </div>

      <div className="accessory-product-info">
        <h3>iPhone 18 Pro Max Clear Case with MagSafe</h3>
        <p>$49.00</p>
      </div>
    </div>

    {/* FineWoven Wallet */}
    <div className="accessory-product-card">
      <div className="accessory-product-image">
        <img
          src="/assets/finewoven-wallet.png"
          alt="iPhone FineWoven Wallet with MagSafe"
        />
      </div>

      <div className="accessory-product-info">
        <h3>iPhone FineWoven Wallet with MagSafe</h3>
        <p>$59.00</p>
      </div>
    </div>

    {/* Apple Watch Band */}
    <div className="accessory-product-card">
      <div className="accessory-product-image">
        <img
          src="/assets/burgundy-solo-loop.png"
          alt="46mm Burgundy Braided Solo Loop"
        />
      </div>

      <div className="accessory-product-info">
        <h3>46mm Burgundy Braided Solo Loop</h3>
        <p>Size 3 · $99.00</p>
      </div>
    </div>

  </div>
</section>


{/* =========================================================
    ACCESSORIES COLLECTION
========================================================= */}
<section className="accessories-collection">

  <div className="accessories-collection-header">
    <h2>Accessories for every day.</h2>
    <p>Designed to work beautifully with your Apple devices.</p>
  </div>

  <div className="accessories-collection-grid">

    {/* iPhone Cases */}
    <div className="accessories-cases-card">
      <img
        src="/assets/iphone-cases.png"
        alt="iPhone cases"
      />

      <div className="accessories-card-content">
        <h3>Cases made for iPhone.</h3>
        <p>
          Protection, personality, and MagSafe — all in one.
        </p>
      </div>
    </div>


    {/* AirTag */}
    <div className="accessories-small-card">
      <div className="accessories-small-image">
        <img
          src="/assets/airtag-keyring.png"
          alt="AirTag FineWoven Key Ring"
        />
      </div>

      <h3>AirTag FineWoven Key Ring</h3>
      <p>Wildflower Blue · $35.00</p>
    </div>


    {/* Wrist Strap */}
    <div className="accessories-small-card">
      <div className="accessories-small-image">
        <img
          src="/assets/wrist-strap.png"
          alt="Wrist Strap"
        />
      </div>

      <h3>Wrist Strap</h3>
      <p>Crisp Blue · $29.00</p>
    </div>


    {/* AirPods */}
    <div className="accessories-small-card">
      <div className="accessories-small-image">
        <img
          src="/assets/airpods-5.png"
          alt="AirPods 5 with Wireless Charging Case"
        />
      </div>

      <h3>AirPods 5</h3>
      <p>With Wireless Charging Case · $149.00</p>
    </div>

  </div>
</section>



    </div>
  )
}

export default Entertainment
