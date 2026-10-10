import React, { useRef, useEffect, useState } from "react";
import {Link} from "react-router-dom";
import "./Mac.css";

import MacBookAir from "../assets/mac.png";
import MacBookPro from "../assets/mac1.png";
import IMac from "../assets/mac2.png";
import MacMini from "../assets/mac3.png";
import MacStudio from "../assets/mac4.png";
import MacPro from "../assets/mac5.png";

import Compare from "../assets/padd.jpg";
import HelpMeChoose from "../assets/iphone.png";
import TradeIn from "../assets/Trad-mac.png";
import SwitchMac from "../assets/switch-mac.png";
import MacAccessories from "../assets/mac-accessories.png";
import StudioDisplay from "../assets/studio-display.png";
import AppleWorld from "../assets/apple-world.png";



/* =========================
   MAC NAVIGATION PRODUCTS
========================= */

const MacProducts = [
  {
    id: "macbook-air",
    title: "MacBook Air",
    image: MacBookAir,
  },

  {
    id: "macbook-pro",
    title: "MacBook Pro",
    image: MacBookPro,
  },

  {
    id: "imac",
    title: "iMac",
    image: IMac,
  },

  {
    id: "mac-mini",
    title: "Mac mini",
    image: MacMini,
    badge: "New",
  },

  {
    id: "mac-studio",
    title: "Mac Studio",
    image: MacStudio,
    badge: "New",
  },

  {
    id: "mac-pro",
    title: "Mac Pro",
    image: MacPro,
  },

  {
    id: "compare",
    title: "Compare",
    image: Compare,
  },

  {
    id: "help-me-choose",
    title: "Help Me Choose",
    image: HelpMeChoose,
  },

  {
    id: "switch-to-mac",
    title: "Switch to Mac",
    image: SwitchMac,
  }
];


