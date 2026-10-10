import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./iPhone.css";

import Iphone17pro from "../assets/iphone8.png";
import Iphone17 from "../assets/iphone9.png";
import IphoneDeo from "../assets/iphone7.png";
import Iphonedeo from "../assets/iphone6.png";

import Iphone18 from "../assets/iphone1.png";
import Iphone18pro from "../assets/iphone2.png";
import Iphonepro from "../assets/iphone3.png";
import Iphonepromax from "../assets/iphone4.png";
import Iphone18max from "../assets/iphone5.png";

const iPhone = () => {
    const [iphoneProducts, setIphoneProducts] = useState([]);
    const [iphoneShoppingOffers, setIphoneShoppingOffers] = useState([]);
    const [iphoneFeatures, setIphoneFeatures] = useState([]);
    const [activeAppleWorld, setActiveAppleWorld] = useState(2);

    useEffect(() => {
        fetch("http://localhost:5000/api/products?category=iphone")
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch iPhone products");
                }

                return data;
            })
            .then((data) => {
                setIphoneProducts(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("iPhone products error:", error);
                setIphoneProducts([]);
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/iphone-shopping-offers")
            .then((res) => res.json())
            .then((data) => {
                setIphoneShoppingOffers(data);
            })
            .catch((error) => {
                console.error(
                    "Failed to load iPhone shopping offers:",
                    error
                );
            });
    }, []);



    useEffect(() => {
        fetch("http://localhost:5000/api/iphone-features")
            .then((res) => res.json())
            .then((data) => {
                setIphoneFeatures(data);
            })
            .catch((error) => {
                console.error(
                    "Failed to load iPhone features:",
                    error
                );
            });
    }, []);

    return (
        <>
            {/* =================================
          IPHONE PRODUCT CAROUSEL
      ================================= */}

            <section className="iphone-product-carousel">
                <div className="iphone-product-header">
                    <h2>iPhone</h2>
                </div>

                <div className="iphone-product-scroll">

                    {/* iPhone Duo */}
                    <Link to="#" className="iphone-product-card">
                        <div className="iphone-product-image">
                            <img
                                src={IphoneDeo}
                                alt="iPhone Duo"
                            />
                        </div>

                        <div className="iphone-product-info">
                            <span className="iphone-product-new">New</span>
                            <h3>iPhone Duo</h3>
                        </div>
                    </Link>

                    {/* iPhone 18 Pro */}
                    <Link to="#" className="iphone-product-card">
                        <div className="iphone-product-image">
                            <img
                                src={Iphone18}
                                alt="iPhone 18 Pro"
                            />
                        </div>

                        <div className="iphone-product-info">
                            <span className="iphone-product-new">New</span>
                            <h3>iPhone 18 Pro</h3>
                        </div>
                    </Link>

                    {/* iPhone Air */}
                    <Link to="#" className="iphone-product-card">
                        <div className="iphone-product-image">
                            <img
                                src={Iphone17}
                                alt="iPhone Air"
                            />
                        </div>

                        <div className="iphone-product-info">
                            <h3>iPhone Air</h3>
                        </div>
                    </Link>

                    {/* iPhone 17 */}
                    <Link to="#" className="iphone-product-card">
                        <div className="iphone-product-image">
                            <img
                                src={Iphone17pro}
                                alt="iPhone 17"
                            />
                        </div>

                        <div className="iphone-product-info">
                            <h3>iPhone 17</h3>
                        </div>
                    </Link>

                    {/* iPhone 17e */}
                    <Link to="#" className="iphone-product-card">
                        <div className="iphone-product-image">
                            <img
                                src={Iphone18max}
                                alt="iPhone 17e"
                            />
                        </div>

                        <div className="iphone-product-info">
                            <h3>iPhone 17e</h3>
                        </div>
                    </Link>

                    {/* iPhone 16 */}
                    <Link to="#" className="iphone-product-card">
                        <div className="iphone-product-image">
                            <img
                                src={Iphone18}
                                alt="iPhone 16"
                            />
                        </div>

                        <div className="iphone-product-info">
                            <h3>iPhone 16</h3>
                        </div>
                    </Link>

                    {/* Compare */}
                    <Link
                        to="#"
                        className="iphone-product-card iphone-product-simple"
                    >
                        <div className="iphone-product-icon">
                            ⇄
                        </div>

                        <div className="iphone-product-info">
                            <h3>Compare</h3>
                        </div>
                    </Link>

                    {/* Accessories */}
                    <Link
                        to="#"
                        className="iphone-product-card iphone-product-simple"
                    >
                        <div className="iphone-product-icon">
                            ◇
                        </div>

                        <div className="iphone-product-info">
                            <h3>Accessories</h3>
                        </div>
                    </Link>

                    {/* Shop iPhone */}
                    <Link
                        to="#"
                        className="iphone-product-card iphone-product-simple"
                    >
                        <div className="iphone-product-icon">
                            🛍
                        </div>

                        <div className="iphone-product-info">
                            <h3>Shop iPhone</h3>
                        </div>
                    </Link>

                </div>
            </section>

            {/* =================================
          IPHONE DUO HERO
      ================================= */}

            <section className="iphone-duo-section">

                {/* TOP CONTENT */}

                <div className="iphone-duo-header">

                    <div className="iphone-duo-title">
                        <h1>iPhone Duo</h1>
                        <p>Hello, hello.</p>
                    </div>

                    <div className="iphone-duo-actions">

                        <Link
                            to="#"
                            className="iphone-duo-learn"
                        >
                            Learn More
                        </Link>

                        <Link
                            to="#"
                            className="iphone-duo-pricing"
                        >
                            View pricing <span>›</span>
                        </Link>

                    </div>

                </div>

                {/* HORIZONTAL DEVICE AREA */}

                <div className="iphone-duo-scroll">

                    <Link
                        to="#"
                        className="iphone-duo-device-link"
                    >
                        <div className="iphone-duo-device">

                            <img
                                src={Iphonedeo}
                                alt="iPhone Duo"
                            />

                        </div>
                    </Link>

                </div>

            </section>

            {/* =================================
          IPHONE LINEUP
      ================================= */}

            <section className="iphone-lineup">

                {/* HEADER */}

                <div className="iphone-lineup-header">

                    <h2>Explore the lineup.</h2>

                    <Link to="#">
                        Compare all models <span>›</span>
                    </Link>

                </div>

                {/* HORIZONTAL PRODUCTS */}

                <div className="iphone-lineup-scroll">

                    {iphoneProducts.map((product) => (

                        <div
                            className="iphone-lineup-card"
                            key={product.id}
                        >

                            {/* PRODUCT IMAGE */}

                            <div className="iphone-lineup-image">

                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                />

                            </div>

                            {/* PRODUCT CONTENT */}

                            <div className="iphone-lineup-content">

                                {product.badge_text && (
                                    <span className="iphone-lineup-badge">
                                        {product.badge_text}
                                    </span>
                                )}

                                <h3>
                                    {product.title}
                                </h3>

                                <p className="iphone-lineup-description">
                                    {product.description}
                                </p>

                                {/* PURCHASE PRICE */}

                                <p className="iphone-lineup-price">

                                    From{" "}

                                    <strong>
                                        {product.price_upfront}
                                    </strong>

                                    {product.price_monthly && (
                                        <>
                                            {" "}or{" "}

                                            <strong>
                                                {product.price_monthly}
                                            </strong>

                                            /mo. for 24 mo.
                                        </>
                                    )}

                                </p>

                                {/* LEASE */}

                                {product.lease_monthly && (
                                    <p className="iphone-lineup-lease">

                                        Lease from{" "}

                                        <strong>
                                            {product.lease_monthly}
                                        </strong>

                                        {" "}for 24 mo. with Apple Upgrade

                                    </p>
                                )}

                                {/* ACTIONS */}

                                <div className="iphone-lineup-actions">

                                    <Link
                                        to={product.learn_more_link || "#"}
                                        className="iphone-lineup-learn"
                                    >
                                        Learn more
                                    </Link>

                                    <Link
                                        to={product.buy_link || "#"}
                                        className="iphone-lineup-buy"
                                    >
                                        {product.buy_text || "Buy"}

                                        <span>›</span>
                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

            {/* =================================
    IPHONE SHOPPING OFFERS
================================= */}

            <section className="iphone-shopping">

                {/* HEADER */}

                <div className="iphone-shopping-header">

                    <h2>
                        Why Apple is the best <br /> place to shop iPhone.
                    </h2>

                    <Link
                        to="#"
                        className="iphone-shopping-top-link"
                    >
                        Shop iPhone <span>›</span>
                    </Link>

                </div>

                {/* HORIZONTAL OFFERS */}

                <div className="iphone-shopping-scroll">

                    {iphoneShoppingOffers.map((offer) => (

                        <div
                            className="iphone-shopping-card"
                            key={offer.id}
                        >

                            {/* IMAGE */}

                            <div className="iphone-shopping-image">

                                <img
                                    src={offer.image_url}
                                    alt={offer.title}
                                />

                            </div>

                            {/* CONTENT */}

                            <div className="iphone-shopping-content">

                                <span className="iphone-shopping-category">
                                    {offer.category_label}
                                </span>

                                <h3>
                                    {offer.title}
                                </h3>

                                <p>
                                    {offer.description}
                                </p>

                                <Link
                                    to={offer.link_url || "#"}
                                    className="iphone-shopping-link"
                                >
                                    {offer.link_text || "Learn more"}
                                    <span>›</span>
                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

            {/* =================================
    GET TO KNOW IPHONE
================================= */}

            <section className="iphone-features">

                {/* HEADER */}

                <div className="iphone-features-header">

                    <h2>Get to know iPhone.</h2>

                </div>

                {/* HORIZONTAL FEATURE CARDS */}

                <div className="iphone-features-scroll">

                    {iphoneFeatures.map((feature) => (

                        <Link
                            key={feature.id}
                            to={feature.link_url || "#"}
                            className="iphone-feature-card"
                        >

                            {/* IMAGE */}

                            <div className="iphone-feature-image">

                                <img
                                    src={feature.image_url}
                                    alt={feature.title}
                                />

                            </div>

                            {/* TEXT */}

                            <div className="iphone-feature-content">

                                <span className="iphone-feature-category">
                                    {feature.category_label}
                                </span>

                                <h3>
                                    {feature.title}
                                </h3>

                            </div>

                        </Link>

                    ))}

                </div>

            </section>


            {/* =================================
    IPHONE ESSENTIALS
================================= */}

            <section className="iphone-essentials">

                <div className="iphone-essentials-header">
                    <h2>iPhone essentials.</h2>

                    <Link
                        to="#"
                        className="iphone-essentials-top-link"
                    >
                        All iPhone accessories <span>›</span>
                    </Link>
                </div>

                <div className="iphone-essentials-scroll">

                    {/* iPhone Accessories */}
                    <div className="iphone-essential-card">



                        <div className="iphone-essential-content">

                            <span className="iphone-essential-category">
                                iPhone accessories
                            </span>

                            <h3>iPhone accessories</h3>

                            <p>
                                Protect and personalize your iPhone with fresh
                                accessories like a MagSafe case, iPhone Duo Folio
                                with Kickstand, MagSafe charger, and more.
                            </p>

                            <Link
                                to="#"
                                className="iphone-essential-link"
                            >
                                Shop iPhone accessories <span>›</span>
                            </Link>

                        </div>


                        <div className="iphone-essential-image">
                            <img
                                src={Iphonepro}
                                alt="iPhone accessories"
                            />
                        </div>

                    </div>

                    {/* AirTag */}
                    <div className="iphone-essential-card">



                        <div className="iphone-essential-content">

                            <span className="iphone-essential-category">
                                AirTag
                            </span>

                            <h3>AirTag</h3>

                            <p>
                                Now with a 50 percent louder speaker and up to a
                                1.5x greater Precision Finding range,¹⁵ it's easier
                                than ever to keep track of what matters.
                            </p>

                            <Link
                                to="#"
                                className="iphone-essential-link"
                            >
                                Buy <span>›</span>
                            </Link>

                        </div>

                        <div className="iphone-essential-image">
                            <img
                                src={Iphonepromax}
                                alt="AirTag"
                            />
                        </div>

                    </div>

                </div>

            </section>



            {/* =========================
    SIGNIFICANT OTHERS
========================= */}
            <section className="apple-world-section">
                <div className="apple-world-container">

                    <h2 className="apple-world-title">
                        Significant others.
                    </h2>

                    <div className="apple-world-content">

                        {/* LEFT: ACCORDION */}
                        <div className="apple-world-accordion">

                            {/* iPhone and Mac */}
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
                                    <span>iPhone and Mac</span>
                                    <span className="apple-world-chevron">
                                        {activeAppleWorld === 0 ? "⌃" : "⌄"}
                                    </span>
                                </button>

                                {activeAppleWorld === 0 && (
                                    <p className="apple-world-description">
                                        Copy and paste between your iPhone and Mac,
                                        answer calls from your Mac, and seamlessly
                                        share files with AirDrop.
                                    </p>
                                )}
                            </div>

                            {/* iPhone and Apple Watch */}
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
                                    <span>iPhone and Apple Watch</span>
                                    <span className="apple-world-chevron">
                                        {activeAppleWorld === 1 ? "⌃" : "⌄"}
                                    </span>
                                </button>

                                {activeAppleWorld === 1 && (
                                    <p className="apple-world-description">
                                        Unlock new ways to stay connected. Track your
                                        activity, receive notifications, and keep
                                        important information close at hand.
                                    </p>
                                )}
                            </div>

                            {/* iPhone and AirPods */}
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
                                    <span>iPhone and AirPods</span>
                                    <span className="apple-world-chevron">
                                        {activeAppleWorld === 2 ? "⌃" : "⌄"}
                                    </span>
                                </button>

                                {activeAppleWorld === 2 && (
                                    <p className="apple-world-description">
                                        Set up AirPods on iPhone with just a tap.
                                        You'll love Adaptive Audio, which dynamically
                                        blends Transparency and Active Noise
                                        Cancellation to deliver the best listening
                                        experience.
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* RIGHT: IPHONE MUSIC PREVIEW */}
                        <div className="apple-world-image">
                            <img
                                src={Iphone17pro}
                                alt="iPhone displaying Apple Music Home and personalized stations"
                            />
                        </div>

                    </div>
                </div>
            </section>

        </>
    );
};

export default iPhone;