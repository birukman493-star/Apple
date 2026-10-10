import React, { useRef } from "react";
import "./Accessories.css";

import iphone from "../assets/iphone.png";
import ipad from "../assets/ipad1.png";
import mac from "../assets/mac.png";
import watch from "../assets/watch1.jpg";
import vision from "../assets/vision7.jpg";
import airpods from "../assets/airpads1.jpg";
import tvhome from "../assets/tvhome.jpg";
import airtag from "../assets/airpads2.jpg";
import beats from "../assets/iphone7.png";
import ipad2 from '../assets/ipad2.png'
import ipad3 from '../assets/ipad3.png'
import make from '../assets/make.jpg'
import make1 from '../assets/make1.jpg'
import make2 from '../assets/make2.jpg'
import make3 from '../assets/make3.jpg'


const categories = [
  { name: "iPhone", imageSrc: iphone },
  { name: "iPad", imageSrc: ipad },
  { name: "Mac", imageSrc: mac },
  { name: "Apple Watch", imageSrc: watch },
  { name: "Apple Vision Pro", imageSrc: vision },
  { name: "AirPods", imageSrc: airpods },
  { name: "TV & Home", imageSrc: tvhome },
  { name: "AirTag", imageSrc: airtag },
  { name: "Beats", imageSrc: beats },
];

const Accessories = () => {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 260,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <section className="accessories-section">

        {/* =====================================
            ACCESSORIES HEADER
        ===================================== */}
        <div className="accessories-header">

          <h1 className="accessories-title">
            Accessories
          </h1>

          <div className="accessories-links">

            <a href="#">
              Connect with a Specialist
              <span>↗</span>
            </a>

            <a href="#">
              Find an Apple Store
              <span>↗</span>
            </a>

          </div>
        </div>


        {/* =====================================
            CATEGORY CAROUSEL
        ===================================== */}
        <div className="accessories-carousel-wrapper">

          <div
            ref={scrollRef}
            className="accessories-scroll"
          >

            {categories.map((item) => (
              <div
                key={item.name}
                className="accessory-item"
              >

                {/* Image */}
                <div className="accessory-image">
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                  />
                </div>

                {/* Name */}
                <span className="accessory-name">
                  {item.name}
                </span>

              </div>
            ))}

          </div>


          {/* =====================================
              RIGHT ARROW
          ===================================== */}
          <button
            type="button"
            className="accessories-arrow"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

        </div>

      </section>

      {/* =========================================
      ACCESSORIES PRODUCT CAROUSEL
  ========================================= */}

      <section className="accessories-product-carousel">

        <div className="accessories-carousel-track">

          {/* AirPods 5 */}
          <div className="accessories-product-card accessories-airpods-card">

            <div className="accessories-card-content">
              <h2>AirPods 5</h2>

              <p>
                Discover the magic of Active Noise Cancellation.
              </p>

              <a href="#">
                Shop <span>›</span>
              </a>
            </div>

            <img
              src={ipad2}
              alt="AirPods 5"
              className="accessories-card-image"
            />

          </div>


          {/* Mix & Match */}
          <div className="accessories-product-card accessories-mix-card">

            <div className="accessories-card-content">

              <h2>
                Mix it. Match it. Make it yours.
              </h2>

              <p>
                Pair your iPhone with a MagSafe case or wallet,
                Wrist Strap, or Crossbody Strap in a new mix
                of colors and textures.
              </p>

              <a href="#">
                Shop all <span>›</span>
              </a>

            </div>

            <div className="accessories-products-image">
              <img
                src={ipad3}
                alt="MagSafe accessories"
              />
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
    FEATURED ACCESSORIES — OUR TOP PICKS
========================================================= */}
      <section className="accessories-featured">

        <div className="accessories-featured-header">
          <h2>Our top picks.</h2>
          <span>Your next favorites.</span>
        </div>

        <div className="accessories-featured-grid">

          {/* 1. Crossbody Strap */}
          <div className="accessories-featured-card">

            <div className="accessories-featured-image">
              <img
                src={make}
                alt="Crossbody Strap Burgundy"
              />
            </div>

            <div className="accessories-featured-info">

              <h3>Crossbody Strap</h3>

              <p className="accessories-featured-color">
                Burgundy
              </p>

              <div className="accessories-color-dots">
                <span className="accessory-dot burgundy"></span>
                <span className="accessory-dot black"></span>
                <span className="accessory-dot blue"></span>
                <span className="accessory-dot beige"></span>
              </div>

              <p className="accessories-featured-description">
                An adjustable hands-free strap made from 100% recycled PET yarn,
                designed to clip directly into select Apple MagSafe cases.
              </p>

              <div className="accessories-featured-price">
                <strong>$59.00</strong>
                <span>or $4.91/mo. for 12 mo.</span>
              </div>

              <button className="accessories-featured-buy">
                Buy
              </button>

            </div>
          </div>


          {/* 2. iPhone Clear Case */}
          <div className="accessories-featured-card">

            <div className="accessories-featured-image">
              <img
                src={make1}
                alt="iPhone 18 Pro Max Clear Case with MagSafe"
              />
            </div>

            <div className="accessories-featured-info">

              <h3>iPhone 18 Pro Max Clear Case with MagSafe</h3>

              <p className="accessories-featured-color">
                Clear
              </p>

              <div className="accessories-color-dots">
                <span className="accessory-dot clear"></span>
              </div>

              <p className="accessories-featured-description">
                A thin, protective clear case that showcases the deep burgundy
                finish of iPhone 18 Pro Max, with built-in MagSafe magnetic
                alignment.
              </p>

              <div className="accessories-featured-price">
                <strong>$49.00</strong>
                <span>or $4.08/mo. for 12 mo.</span>
              </div>

              <button className="accessories-featured-buy">
                Buy
              </button>

            </div>
          </div>


          {/* 3. FineWoven Wallet */}
          <div className="accessories-featured-card">

            <div className="accessories-featured-image">
              <img
                src={make2}
                alt="iPhone FineWoven Wallet with MagSafe Burgundy"
              />
            </div>

            <div className="accessories-featured-info">

              <h3>iPhone FineWoven Wallet with MagSafe</h3>

              <p className="accessories-featured-color">
                Burgundy
              </p>

              <div className="accessories-color-dots">
                <span className="accessory-dot burgundy"></span>
                <span className="accessory-dot black"></span>
                <span className="accessory-dot taupe"></span>
                <span className="accessory-dot blue"></span>
              </div>

              <p className="accessories-featured-description">
                A magnetic card wallet constructed from microtwill FineWoven
                material that snaps onto the back of MagSafe-compatible
                iPhone cases.
              </p>

              <div className="accessories-featured-price">
                <strong>$59.00</strong>
                <span>or $4.91/mo. for 12 mo.</span>
              </div>

              <button className="accessories-featured-buy">
                Buy
              </button>

            </div>
          </div>


          {/* 4. Braided Solo Loop */}
          <div className="accessories-featured-card">

            <div className="accessories-featured-image">
              <img
                src={make3}
                alt="46mm Burgundy Braided Solo Loop"
              />
            </div>

            <div className="accessories-featured-info">

              <h3>46mm Burgundy Braided Solo Loop</h3>

              <p className="accessories-featured-color">
                Size 3 · Burgundy
              </p>

              <div className="accessories-color-dots">
                <span className="accessory-dot burgundy"></span>
                <span className="accessory-dot black"></span>
                <span className="accessory-dot blue"></span>
              </div>

              <p className="accessories-featured-description">
                A stretchable, lug-integrated Apple Watch strap woven from
                recycled polyester thread interthreaded with silicone threads.
              </p>

              <div className="accessories-featured-price">
                <strong>$99.00</strong>
                <span>or $8.25/mo. for 12 mo.</span>
              </div>

              <button className="accessories-featured-buy">
                Buy
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
    ACCESSORIES PRODUCT SHOWCASE
