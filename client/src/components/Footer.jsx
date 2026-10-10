import React from "react";
import "./Footer.css";

function FooterColumn({ title, links }) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>

      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href || "#"}>
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="apple-footer">

      {/* =================================
          LEGAL NOTES
      ================================= */}

      <div className="footer-notes">

        <p>
          * Available for Qualified Purchasers only. Qualified Purchasers
          receive an Apple Gift Card when they purchase an eligible Mac or
          iPad (“Eligible Product”) at a Qualifying Location through
          September 24, 2026. Gift card values may vary by Eligible Product.
          Customers will receive a discount equal to the value of the Apple
          Gift Card off the price of the Eligible Product, but will be charged
          for all items in their cart, including the Apple Gift Card. Only one
          Apple Gift Card per Eligible Product per Qualified Purchaser.
          Offer subject to availability. While supplies last. Additional
          restrictions apply.{" "}
          <a href="#">View full offer terms here</a>.
        </p>

        <p>
          1. Based on data from an Apple-conducted study of heart rate
          accuracy, during July and August 2026, utilizing commercially
          available best-selling wearables available as of June 2026.{" "}
          <a href="#">
            For more information, visit apple.com/HRAccuracy
          </a>.
        </p>

        <p>
          2. For iCloud feature and system requirements, see{" "}
          <a href="#">iCloud feature and system requirements</a>.
          Some features require a Wi-Fi connection. Access to some
          services is limited to 10 devices. Some features are not
          available in all countries or regions.
        </p>

        <p>
          3. Apple Upgrade is a device leasing program available in the U.S.
          Leases are provided by Klarna, subject to eligibility and credit
          approval. Additional eligibility criteria apply. Device must be
          in good condition upon return; damage fees may apply.
        </p>

        <p>
          To access and use all Apple Card features and products available
          only to Apple Card users, you must add Apple Card to Wallet on an
          iPhone or iPad that supports and has the latest version of iOS or
          iPadOS.
        </p>

        <p>
          Apple Card is subject to credit approval, available only for
          qualifying applicants in the United States, and issued by Goldman
          Sachs Bank USA, Salt Lake City Branch.
        </p>

        <p>
          Apple Payments Services LLC, a subsidiary of Apple Inc., is a
          service provider of Goldman Sachs Bank USA for Apple Card and
          Savings accounts. Neither Apple Inc. nor Apple Payments Services
          LLC is a bank.
        </p>

        <p>
          A subscription is required for Apple Arcade, Apple Fitness+,
          Apple Music, and Apple TV.
        </p>

        <p>
          Features are subject to change. Some features, applications,
          and services may not be available in all regions or all languages.
        </p>

      </div>


      {/* =================================
          FOOTER LINK GROUPS
      ================================= */}

      <div className="footer-links">

        {/* ================================
            COLUMN 1
        ================================= */}

        <div className="footer-group">

          <FooterColumn
            title="Shop and Learn"
            links={[
              { name: "Store" },
              { name: "Mac" },
              { name: "iPad" },
              { name: "iPhone" },
              { name: "Watch" },
              { name: "Vision" },
              { name: "AirPods" },
              { name: "TV & Home" },
              { name: "AirTag" },
              { name: "Accessories" },
              { name: "Gift Cards" },
            ]}
          />

          <FooterColumn
            title="Apple Wallet"
            links={[
              { name: "Wallet" },
              { name: "Apple Card" },
              { name: "Apple Pay" },
              { name: "Apple Cash" },
            ]}
          />

        </div>


        {/* ================================
            COLUMN 2
        ================================= */}

        <div className="footer-group">

          <FooterColumn
            title="Account"
            links={[
              { name: "Manage Your Apple Account" },
              { name: "Apple Store Account" },
              { name: "iCloud.com" },
            ]}
          />

          <FooterColumn
            title="Entertainment"
            links={[
              { name: "Apple One" },
              { name: "Apple TV" },
              { name: "Apple Music" },
              { name: "Apple Arcade" },
              { name: "Apple Fitness+" },
              { name: "Apple News+" },
              { name: "Apple Podcasts" },
              { name: "Apple Books" },
              { name: "App Store" },
            ]}
          />

        </div>


        {/* ================================
            COLUMN 3
        ================================= */}

        <div className="footer-group">

          <FooterColumn
            title="Apple Store"
            links={[
              { name: "Find a Store" },
              { name: "Genius Bar" },
              { name: "Today at Apple" },
              { name: "Group Reservations" },
              { name: "Apple Camp" },
              { name: "Apple Store App" },
              { name: "Certified Refurbished" },
              { name: "Apple Upgrade" },
              { name: "Apple Trade In" },
              { name: "Financing" },
              { name: "Carrier Deals at Apple" },
              { name: "Order Status" },
              { name: "Shopping Help" },
            ]}
          />

        </div>


        {/* ================================
            COLUMN 4
        ================================= */}

        <div className="footer-group">

          <FooterColumn
            title="For Business"
            links={[
              { name: "Apple and Business" },
              { name: "Shop for Business" },
            ]}
          />

          <FooterColumn
            title="For Education"
            links={[
              { name: "Apple and Education" },
              { name: "Shop for K-12" },
              { name: "Shop for College" },
            ]}
          />

          <FooterColumn
            title="For Healthcare"
            links={[
              { name: "Apple and Healthcare" },
            ]}
          />

          <FooterColumn
            title="For Government"
            links={[
              { name: "Apple and Government" },
              { name: "Shop for Veterans and Military" },
              { name: "Shop for State and Local Employees" },
              { name: "Shop for Federal Employees" },
            ]}
          />

        </div>


        {/* ================================
            COLUMN 5
        ================================= */}

        <div className="footer-group">

          <FooterColumn
            title="Apple Values"
            links={[
              { name: "Accessibility" },
              { name: "Education" },
              { name: "Environment" },
              { name: "Inclusion and Diversity" },
              { name: "Privacy" },
              { name: "Racial Equity and Justice" },
              { name: "Supply Chain Innovation" },
            ]}
          />

          <FooterColumn
            title="About Apple"
            links={[
              { name: "Newsroom" },
              { name: "Apple Leadership" },
              { name: "Career Opportunities" },
              { name: "Investors" },
              { name: "Ethics & Compliance" },
              { name: "Events" },
              { name: "Contact Apple" },
            ]}
          />

        </div>

      </div>


      {/* =================================
          MORE WAYS TO SHOP
      ================================= */}

      <div className="footer-shop">

        <p>
          More ways to shop:{" "}
          <a href="#">Find an Apple Store</a>{" "}
          or{" "}
          <a href="#">other retailer</a>{" "}
          near you. Or call{" "}
          <a href="#">1-800-MY-APPLE</a>.
        </p>

      </div>


      {/* =================================
          FOOTER BOTTOM
      ================================= */}

      <div className="footer-bottom">

        <div className="copyright">
          Copyright © 2026 Apple Inc. All rights reserved.
        </div>

        <div className="footer-bottom-links">

          <a href="#">Privacy Policy</a>
          <span>|</span>

          <a href="#">Terms of Use</a>
          <span>|</span>

          <a href="#">Sales and Refunds</a>
          <span>|</span>

          <a href="#">Legal</a>
          <span>|</span>

          <a href="#">Site Map</a>

        </div>

      </div>


      {/* =================================
          COUNTRY
      ================================= */}

      <div className="footer-country">
        <a href="#">United States</a>
      </div>

    </footer>
  );
}

export default Footer;