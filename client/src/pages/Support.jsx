import React, {useState} from "react";
import './Support.css';
import iphone from '../assets/iphone5.png';
import mac from '../assets/mac5.png';
import ipad from '../assets/ipad5.png';
import watch from '../assets/watch5.jpg';
import vision from '../assets/vision11.jpg';
import airpods from '../assets/airpads1.jpg';
import support1 from '../assets/support1.png'
import support2 from '../assets/support2.png'
import support3 from '../assets/support3.png'
import support4 from '../assets/support4.png'




const Search = () => {
    const [isActive, setIsActive] = useState(false);
  return (
   
  <>
     
{/* APPLE SUPPORT HERO SECTION */}

<section className="apple-support-section">
  <div className="support-logo-container">
    <svg
      className="support-apple-logo"
      viewBox="0 0 170 170"
      width="48"
      height="48"
      aria-label="Apple"
      role="img"
    >
      <path
        fill="currentColor"
        d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.05-2.5-6.89-7.05-11.53-13.65-7.14-10.15-12.63-21.36-16.48-33.63-3.85-12.27-5.78-24.13-5.78-35.58 0-15.01 3.86-27.48 11.58-37.41 7.72-9.93 17.52-14.95 29.41-15.06 4.79 0 10.14 1.2 16.05 3.6 5.91 2.41 9.87 3.61 11.89 3.61 1.74 0 5.86-1.28 10.37-3.85 4.51-2.56 9.57-3.8 13.18-3.71 11.39.43 20.89 4.3 28.5 11.62-10.4 6.33-15.54 15.34-15.42 27.03.11 9.4 3.73 17.38 10.86 23.94 7.13 6.57 15.7 9.94 25.72 10.12-2.12 6.42-4.88 13.58-8.28 21.49zM119.22 31.33c0-7.79 2.82-15.03 8.46-21.72 5.64-6.69 12.69-10.42 21.15-11.19.11 1.09.16 2.07.16 2.94 0 7.95-2.88 15.34-8.63 22.18-5.75 6.84-12.87 10.59-21.36 11.26-.54-1.2-1.92-2.37-4.14-3.51-2.22-1.14-3.95-1.84-5.19-2.1-1.24-.26-1.39-.37-1.39-.34z"
      />
    </svg>
  </div>

  <h1>Apple Support</h1>
  <p className="support-subtitle">Need help? Start here.</p>

  <div className="support-category-grid">
    {[
      { name: "iPhone", image: iphone, link: "#" },
      { name: "Mac", image: mac, link: "#" },
      { name: "iPad", image: ipad, link: "#" },
      { name: "Watch", image: watch, link: "#" },
      { name: "Vision", image: vision, link: "#" },
      { name: "AirPods", image:airpods, link: "#" },
    ].map((item) => (
      <a
        href={item.link}
        className="support-category-item"
        key={item.name}
      >
        <div className="support-icon-wrap">
          <img src={item.image} alt={item.name} />
        </div>
        <span>{item.name}</span>
      </a>
    ))}
  </div>
</section>

<section className="support-cards-search-section">
  <div className="support-cards-grid">
    <a href="#" className="support-action-card">
      <div className="support-card-icon blue-icon">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
          <circle cx="8" cy="16" r="1" fill="currentColor" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
          <circle cx="16" cy="16" r="1" fill="currentColor" />
        </svg>
      </div>
      <span className="support-card-title">Reset Apple Account password</span>
    </a>

    <a href="#" className="support-action-card">
      <div className="support-card-icon red-icon">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <circle cx="9" cy="13" r="1" fill="currentColor" />
          <circle cx="12" cy="13" r="1" fill="currentColor" />
          <circle cx="15" cy="13" r="1" fill="currentColor" />
          <circle cx="9" cy="17" r="1" fill="currentColor" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      </div>
      <span className="support-card-title">Change a subscription</span>
    </a>

    <a href="#" className="support-action-card">
      <div className="support-card-icon green-icon">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2L19 4l-3-2-3 2-3-2-3 2z" />
          <line x1="8" y1="8" x2="16" y2="8" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="12" y2="16" />
        </svg>
      </div>
      <span className="support-card-title">Billing and payments</span>
    </a>
  </div>

 
 
</section>

<section className="search-topics-section">
     <h2 className="search-title">Search for More Topics</h2>

      <div
        className={`search-container ${isActive ? "active" : ""}`}
        id="searchContainer"
      >
        <div className="search-bar">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="#86868b"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            id="searchInput"
            placeholder="Search Support"
            aria-label="Search Support"
            onFocus={() => setIsActive(true)}
            onBlur={(e) => {
              if (!e.currentTarget.value.trim()) {
                setIsActive(false);
              }
            }}
          />
        </div>

        <div className="quick-links-dropdown">
          <p className="quick-links-title">Quick Links</p>
          <ul>
            <li>
              <a href="#">If you forgot your Apple Account password</a>
            </li>
            <li>
              <a href="#">
                If you forgot your iPhone passcode or your iPhone is disabled
              </a>
            </li>
            <li>
              <a href="#">
                If you want to cancel a subscription from Apple
              </a>
            </li>
            <li>
              <a href="#">Update your iPhone or iPad</a>
            </li>
            <li>
              <a href="#">Find your lost Apple device</a>
            </li>
          </ul>
        </div>
      </div>
    </section>

 <section className="support-cards-container">
      {/* AppleCare Card */}
      <div className="support-card">
        <div className="card-content">
          <h2>Handled with AppleCare</h2>
          <p>
            Every AppleCare plan provides one-stop service for your Apple
            products, with quick and easy repairs for accidents like drops
            and spills. You’re also covered if your iPhone, iPad, or Apple
            Watch is lost or stolen.
          </p>
          <a href="#" className="support-link">
            Learn more &gt;
          </a>
        </div>

        <div className="card-media apple-care-bg">
          <img
            src={support1}
            alt="AppleCare Devices"
          />
        </div>
      </div>

      {/* Apple Repair and Service Card */}
      <div className="support-card">
        <div className="card-content">
          <h2>Apple Repair and Service</h2>
          <p>
            We can help you find an Apple-certified repair, performed by
            trusted experts who use genuine Apple parts.
          </p>
          <a href="#" className="support-link">
            Start a repair &gt;
          </a>
        </div>

        <div className="card-media repair-bg">
          <img
            src={support2}
            alt="Apple Repair Service"
          />
        </div>
      </div>
    </section>

     <section className="more-to-explore-section">
      <h2 className="section-title">More to explore</h2>

      <div className="explore-grid">
        {/* YouTube Card */}
        <div className="explore-card">
          <div className="card-image-wrap youtube-bg">
            <img src={support3} alt="Apple Support on YouTube" />
          </div>

          <div className="card-details">
            <h3>Get to know your Apple device</h3>
            <p>
              Learn how to make the most of your Apple products with helpful
              tips, tutorials, and support videos.
            </p>
            <a href="#" className="explore-link">
              Visit Apple Support on YouTube &gt;
            </a>
          </div>
        </div>

        {/* Apple Support App Card */}
        <div className="explore-card">
          <div className="card-image-wrap today-bg">
            <img src={support4} alt="Apple Support app" />
          </div>

          <div className="card-details">
            <h3>Get help with the Apple Support app</h3>
            <p>
              Get personalized support for all your Apple products in one
              convenient place.
            </p>
            <a href="#" className="explore-link">
              Download the app &gt;
            </a>
          </div>
        </div>
      </div>
    </section>

    <section className="info-cards-section">
      {/* Designing for Longevity */}
      <div className="info-card full-card">
        <h2>Designing for longevity</h2>

        <p>
          At Apple, we are always working to create the best experience for
          our customers, which is why we design products that last. Designing
          for longevity is a company-wide effort, informing our earliest
          decisions long before the first prototype is built and guided by
          historical customer-use data and predictions on future usage. It
          requires striking a balance between durability and repairability
          while not compromising on safety, security, and privacy.
        </p>

        <p className="sub-text">
          Learn more about Apple's approach to designing for longevity, which
          includes access to safe and reliable repairs.{" "}
          <a href="#" className="inline-link">
            View (PDF)
          </a>
        </p>
      </div>

      {/* Bottom Cards */}
      <div className="bottom-grid">
        {/* Counterfeit Parts */}
        <div className="info-card">
          <h2>Beware of counterfeit parts</h2>

          <p>
            Some counterfeit and third party power adapters and batteries may
            not be designed properly and could result in safety issues. To
            ensure you receive a genuine Apple battery during a battery
            replacement, we recommend visiting an{" "}
            <a href="#" className="inline-link">Apple Store</a> or{" "}
            <a href="#" className="inline-link">
              Apple Authorized Service Provider
            </a>
            . If you need a replacement adapter to charge your Apple device,
            we recommend getting an Apple power adapter.
          </p>

          <p>
            Also non-genuine replacement displays may have compromised visual
            quality and may fail to work correctly. Apple-certified screen
            repairs are performed by trusted experts who use genuine Apple
            parts.
          </p>
        </div>

        {/* Gift Card Scams */}
        <div className="info-card">
          <div className="card-icon-header">
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="8" width="18" height="13" rx="2" />
              <path d="M12 3v5" />
              <path d="M12 3c-2 0-4 2-4 3s2 3 4 3 4-2 4-3-2-3-4-3z" />
              <line x1="3" y1="13" x2="21" y2="13" />
            </svg>
          </div>

          <h2>Be aware of gift card scams</h2>

          <p>
            Be aware of scams involving Apple Gift Cards, App Store &amp;
            iTunes Gift Cards, and Apple Store Gift Cards.
          </p>

          <a href="#" className="support-link">
            Learn more &gt;
          </a>
        </div>
      </div>
    </section>

     <section className="service-programs-section">
      <h2>Apple Service Programs</h2>

      <ul className="service-programs-list">
        <li>
          <a
            href="https://support.apple.com/mac-mini-2023-service-program-for-no-power-issue"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mac mini Service Program for No Power Issue
          </a>
        </li>

        <li>
          <a
            href="https://support.apple.com/iphone-14-plus-service-program-for-rear-camera-issue"
            target="_blank"
            rel="noopener noreferrer"
          >
            iPhone 14 Plus Service Program for Rear Camera Issue
          </a>
        </li>

        <li>
          <a
            href="https://support.apple.com/15-inch-macbook-pro-battery-recall"
            target="_blank"
            rel="noopener noreferrer"
          >
            15-inch MacBook Pro Battery Recall Program
          </a>
        </li>

        <li>
          <a
            href="https://support.apple.com/service-programs"
            target="_blank"
            rel="noopener noreferrer"
          >
            See all programs
          </a>
        </li>
      </ul>
    </section>
  </>
  )
};

export default Search;