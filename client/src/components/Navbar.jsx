import React, { useState } from "react";
import "./Navbar.css";
import AppleLogo from "../assets/gemini-svg.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);

  const navItems = [
    { name: "Store", path: "/store" },
    { name: "Mac", path: "/mac" },
    { name: "iPad", path: "/ipad" },
    { name: "iPhone", path: "/iphone" },
    { name: "Watch", path: "/watch" },
    { name: "Vision", path: "/vision" },
    { name: "AirPods", path: "/airpods" },
    { name: "TV & Home", path: "/tv-home" },
    { name: "Entertainment", path: "/entertainment" },
    { name: "Accessories", path: "/accessories" },
    { name: "Support", path: "/support" },
  ];

  const openMenu = (menu) => {
    setActiveMenu(menu);
    setSearchOpen(false);
    setBagOpen(false);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setBagOpen(false);
    setActiveMenu(null);
  };

  const openBag = () => {
    setBagOpen(true);
    setSearchOpen(false);
    setActiveMenu(null);
  };

  return (
    <nav className="apple-navbar">

      {/* =========================
          Main Navbar
      ========================= */}

      <div className="navbar-container">

        {/* Mobile Menu Button */}

        <button
          className="mobile-menu d-lg-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <i className={menuOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
        </button>

        {/* Apple Logo */}

        <Link to="/" className="apple-logo">
          <img src={AppleLogo} alt="Apple" />
        </Link>

        {/* =========================
            Desktop Navigation
        ========================= */}

        <div className="nav-links d-none d-lg-flex">

          {/* =========================
              STORE
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("store")}
            onMouseLeave={closeMenu}
          >
            <Link to="/store">
              Store
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "store" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Shop
                  </span>

                  <Link to="/store/latest">
                    Shop the Latest
                  </Link>
                  <Link to="/mac">
                    Mac
                  </Link>
                  <Link to="/ipad">
                    iPad
                  </Link>
                  <Link to="/iphone">
                    iPhone
                  </Link>
                  <Link to="/watch">
                    Apple Watch
                  </Link>
                  <Link to="/vision">
                    Apple Vision Pro
                  </Link>
                  <Link to="/airpods">
                    AirPods
                  </Link>
                  <Link to="/accessories">
                    Accessories
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Quick Links
                  </span>

                  <Link to="/store/find">
                    Find a Store
                  </Link>
                  <Link to="/store/orders">
                    Order Status
                  </Link>
                  <Link to="/store/upgrade">
                    Apple Upgrade
                  </Link>
                  <Link to="/store/trade-in">
                    Apple Trade In
                  </Link>
                  <Link to="/store/financing">
                    Financing
                  </Link>
                  <Link to="/store/setup">
                    Personal Setup
                  </Link>
                  <Link to="/store/student-offer">
                    College Student Offer
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Shop Special Stores
                  </span>

                  <Link to="/store/refurbished">
                    Certified Refurbished
                  </Link>
                  <Link to="/store/education">
                    Education
                  </Link>
                  <Link to="/store/business">
                    Business
                  </Link>
                  <Link to="/store/military">
                    Veterans and Military
                  </Link>
                  <Link to="/store/government">
                    Government
                  </Link>
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              MAC
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("mac")}
            onMouseLeave={closeMenu}
          >
            <Link to="/mac">
              Mac
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "mac" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Explore Mac
                  </span>

                  <Link to="/mac">
                    Explore All Mac
                  </Link>
                  <Link to="/mac/macbook-neo">
                    MacBook Neo
                  </Link>
                  <Link to="/mac/macbook-air">
                    MacBook Air
                  </Link>
                  <Link to="/mac/macbook-pro">
                    MacBook Pro
                  </Link>
                  <Link to="/mac/imac">
                    iMac
                  </Link>
                  <Link to="/mac/mac-mini">
                    Mac mini
                  </Link>
                  <Link to="/mac/mac-studio">
                    Mac Studio
                  </Link>
                  <Link to="/mac/displays">
                    Displays
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Shop Mac
                  </span>

                  <Link to="/mac/shop">
                    Shop Mac
                  </Link>
                  <Link to="/mac/help-me-choose">
                    Help Me Choose
                  </Link>
                  <Link to="/mac/accessories">
                    Mac Accessories
                  </Link>
                  <Link to="/mac/upgrade">
                    Apple Upgrade
                  </Link>
                  <Link to="/mac/trade-in">
                    Apple Trade In
                  </Link>
                  <Link to="/mac/financing">
                    Financing
                  </Link>
                  <Link to="/mac/setup">
                    Personal Setup
                  </Link>
                  <Link to="/mac/student-offer">
                    College Student Offer
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    More from Mac
                  </span>

                  <Link to="/mac/support">
                    Mac Support
                  </Link>
                  <Link to="/mac/applecare">
                    AppleCare
                  </Link>
                  <Link to="/mac/macos">
                    macOS
                  </Link>
                  <Link to="/mac/apple-intelligence">
                    Apple Intelligence and Siri
                  </Link>
                  <Link to="/mac/apps">
                    Apps by Apple
                  </Link>
                  <Link to="/mac/creator-studio">
                    Apple Creator Studio
                  </Link>
                  <Link to="/mac/iphone">
                    Better with iPhone
                  </Link>
                  <Link to="/mac/icloud">
                    iCloud+
                  </Link>
                  <Link to="/mac/business">
                    Mac for Business
                  </Link>
                  <Link to="/mac/education">
                    Education
                  </Link>
                  <Link to="/mac/work">
                    Apple at Work
                  </Link>
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              IPAD
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("ipad")}
            onMouseLeave={closeMenu}
          >
            <Link to="/ipad">
              iPad
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "ipad" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Explore iPad
                  </span>

                  <Link to="/ipad">
                    Explore All iPad
                  </Link>
                  <Link to="/ipad/ipad-pro">
                    iPad Pro
                  </Link>
                  <Link to="/ipad/ipad-air">
                    iPad Air
                  </Link>
                  <Link to="/ipad">
                    iPad
                  </Link>
                  <Link to="/ipad/ipad-mini">
                    iPad mini
                  </Link>
                  <Link to="/ipad/apple-pencil">
                    Apple Pencil
                  </Link>
                  <Link to="/ipad/keyboards">
                    Keyboards
                  </Link>

                  <div className="store-extra-links">
                    <Link to="/ipad/compare">
                      Compare iPad
                    </Link>
                  </div>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Shop iPad
                  </span>

                  <Link to="/ipad/shop">
                    Shop iPad
                  </Link>
                  <Link to="/ipad/accessories">
                    iPad Accessories
                  </Link>
                  <Link to="/ipad/upgrade">
                    Apple Upgrade
                  </Link>
                  <Link to="/ipad/trade-in">
                    Apple Trade In
                  </Link>
                  <Link to="/ipad/financing">
                    Financing
                  </Link>
                  <Link to="/ipad/setup">
                    Personal Setup
                  </Link>
                  <Link to="/ipad/student-offer">
                    College Student Offer
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    More from iPad
                  </span>

                  <Link to="/ipad/support">
                    iPad Support
                  </Link>
                  <Link to="/ipad/applecare">
                    AppleCare
                  </Link>
                  <Link to="/ipad/ipados">
                    iPadOS 27
                  </Link>
                  <Link to="/ipad/apple-intelligence">
                    Apple Intelligence and Siri
                  </Link>
                  <Link to="/ipad/apps">
                    Apps by Apple
                  </Link>
                  <Link to="/ipad/creator-studio">
                    Apple Creator Studio
                  </Link>
                  <Link to="/ipad/icloud">
                    iCloud+
                  </Link>
                  <Link to="/ipad/education">
                    Education
                  </Link>
                  <Link to="/ipad/work">
                    Apple at Work
                  </Link>
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              IPHONE
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("iphone")}
            onMouseLeave={closeMenu}
          >
            <Link to="/iphone">
              iPhone
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "iphone" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Explore iPhone
                  </span>

                  <Link to="/iphone">
                    Explore All iPhone
                  </Link>
                  <Link to="/iphone/duo">
                    iPhone Duo
                  </Link>
                  <Link to="/iphone/18-pro">
                    iPhone 18 Pro
                  </Link>
                  <Link to="/iphone/air">
                    iPhone Air
                  </Link>
                  <Link to="/iphone/17">
                    iPhone 17
                  </Link>
                  <Link to="/iphone/17e">
                    iPhone 17e
                  </Link>
                  <Link to="/iphone/16">
                    iPhone 16
                  </Link>

                  <div className="store-extra-links">
                    <Link to="/iphone/compare">
                      Compare iPhone
                    </Link>
                    <Link to="/iphone/switch">
                      Switch from Android
                    </Link>
                  </div>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Shop iPhone
                  </span>

                  <Link to="/iphone/shop">
                    Shop iPhone
                  </Link>
                  <Link to="/iphone/accessories">
                    iPhone Accessories
                  </Link>
                  <Link to="/iphone/upgrade">
                    Apple Upgrade
                  </Link>
                  <Link to="/iphone/trade-in">
                    Apple Trade In
                  </Link>
                  <Link to="/iphone/carrier-deals">
                    Carrier Deals at Apple
                  </Link>
                  <Link to="/iphone/financing">
                    Financing
                  </Link>
                  <Link to="/iphone/setup">
                    Personal Setup
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    More from iPhone
                  </span>

                  <Link to="/iphone/support">
                    iPhone Support
                  </Link>
                  <Link to="/iphone/applecare">
                    AppleCare
                  </Link>
                  <Link to="/iphone/ios">
                    iOS 27
                  </Link>
                  <Link to="/iphone/apple-intelligence">
                    Apple Intelligence and Siri
                  </Link>
                  <Link to="/iphone/apps">
                    Apps by Apple
                  </Link>
                  <Link to="/iphone/privacy">
                    iPhone Privacy
                  </Link>
                  <Link to="/iphone/mac">
                    Better with Mac
                  </Link>
                  <Link to="/iphone/icloud">
                    iCloud+
                  </Link>
                  <Link to="/iphone/wallet">
                    Wallet, Pay, Card
                  </Link>
                  <Link to="/iphone/work">
                    Apple at Work
                  </Link>
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              WATCH
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("watch")}
            onMouseLeave={closeMenu}
          >
            <Link to="/watch">
              Watch
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "watch" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Explore Watch
                  </span>

                  <Link to="/watch">
                    Explore All Apple Watch
                  </Link>
                  <Link to="/watch/series-12">
                    Apple Watch Series 12
                  </Link>
                  <Link to="/watch/ultra-4">
                    Apple Watch Ultra 4
                  </Link>
                  <Link to="/watch/se-3">
                    Apple Watch SE 3
                  </Link>
                  <Link to="/watch/nike">
                    Apple Watch Nike
                  </Link>
                  <Link to="/watch/hermes">
                    Apple Watch Hermès
                  </Link>

                  <div className="store-extra-links">
                    <Link to="/watch/compare">
                      Compare Watch
                    </Link>
                    <Link to="/watch/why-apple-watch">
                      Why Apple Watch
                    </Link>
                  </div>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Shop Watch
                  </span>

                  <Link to="/watch/shop">
                    Shop Apple Watch
                  </Link>
                  <Link to="/watch/bands">
                    Apple Watch Bands
                  </Link>
                  <Link to="/watch/accessories">
                    Apple Watch Accessories
                  </Link>
                  <Link to="/watch/upgrade">
                    Apple Upgrade
                  </Link>
                  <Link to="/watch/trade-in">
                    Apple Trade In
                  </Link>
                  <Link to="/watch/financing">
                    Financing
                  </Link>
                  <Link to="/watch/setup">
                    Personal Setup
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    More from Watch
                  </span>

                  <Link to="/watch/support">
                    Apple Watch Support
                  </Link>
                  <Link to="/watch/applecare">
                    AppleCare
                  </Link>
                  <Link to="/watch/watchos">
                    watchOS 27
                  </Link>
                  <Link to="/watch/kids">
                    Apple Watch For Your Kids
                  </Link>
                  <Link to="/watch/apps">
                    Apps by Apple
                  </Link>
                  <Link to="/watch/fitness">
                    Apple Fitness+
                  </Link>
                  <Link to="/watch/education">
                    Education
                  </Link>
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              VISION
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("vision")}
            onMouseLeave={closeMenu}
          >
            <Link to="/vision">
              Vision
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "vision" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Explore Vision
                  </span>

                  <Link to="/vision">
                    Explore Apple Vision Pro
                  </Link>
                  <Link to="/vision/tech-specs">
                    Tech Specs
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Shop Vision
                  </span>

                  <Link to="/vision/shop">
                    Shop Apple Vision Pro
                  </Link>
                  <Link to="/vision/accessories">
                    Apple Vision Pro Accessories
                  </Link>
                  <Link to="/vision/demo">
                    Book a Demo
                  </Link>
                  <Link to="/vision/financing">
                    Financing
                  </Link>
                  <Link to="/vision/setup">
                    Personal Setup
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    More from Vision
                  </span>

                  <Link to="/vision/support">
                    Apple Vision Pro Support
                  </Link>
                  <Link to="/vision/applecare">
                    AppleCare
                  </Link>
                  <Link to="/vision/visionos">
                    visionOS 27
                  </Link>
                  <Link to="/vision/enterprise">
                    Apple Vision Pro for Enterprise
                  </Link>
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              AIRPODS
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("airpods")}
            onMouseLeave={closeMenu}
          >
            <Link to="/airpods">
              AirPods
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "airpods" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Explore AirPods
                  </span>

                  <Link to="/airpods">
                    Explore All AirPods
                  </Link>
                  <Link to="/airpods/airpods-5">
                    AirPods 5
                  </Link>
                  <Link to="/airpods/airpods-pro-3">
                    AirPods Pro 3
                  </Link>
                  <Link to="/airpods/airpods-max-2">
                    AirPods Max 2
                  </Link>

                  <div className="store-extra-links">
                    <Link to="/airpods/compare">
                      Compare AirPods
                    </Link>
                  </div>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Shop AirPods
                  </span>

                  <Link to="/airpods/shop/airpods-5">
                    Shop AirPods 5
                  </Link>
                  <Link to="/airpods/shop/airpods-pro-3">
                    Shop AirPods Pro 3
                  </Link>
                  <Link to="/airpods/shop/airpods-max-2">
                    Shop AirPods Max 2
                  </Link>
                  <Link to="/airpods/accessories">
                    AirPods Accessories
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    More from AirPods
                  </span>

                  <Link to="/airpods/support">
                    AirPods Support
                  </Link>
                  <Link to="/airpods/applecare">
                    AppleCare
                  </Link>
                  <Link to="/airpods/hearing-health">
                    Hearing Health
                  </Link>
                  <Link to="/airpods/apple-music">
                    Apple Music
                  </Link>
                  <Link to="/airpods/apple-fitness">
                    Apple Fitness+
                  </Link>
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              TV & HOME
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("tvHome")}
            onMouseLeave={closeMenu}
          >
            <Link to="/tv-home">
              TV & Home
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "tvHome" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Explore TV & Home
                  </span>

                  <Link to="/tv-home">
                    Explore TV & Home
                  </Link>
                  <Link to="/tv-home/apple-tv-4k">
                    Apple TV 4K
                  </Link>
                  <Link to="/tv-home/homepod">
                    HomePod
                  </Link>
                  <Link to="/tv-home/homepod-mini">
                    HomePod mini
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Shop TV & Home
                  </span>

                  <Link to="/tv-home/shop/apple-tv-4k">
                    Shop Apple TV 4K
                  </Link>
                  <Link to="/tv-home/shop/homepod">
                    Shop HomePod
                  </Link>
                  <Link to="/tv-home/shop/homepod-mini">
                    Shop HomePod mini
                  </Link>
                  <Link to="/tv-home/shop/siri-remote">
                    Shop Siri Remote
                  </Link>
                  <Link to="/tv-home/accessories">
                    TV & Home Accessories
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    More from TV & Home
                  </span>

                  <Link to="/tv-home/apple-tv-support">
                    Apple TV Support
                  </Link>
                  <Link to="/tv-home/homepod-support">
                    HomePod Support
                  </Link>
                  <Link to="/tv-home/applecare/apple-tv">
                    AppleCare for Apple TV
                  </Link>
                  <Link to="/tv-home/applecare/homepod">
                    AppleCare for HomePod
                  </Link>
                  <Link to="/tv-home/apple-tv-app">
                    Apple TV app
                  </Link>
                  <Link to="/tv-home/apple-tv-plus">
                    Apple TV+
                  </Link>
                  <Link to="/tv-home/home-app">
                    Home app
                  </Link>
                  <Link to="/tv-home/apple-music">
                    Apple Music
                  </Link>
                  <Link to="/tv-home/airplay">
                    AirPlay
                  </Link>
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              ENTERTAINMENT
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("entertainment")}
            onMouseLeave={closeMenu}
          >
            <Link to="/entertainment">
              Entertainment
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "entertainment" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Explore Entertainment
                  </span>

                  <Link to="/entertainment">
                    Explore Entertainment
                  </Link>
                  <Link to="/entertainment/apple-one">
                    Apple One
                  </Link>
                  <Link to="/entertainment/apple-tv">
                    Apple TV
                  </Link>
                  <Link to="/entertainment/apple-music">
                    Apple Music
                  </Link>
                  <Link to="/entertainment/apple-arcade">
                    Apple Arcade
                  </Link>
                  <Link to="/entertainment/apple-fitness-plus">
                    Apple Fitness+
                  </Link>
                  <Link to="/entertainment/apple-news-plus">
                    Apple News+
                  </Link>
                  <Link to="/entertainment/apple-podcasts">
                    Apple Podcasts
                  </Link>
                  <Link to="/entertainment/apple-books">
                    Apple Books
                  </Link>
                  <Link to="/entertainment/app-store">
                    App Store
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Support
                  </span>

                  <Link to="/entertainment/apple-tv-support">
                    Apple TV Support
                  </Link>
                  <Link to="/entertainment/apple-music-support">
                    Apple Music Support
                  </Link>
                </div>

                <div className="store-column">
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              ACCESSORIES
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("accessories")}
            onMouseLeave={closeMenu}
          >
            <Link to="/accessories">
              Accessories
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "accessories" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Shop by Product
                  </span>

                  <Link to="/accessories">
                    Shop All Accessories
                  </Link>
                  <Link to="/accessories/iphone">
                    iPhone
                  </Link>
                  <Link to="/accessories/ipad">
                    iPad
                  </Link>
                  <Link to="/accessories/mac">
                    Mac
                  </Link>
                  <Link to="/accessories/apple-watch">
                    Apple Watch
                  </Link>
                  <Link to="/accessories/apple-vision-pro">
                    Apple Vision Pro
                  </Link>
                  <Link to="/accessories/airpods">
                    AirPods
                  </Link>
                  <Link to="/accessories/tv-home">
                    TV & Home
                  </Link>
                  <Link to="/accessories/airtag">
                    AirTag
                  </Link>
                  <Link to="/accessories/beats">
                    Beats
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Shop by Category
                  </span>

                  <Link to="/accessories/headphones-speakers">
                    Headphones & Speakers
                  </Link>
                  <Link to="/accessories/chargers-adapters">
                    Chargers & Adapters
                  </Link>
                  <Link to="/accessories/smart-home">
                    Smart Home Essentials
                  </Link>
                  <Link to="/accessories/cases-protection">
                    Cases & Protection
                  </Link>
                  <Link to="/accessories/content-creation">
                    Content Creation
                  </Link>
                  <Link to="/accessories/gaming">
                    Gaming
                  </Link>
                  <Link to="/accessories/hard-drives-storage">
                    Hard Drives & Storage
                  </Link>
                  <Link to="/accessories/mice-keyboards">
                    Mice & Keyboards
                  </Link>
                  <Link to="/accessories/health-fitness">
                    Health & Fitness
                  </Link>
                  <Link to="/accessories/office-accessories">
                    Office Accessories
                  </Link>
                  <Link to="/accessories/software">
                    Software
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    More to Explore
                  </span>

                  <Link to="/accessories/new-arrivals">
                    New Arrivals
                  </Link>
                  <Link to="/accessories/made-by-apple">
                    Made by Apple
                  </Link>
                  <Link to="/accessories/accessibility">
                    Accessibility
                  </Link>
                  <Link to="/accessories/assistive-technologies">
                    Assistive Technologies
                  </Link>
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              SUPPORT
          ========================= */}

          <div
            className="nav-item-store"
            onMouseEnter={() => openMenu("support")}
            onMouseLeave={closeMenu}
          >
            <Link to="/support">
              Support
            </Link>

            <div
              className={`store-mega-menu ${
                activeMenu === "support" ? "store-menu-open" : ""
              }`}
            >
              <div className="store-menu-container">

                <div className="store-column store-column-large">
                  <span className="store-label">
                    Explore Support
                  </span>

                  <Link to="/support/iphone">
                    iPhone
                  </Link>
                  <Link to="/support/mac">
                    Mac
                  </Link>
                  <Link to="/support/ipad">
                    iPad
                  </Link>
                  <Link to="/support/watch">
                    Watch
                  </Link>
                  <Link to="/support/apple-vision-pro">
                    Apple Vision Pro
                  </Link>
                  <Link to="/support/airpods">
                    AirPods
                  </Link>
                  <Link to="/support/music">
                    Music
                  </Link>
                  <Link to="/support/tv">
                    TV
                  </Link>
                  <Link to="/support">
                    Explore Support
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Get Help
                  </span>

                  <Link to="/support/community">
                    Community
                  </Link>
                  <Link to="/support/check-coverage">
                    Check Coverage
                  </Link>
                  <Link to="/support/genius-bar">
                    Genius Bar
                  </Link>
                  <Link to="/support/repair">
                    Repair
                  </Link>
                </div>

                <div className="store-column">
                  <span className="store-label">
                    Helpful Topics
                  </span>

                  <Link to="/support/applecare">
                    Get AppleCare
                  </Link>
                  <Link to="/support/apple-account-password">
                    Apple Account and Password
                  </Link>
                  <Link to="/support/billing-subscriptions">
                    Billing & Subscriptions
                  </Link>
                  <Link to="/support/accessibility">
                    Accessibility
                  </Link>
                </div>

              </div>
            </div>
          </div>


          {/* =========================
              SEARCH
          ========================= */}

          {searchOpen && (
            <div
              className="search-overlay"
              onMouseLeave={() => setSearchOpen(false)}
            >
              <div className="search-menu">

                <div className="search-input-container">

                  <i className="bi bi-search"></i>

                  <input
                    type="text"
                    placeholder="Search apple.com"
                    autoFocus
                  />

                  <button
                    className="search-close"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close Search"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>

                </div>

                <div className="search-quick-links">

                  <span className="store-label">
                    Quick Links
                  </span>

                  <Link
                    to="/store"
                    onClick={() => setSearchOpen(false)}
                  >
                    Find a Store
                  </Link>

                  <Link
                    to="/vision"
                    onClick={() => setSearchOpen(false)}
                  >
                    Apple Vision Pro
                  </Link>

                  <Link
                    to="/airpods"
                    onClick={() => setSearchOpen(false)}
                  >
                    AirPods
                  </Link>

                  <Link
                    to="/apple-intelligence"
                    onClick={() => setSearchOpen(false)}
                  >
                    Apple Intelligence
                  </Link>

                  <Link
                    to="/trade-in"
                    onClick={() => setSearchOpen(false)}
                  >
                    Apple Trade In
                  </Link>

                </div>

              </div>
            </div>
          )}


          {/* =========================
              SHOPPING BAG
          ========================= */}

          {bagOpen && (
            <div
              className="search-overlay"
              onMouseLeave={() => setBagOpen(false)}
            >
              <div className="search-menu">

                <div className="bag-status">

                  <span className="store-label">
                    Shopping Bag Status
                  </span>

                  <h3>
                    Your Bag is empty.
                  </h3>

                  <p>
                    Sign in to see if you have any saved items
                  </p>

                </div>


                <div className="bag-profile">

                  <span className="store-label">
                    My Profile
                  </span>

                  <Link
                    to="/orders"
                    onClick={() => setBagOpen(false)}
                  >
                    Orders
                  </Link>

                  <Link
                    to="/your-saves"
                    onClick={() => setBagOpen(false)}
                  >
                    Your Saves
                  </Link>

                  <Link
                    to="/account"
                    onClick={() => setBagOpen(false)}
                  >
                    Account
                  </Link>

                  <Link
                    to="/signin"
                    onClick={() => setBagOpen(false)}
                  >
                    Sign in
                  </Link>

                </div>

              </div>
            </div>
          )}

        </div>


        {/* =========================
            Search + Bag
        ========================= */}

        <div className="nav-icons">

          {/* Search */}

          <button
            className="icon-button"
            aria-label="Search"
            onClick={openSearch}
          >
            <i className="bi bi-search"></i>
          </button>


          {/* Bag */}

          <button
            className="icon-button"
            aria-label="Bag"
            onClick={openBag}
          >
            <i className="bi bi-bag"></i>
          </button>

        </div>

      </div>


      {/* =========================
          Mobile Navigation
      ========================= */}

      <div
        className={`mobile-nav d-lg-none ${
          menuOpen ? "mobile-nav-open" : ""
        }`}
      >
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            onClick={() => setMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>

    </nav>
  );
};

export default Navbar;