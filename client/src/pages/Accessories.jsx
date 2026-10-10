import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
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
import accessory1 from '../assets/accessories1.jpg'
import accessory2 from '../assets/accessories2.jpg'
import accessory3 from '../assets/accessories3.avif'
import accessory4 from '../assets/accessories4.jpg'
import accessory5 from '../assets/accessories5.jpg'
import accessory6 from '../assets/accessories6.jpg'
import accessory7 from '../assets/accessories7.jpg'
import accessory8 from '../assets/accessories8.jpg'



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

const caseProtectionProducts = [
  {
    id: 1,
    title: "Find your color story.",
    category: "iPhone Cases & Protection",
    image: accessory1,
    type: "feature",
    link: "#",
  },
  {
    id: 2,
    title: "AirTag FineWoven Key Ring – Wildflower Blue",
    category: "New",
    price: "$35.00",
    image: accessory6,
    colors: ["#76684b", "#77515a", "#7894b9", "#393b43", "#555555"],
  },
  {
    id: 3,
    title: "Wrist Strap – Crisp Blue",
    category: "New",
    price: "$29.00 or $2.41/mo. for 12 mo.",
    image: accessory3,
    colors: ["#77515a", "#89816f", "#a9c4df", "#777777", "#a32975"],
  },
  {
    id: 4,
    title: "AirPods 5 with Wireless Charging Case",
    category: "New",
    price: "$149.00 or $24.83/mo. for 6 mo.",
    image: accessory4,
    colors: [],
  },
  {
    id: 5,
    title: "42mm Wildflower Blue Magnetic Link - S/M",
    category: "New",
    price: "$99.00 or $8.25/mo. for 12 mo.",
    image: accessory5,
    colors: ["#454545", "#77515a", "#7894b9", "#a28c70"],
  },
];
const duoCaseItems = [
  {
    id: 1,
    title: "iPhone Duo Case – Sand",
    category: "New",
    price: "$79.00 or $6.58/mo. for 12 mo.",
    image: accessory2,
  },
  {
    id: 2,
    title: "iPhone Duo Folio with Kickstand – Taupe",
    category: "New",
    price: "$129.00 or $10.75/mo. for 12 mo.",
    image: accessory7,
  },
];

const accessoryBenefits = [
  {
    id: 1,
    icon: "🚚",
    title: "Fast delivery or pickup.",
    description:
      "Enjoy two-hour delivery from an Apple Store, free delivery, or easy pickup.",
    details: "Choose an available delivery or pickup option at checkout.",
  },
  {
    id: 2,
    icon: "📦",
    title: "Free and easy returns.",
    description:
      "Complete your return online or take it to an Apple Store.",
    details: "Review the return options and eligibility for your order.",
  },
  {
    id: 3,
    icon: "▱",
    title: "Shop with Apple Card.◊",
    description:
      "Get 3% Daily Cash back when you shop at Apple with Apple Card.",
    details: "Eligibility and terms apply to Apple Card benefits.",
  },
];