========================================================= */}

<section className="accessories-showcase">
  <div className="accessories-grid">

    {/* LEFT — iPHONE CASES */}
    <div className="accessories-card accessories-cases">
      <div className="accessories-card-content">
        <p className="accessories-eyebrow">
          iPhone Cases & Protection
        </p>

        <h2>Find your color story.</h2>

        <button className="accessories-arrow-btn">
          →
        </button>
      </div>

      <div className="case-products">
        <div className="case-item">
          <img src="/case-magenta.png" alt="Magenta iPhone Case" />
        </div>

        <div className="case-item">
          <img src="/case-light-blue.png" alt="Light Blue iPhone Case" />
        </div>

        <div className="case-item">
          <img src="/case-burgundy.png" alt="Burgundy iPhone Case" />
        </div>

        <div className="case-item">
          <img src="/case-taupe.png" alt="Taupe iPhone Case" />
        </div>
      </div>
    </div>


    {/* TOP MIDDLE — AIRTAG */}
    <div className="accessories-card accessories-airtag">

      <img
        src="/airtag-finewoven-keyring-blue.jpg"
        alt="AirTag FineWoven Key Ring Wildflower Blue"
        className="accessories-product-image"
      />

      <div className="accessories-product-info">
        <h3>AirTag FineWoven Key Ring</h3>

        <p className="accessories-product-color">
          Wildflower Blue
        </p>

        <p className="accessories-price">
          $35.00
        </p>
      </div>

    </div>


    {/* TOP RIGHT — WRIST STRAP */}
    <div className="accessories-card accessories-wrist">

      <img
        src="/wrist-strap-crisp-blue.jpg"
        alt="Wrist Strap Crisp Blue"
        className="accessories-product-image"
      />

      <div className="accessories-product-info">
        <h3>Wrist Strap</h3>

        <p className="accessories-product-color">
          Crisp Blue
        </p>

        <p className="accessories-price">
          $29.00
        </p>

        <div className="accessories-color-dots">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

    </div>


    {/* BOTTOM MIDDLE — AIRPODS */}
    <div className="accessories-card accessories-airpods">

      <img
        src="/airpods-5-wireless.jpg"
        alt="AirPods 5 with Wireless Charging Case"
        className="accessories-product-image"
      />

      <div className="accessories-product-info">
        <h3>AirPods 5</h3>

        <p className="accessories-product-color">
          with Wireless Charging Case
        </p>

        <p className="accessories-price">
          $149.00
        </p>
      </div>

    </div>


    {/* BOTTOM RIGHT — APPLE WATCH BAND */}
    <div className="accessories-card accessories-watch-band">

      <img
        src="/watch-band-wildflower-blue.jpg"
        alt="42mm Wildflower Blue Magnetic Link"
        className="accessories-product-image"
      />

      <div className="accessories-product-info">
        <h3>42mm Wildflower Blue Magnetic Link</h3>

        <p className="accessories-product-color">
          S/M
        </p>

        <p className="accessories-price">
          $99.00
        </p>
      </div>

    </div>

  </div>
</section>

    </>
  );
};

export default Accessories;