
import React from "react";
import { Link } from "react-router-dom";
import "./userDashbaord.css";
import Navbar from "../components/Navbar";

const userDashboard = () => {
  const navigationItems = [
    { label: "Personal Information", path: "/account/personal-information" },
    { label: "Sign-In & Security", path: "/account/security", active: true },
    { label: "Payment & Shipping", path: "/account/payment-shipping" },
    { label: "Subscriptions", path: "/account/subscriptions" },
    { label: "Family", path: "/account/family" },
    { label: "Devices", path: "/account/devices" },
    { label: "Privacy", path: "/account/privacy" },
  ];

  const securityCards = [
    {
      title: "Email & Phone Numbers",
      icon: "✉",
      description: "birukman493@gmail.com",
    },
    {
      title: "Password",
      icon: "•••",
      description: "Last updated September 21, 2026",
    },
    {
      title: "Account Security",
      icon: "ⓘ",
      description: (
        <>
          Two-factor authentication
          <br />
          1 trusted phone number
        </>
      ),
    },
    {
      title: "App-Specific Passwords",
      icon: "•••",
      description: "View details",
    },
  ];

  return (

<>

 <Navbar/>
    <div className="account-security-page">
      <header className="account-security-header">
        <Link to="/account" className="account-security-logo">
          Account
        </Link>

        <Link to="/signin" className="account-security-signout">
          Sign Out
        </Link>
      </header>

      <div className="account-security-layout">
        <aside className="account-security-sidebar">
          <div className="account-security-profile">
            <div className="account-security-avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 4.5V21h16v-2.5c0-2.8-4.7-4.5-8-4.5Z" />
              </svg>
            </div>

            <div className="account-security-user-name">
              Account Demo
            </div>

            <div className="account-security-user-email">
              demo@example.com
            </div>
          </div>

          <nav aria-label="Account settings">
            <ul className="account-security-nav">
              {navigationItems.map((item) => (
                <li
                  key={item.label}
                  className={item.active ? "active" : ""}
                >
                  <Link
                    to={item.path}
                    aria-current={item.active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="account-security-content">
          <h1>Sign-In &amp; Security</h1>

          <p className="account-security-description">
            Manage settings related to signing in to your account,
            account security, as well as how to recover your data
            when you're having trouble signing in.
          </p>

          <div className="account-security-cards">
            {securityCards.map((card) => (
              <article className="account-security-card" key={card.title}>
                <div className="account-security-card-header">
                  <h2>{card.title}</h2>
                  <span aria-hidden="true">{card.icon}</span>
                </div>

                <div className="account-security-card-description">
                  {card.description}
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="account-security-pin"
            onClick={() =>
              window.alert("Support PIN is a demonstration feature.")
            }
          >
            <span aria-hidden="true">▤</span>
            Support PIN
          </button>
        </main>
      </div>

      <footer className="account-security-footer">
        <div className="account-security-footer-top">
          More ways to shop:{" "}
          <a href="https://www.apple.com/retail/">
            Find a Store
          </a>{" "}
          or other retailers near you.
        </div>

        <div className="account-security-footer-bottom">
          <span>
            Copyright © 2026. All rights reserved.
          </span>

          <nav aria-label="Legal links">
            <a href="https://www.apple.com/legal/privacy/">
              Privacy Policy
            </a>
            <a href="https://www.apple.com/legal/internet-services/terms/site.html">
              Terms of Use
            </a>
            <a href="https://www.apple.com/legal/">
              Legal
            </a>
          </nav>

          <span className="account-security-region">
            Account Demo
          </span>
        </div>
      </footer>
    </div>

    </>
  );
};

export default userDashboard;