const Accessories = () => {
  const [activeDuoSlide, setActiveDuoSlide] = useState(0);
  const [expandedBenefit, setExpandedBenefit] = useState(null);

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

      {/* CASES AND PROTECTION SHOWCASE */}

      <section className="case-protection-section">
        <div className="case-protection-grid">

          {caseProtectionProducts.map((product) => (
            <article
              key={product.id}
              className={`case-protection-card ${product.type === "feature" ? "case-protection-feature" : ""
                }`}
            >
              <a
                href={product.link || "#"}
                className="case-protection-image"
                aria-label={product.title}
              >
                <img src={product.image} alt={product.title} />
              </a>

              <div className="case-protection-info">
                <span className={`case-protection-category ${product.type === "feature" ? "muted" : ""
                  }`}>
                  {product.category}
                </span>

                <h3>{product.title}</h3>

                {product.colors?.length > 0 && (
                  <div className="case-protection-colors">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}

                {product.price && (
                  <p className="case-protection-price">{product.price}</p>
                )}
              </div>

              {product.type === "feature" && (
                <a
                  href={product.link || "#"}
                  className="case-protection-arrow"
                  aria-label="Explore iPhone cases"
                >
                  ›
                </a>
              )}
            </article>
          ))}

        </div>
      </section>


      {/* IPHONE DUO CASE SHOWCASE */}

      <section className="duo-showcase-section">
        <div className="duo-showcase-grid">

          {duoCaseItems.map((item) => (
            <article className="duo-product-card" key={item.id}>
              <div className="duo-product-image">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="duo-product-colors">
                <span />
                <span />
              </div>

              <div className="duo-product-info">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.price}</p>
              </div>
            </article>
          ))}

          <article className="duo-feature-card">
            <div className="duo-feature-heading">
              <span>iPhone Cases &amp; Protection</span>
              <h2>Snaps on. Stands up.</h2>
            </div>

            <div className="duo-feature-image">
              <img
                src={accessory8}
                alt="iPhone case with built-in kickstand"
              />
            </div>

            <button
              type="button"
              className="duo-feature-arrow duo-arrow-left"
              aria-label="Previous image"
              onClick={() =>
                setActiveDuoSlide((prev) => (prev === 0 ? 1 : 0))
              }
            >
              ‹
            </button>

            <button
              type="button"
              className="duo-feature-arrow duo-arrow-right"
              aria-label="Next image"
              onClick={() =>
                setActiveDuoSlide((prev) => (prev === 0 ? 1 : 0))
              }
            >
              ›
            </button>
          </article>

        </div>

        <div className="duo-shop-all">
          <a href="#">Shop all</a>
        </div>
      </section>


      {/* ACCESSORIES BENEFITS SECTION */}

      <section className="accessory-benefits-section">
        <h2 className="accessory-benefits-heading">
          Why Apple is the best place to buy accessories.
        </h2>

        <div className="accessory-benefits-grid">
          {accessoryBenefits.map((item) => (
            <article className="accessory-benefit-card" key={item.id}>
              <div className="accessory-benefit-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>

              {expandedBenefit === item.id && (
                <div className="accessory-benefit-details">
                  {item.details}
                </div>
              )}

              <button
                type="button"
                className="accessory-benefit-expand"
                aria-label="Expand benefit details"
                onClick={() =>
                  setExpandedBenefit(
                    expandedBenefit === item.id ? null : item.id
                  )
                }
              >
                {expandedBenefit === item.id ? "×" : "+"}
              </button>
            </article>
          ))}
        </div>

        <div className="accessory-benefits-controls">
          <button type="button" aria-label="Previous">‹</button>
          <button type="button" aria-label="Next">›</button>
        </div>
      </section>


      {/* ACCESSORIES FOOTER NAVIGATION */}
       <h1>Accessories</h1>
      <section className="accessories-footer-nav">
        <div className="accessories-footer-container">

          <div className="accessories-footer-column">
            <h3>Shop by Product</h3>
            <Link to="#">iPhone</Link>
            <Link to="#">iPad</Link>
            <Link to="#">Mac</Link>
            <Link to="#">Apple Watch</Link>
            <Link to="#">Apple Vision Pro</Link>
            <Link to="#">AirPods</Link>
            <Link to="#">TV &amp; Home</Link>
            <Link to="#">AirTag</Link>
            <Link to="#">Beats</Link>
          </div>

          <div className="accessories-footer-column">
            <h3>Shop by Category</h3>
            <Link to="#">Software</Link>
            <Link to="#">Chargers &amp; Adapters</Link>
            <Link to="#">Smart Home Accessories</Link>
            <Link to="#">Health &amp; Fitness</Link>
            <Link to="#">Office Accessories</Link>
            <Link to="#">Cases &amp; Protection</Link>
            <Link to="#">Hard Drives &amp; Storage</Link>
            <Link to="#">Headphones &amp; Speakers</Link>
            <Link to="#">Content Creation</Link>
            <Link to="#">Mice &amp; Keyboards</Link>
            <Link to="#">Gaming</Link>
          </div>

          <div className="accessories-footer-column">
            <h3>Explore More Accessories</h3>
            <Link to="#">College Essentials</Link>
            <Link to="#">New Arrivals</Link>
            <Link to="#">Made by Apple</Link>
            <Link to="#">Accessibility</Link>
          </div>

        </div>
      </section>

    </>
  );
};

export default Accessories;