function Mac() {



  const navRef = useRef(null);

  const [lineupProducts, setLineupProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("All products");
  const [shopBenefits, setShopBenefits] = useState([]);
  const [getToKnowMac, setGetToKnowMac] = useState([]);
  const [helpMeChoose, setHelpMeChoose] = useState([]);
  const [activeProduct, setActiveProduct] = useState(0);
const [activeSection, setActiveSection] = useState(0);
const [activeAppleWorld, setActiveAppleWorld] = useState(0);
  /* =========================
     MAC NAVIGATION SCROLL
  ========================= */

  const scrollRight = () => {
    navRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };


  /* =========================
     FETCH MAC PRODUCTS
  ========================= */

  useEffect(() => {

    fetch("http://localhost:5000/api/products/category/mac")

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch Mac products");
        }

        return response.json();

      })

      .then((data) => {

        setLineupProducts(data);
        setLoading(false);

      })

      .catch((error) => {

        console.error("Mac products error:", error);
        setLoading(false);

      });

  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/mac-shop-benefits")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Mac shop benefits");
        }

        return response.json();
      })
      .then((data) => {
        setShopBenefits(data);
      })
      .catch((error) => {
        console.error("Mac shop benefits error:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/mac-get-to-know")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Get to Know Mac");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Get to Know Mac:", data);
        setGetToKnowMac(data);
      })
      .catch((error) => {
        console.error("Get to Know Mac error:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/mac-help-me-choose")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Help Me Choose");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Mac Help Me Choose:", data);
        setHelpMeChoose(data);
      })
      .catch((error) => {
        console.error("Mac Help Me Choose error:", error);
      });
  }, []);


  return (

    <>

      {/* ==================================================
          MAC NAVIGATION
      ================================================== */}

      <section className="mac-nav-section">

        <div className="mac-nav-container">

          <h1>Mac</h1>

          <div className="mac-nav-wrapper">

            <div
              className="mac-nav-list"
              ref={navRef}
            >

              {MacProducts.map((item) => (

                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="mac-nav-item"
                >

                  <div className="mac-nav-image">

                    <img
                      src={item.image}
                      alt={item.title}
                    />

                  </div>

                  <span className="mac-nav-title">
                    {item.title}
                  </span>

                  {item.badge ? (

                    <span className="mac-nav-badge">
                      {item.badge}
                    </span>

                  ) : (

                    <span className="mac-nav-badge-space">
                      &nbsp;
                    </span>

                  )}

                </a>

              ))}

            </div>


            <button
              type="button"
              className="mac-nav-arrow"
              onClick={scrollRight}
              aria-label="Scroll right"
            >

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >

                <path
                  d="M9 5l7 7-7 7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

            </button>

          </div>

        </div>

      </section>


      {/* ==================================================
          EXPLORE THE LINEUP
      ================================================== */}

      <section className="mac-lineup">

        <div className="lineup-container">

          <h2>
            Explore the lineup.
          </h2>
          {/* =========================
    CATEGORY TABS
========================= */}

          <div className="lineup-tabs">

            <button
              className={activeTab === "All products" ? "active" : ""}
              onClick={() => setActiveTab("All products")}
            >
              All products
            </button>

            <button
              className={activeTab === "Laptops" ? "active" : ""}
              onClick={() => setActiveTab("Laptops")}
            >
              Laptops
            </button>

            <button
              className={activeTab === "Desktops" ? "active" : ""}
              onClick={() => setActiveTab("Desktops")}
            >
              Desktops
            </button>

            <button
              className={activeTab === "Displays" ? "active" : ""}
              onClick={() => setActiveTab("Displays")}
            >
              Displays
            </button>

          </div>


          {/* =========================
              PRODUCTS
          ========================= */}

          {loading ? (

            <p className="lineup-loading">
              Loading products...
            </p>

          ) : lineupProducts.length === 0 ? (

            <p className="lineup-loading">
              No Mac products available.
            </p>

          ) : (

            <div className="lineup-products">

              {lineupProducts.map((product) => (

                <div
                  className="lineup-product"
                  key={product.id}
                >


                  {/* Product Image */}

                  <div className="product-image">

                    <img
                      src={product.image_url}
                      alt={product.title}
                    />

                  </div>


                  {/* Color Dots */}

                  <div className="color-dots">

                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                  </div>


                  {/* Badge */}

                  {product.badge_text && (

                    <div className="product-badge">
                      {product.badge_text}
                    </div>

                  )}


                  {/* Product Name */}

                  <h3>
                    {product.title}
                  </h3>


                  {/* Description */}

                  <p className="product-description">
                    {product.description}
                  </p>


                  {/* Price */}

                  <p className="product-price">

                    {product.price_upfront && (
                      <>
                        From $
                        {Number(
                          product.price_upfront
                        ).toLocaleString()}
                      </>
                    )}

                    {product.price_monthly && (
                      <>
                        {" "}
                        or $
                        {Number(
                          product.price_monthly
                        ).toFixed(2)}
                        /mo. for 12 mo.**
                      </>
                    )}

                    {product.lease_monthly && (
                      <>
                        <br />

                        Lease from $
                        {Number(
                          product.lease_monthly
                        ).toFixed(2)}
                        /mo. for 36 mo. with

                        <br />

                        Apple Upgrade
                        <sup>◊</sup>
                      </>
                    )}

                  </p>


                  {/* Buttons */}

                  <div className="product-buttons">

                    <button className="learn-more">
                      Learn more
                    </button>

                    <a href="#">
                      Buy ›
                    </a>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* WHY APPLE IS THE BEST PLACE TO SHOP MAC */}

      <section className="mac-shop-section">

        <div className="mac-shop-header">
          <h2>Why Apple is the best place to shop Mac.</h2>
        </div>

        <div className="mac-shop-scroll">

          <div className="mac-shop-track">

            {shopBenefits.map((benefit) => (
              <article className="mac-shop-card" key={benefit.id}>

                <div className="mac-shop-image">
                  <img
                    src={benefit.image_url}
                    alt={benefit.title}
                  />
                </div>

                <div className="mac-shop-content">
                  <h3>{benefit.title}</h3>

                  <p>
                    {benefit.description}
                  </p>
                </div>

              </article>
            ))}

          </div>

        </div>

      </section>

      {/* ================================
    GET TO KNOW MAC
================================ */}

      <section className="get-to-know-mac">

        <div className="get-to-know-header">
          <h2>Get to know Mac.</h2>
        </div>

        <div className="get-to-know-scroll">

          <div className="get-to-know-track">

            {getToKnowMac.map((item) => (
              <article
                className="get-to-know-card"
                key={item.id}
              >

                <div className="get-to-know-image">
                  <img
                    src={item.image_url}
                    alt={item.title}
                  />
                </div>

                <div className="get-to-know-content">

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                </div>

              </article>
            ))}

          </div>

        </div>

      </section>

      {/* ================================
    HELP ME CHOOSE
================================ */}

      <section className="mac-help-section">

        <h2>Help Me Choose</h2>

        {helpMeChoose.map((item) => (
          <div className="mac-help-card" key={item.id}>

            <div className="mac-help-content">

              <h2>{item.title}</h2>

              <p>{item.description}</p>

              {item.button_url ? (
                <a
                  href={item.button_url}
                  className="mac-help-button"
                >
                  {item.button_text}
                </a>
              ) : (
                <button className="mac-help-button">
                  {item.button_text}
                </button>
              )}

            </div>

            <div className="mac-help-image">
              <img
                src={item.image_url}
                alt={item.title}
              />
            </div>

          </div>
        ))}

      </section>




      {/* ================================
    SWITCH TO MAC
================================ */}

      <section className="switch-mac-section">

        <div className="switch-mac-container">

          <h2>Switch to Mac.</h2>

          <div className="switch-mac-grid">

            {/* LEFT CARD */}
            <article className="switch-mac-card">

              <div className="switch-mac-content">

                <h3>
                  Give us the old. Save on
                  <br />
                  the new.
                </h3>

                <p>
                  With Apple Trade In, you can get a great value for
                  your current device and apply it toward a new one.
                  If your device isn't eligible for credit, we'll recycle
                  it for free.
                </p>

                <a href="#" className="switch-mac-link">
                  See what your device is worth ›
                </a>

              </div>

              <div className="switch-mac-image">
                <img
                  src={TradeIn}
                  alt="Apple Trade In"
                />
              </div>

            </article>


            {/* RIGHT CARD */}
            <article className="switch-mac-card">

              <div className="switch-mac-content">

                <h3>Mac does that.</h3>

                <p>
                  See how easy it is to move to Mac.
                </p>

                <a href="#" className="switch-mac-link">
                  Learn more ›
                </a>

              </div>

              <div className="switch-mac-image">
                <img
                  src={SwitchMac}
                  alt="Mac experience"
                />
              </div>

            </article>

          </div>

        </div>

      </section>

      {/* ================================
    MAC ESSENTIALS
================================ */}

      <section className="mac-essentials-section">

        <div className="mac-essentials-container">

          <h2>Mac essentials.</h2>

          <div className="mac-essentials-grid">

            {/* =========================
          MAC ACCESSORIES
      ========================= */}

            <article className="mac-essential-card">

              <div className="mac-essential-content">

                <h3>Mac accessories</h3>

                <p>
                  Explore keyboards, mice, and other essentials.
                </p>

                <a
                  href="#"
                  className="mac-essential-link"
                >
                  Shop Mac accessories ›
                </a>

              </div>

              <div className="mac-essential-image">

                <img
                  src={MacAccessories}
                  alt="Mac accessories"
                />

              </div>

            </article>


            {/* =========================
          STUDIO DISPLAY
      ========================= */}

            <article className="mac-essential-card">

              <div className="mac-essential-content">

                <h3>Studio Display</h3>

                <p>
                  The 27-inch 5K Retina display pairs beautifully
                  <br className="desktop-break" />
                  with Mac.
                </p>

                <a
                  href="#"
                  className="mac-essential-link"
                >
                  Learn more ›
                </a>

              </div>

              <div className="mac-essential-image">

                <img
                  src={StudioDisplay}
                  alt="Studio Display"
                />

              </div>

            </article>

          </div>

        </div>

      </section>

      {/* =========================================
    UNLOCK THE WORLD OF APPLE
========================================= */}

      <section className="apple-world-section">

        {/* Header */}

        <div className="apple-world-header">

          <h2>
            Unlock the world of Apple.
          </h2>

          <a href="#">
            Learn how Apple devices work better together
            <span>›</span>
          </a>

        </div>


        {/* Main Card */}

        <div className="apple-world-card">

          {/* LEFT ACCORDION */}

          <div className="apple-world-accordion">

            {/* Mac and iPhone */}

            <div
              className={`apple-world-item ${activeAppleWorld === 0 ? "active" : ""
                }`}
            >

              <button
                className="apple-world-button"
                onClick={() =>
                  setActiveAppleWorld(
                    activeAppleWorld === 0 ? -1 : 0
                  )
                }
              >

                <span>
                  Mac and iPhone
                </span>

                <span className="apple-world-arrow">
                  {activeAppleWorld === 0 ? "⌃" : "⌄"}
                </span>

              </button>


              {activeAppleWorld === 0 && (
                <div className="apple-world-content">

                  <p>
                    Make and receive iPhone calls on your Mac,
                    send messages, and continue your work
                    seamlessly across devices.
                  </p>

                </div>
              )}

            </div>


            {/* Mac and iPad */}

            <div
              className={`apple-world-item ${activeAppleWorld === 1 ? "active" : ""
                }`}
            >

              <button
                className="apple-world-button"
                onClick={() =>
                  setActiveAppleWorld(
                    activeAppleWorld === 1 ? -1 : 1
                  )
                }
              >

                <span>
                  Mac and iPad
                </span>

                <span className="apple-world-arrow">
                  {activeAppleWorld === 1 ? "⌃" : "⌄"}
                </span>

              </button>


              {activeAppleWorld === 1 && (
                <div className="apple-world-content">

                  <p>
                    Use your iPad alongside your Mac to
                    extend your workspace and move
                    between devices easily.
                  </p>

                </div>
              )}

            </div>


            {/* Mac and Apple Watch */}

            <div
              className={`apple-world-item ${activeAppleWorld === 2 ? "active" : ""
                }`}
            >

              <button
                className="apple-world-button"
                onClick={() =>
                  setActiveAppleWorld(
                    activeAppleWorld === 2 ? -1 : 2
                  )
                }
              >

                <span>
                  Mac and Apple Watch
                </span>

                <span className="apple-world-arrow">
                  {activeAppleWorld === 2 ? "⌃" : "⌄"}
                </span>

              </button>


              {activeAppleWorld === 2 && (
                <div className="apple-world-content">

                  <p>
                    Automatically log in to your Mac when
                    you're wearing your Apple Watch nearby.
                  </p>

                </div>
              )}

            </div>

          </div>


          {/* RIGHT IMAGE */}

          <div className="apple-world-image">

            <img
              src={AppleWorld}
              alt="Mac working with Apple devices"
            />

          </div>

        </div>

      </section>

      {/* =========================================
    MAC FOOTER NAVIGATION
========================================= */}
     
     
      <section className="mac-footer-nav">

         <h1 style={{ fontSize: "2.5rem", fontWeight: "bold",paddingLeft: "4rem",paddingTop: "6rem" ,paddingBottom: "3rem"}}>MAC</h1>

        <div className="mac-footer-container">

          {/* =========================
        EXPLORE MAC
    ========================= */}

          <div className="mac-footer-column">

            <h3>Explore Mac</h3>

            <Link to="#">Explore All Mac</Link>
            <Link to="#">MacBook Neo</Link>
            <Link to="#">MacBook Air</Link>
            <Link to="#">MacBook Pro</Link>
            <Link to="#">iMac</Link>
            <Link to="#">Mac mini</Link>
            <Link to="#">Mac Studio</Link>
            <Link to="#">Displays</Link>
            <Link to="#">Compare Mac</Link>
            <Link to="#">Switch from PC to Mac</Link>

          </div>


          {/* =========================
        SHOP MAC
    ========================= */}

          <div className="mac-footer-column">

            <h3>Shop Mac</h3>

            <Link to="#">Shop Mac</Link>
            <Link to="#">Help Me Choose</Link>
            <Link to="#">Mac Accessories</Link>
            <Link to="#">Apple Upgrade</Link>
            <Link to="#">Apple Trade In</Link>
            <Link to="#">Financing</Link>
            <Link to="#">Personal Setup</Link>
            <Link to="#">College Student Offer</Link>

          </div>


          {/* =========================
        MORE FROM MAC
    ========================= */}

          <div className="mac-footer-column">

            <h3>More from Mac</h3>

            <Link to="#">Mac Support</Link>
            <Link to="#">AppleCare</Link>
            <Link to="#">macOS 27</Link>
            <Link to="#">Apple Intelligence and Siri</Link>
            <Link to="#">Apps by Apple</Link>
            <Link to="#">Apple Creator Studio</Link>
            <Link to="#">Better with iPhone</Link>
            <Link to="#">iCloud+</Link>
            <Link to="#">Mac for Business</Link>
            <Link to="#">Education</Link>
            <Link to="#">Apple at Work</Link>

          </div>

        </div>

      </section>
    </>

  );
}

export default Mac;