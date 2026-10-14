import React from "react";
import { Link } from "react-router-dom";
import "./Bag.css";

const Bag = () => {
  const profileItems = [
    { icon: "▱", label: "Orders", path: "/orders" },
    { icon: "♧", label: "Your Saves", path: "/saves" },
    { icon: "◉", label: "Sign up", path: "/signup" },
    { icon: "⊙", label: "Sign in", path: "/signin" },
  ];

  return (
    <main className="bag-page">
      <div className="bag-container">
        <section className="bag-empty">
          <h1>Your Bag is empty.</h1>

          <p className="bag-signin-message">
            <Link to="/signin">Sign in</Link> to see if you have any saved items
          </p>
        </section>

        <section className="bag-profile">
          <p className="bag-profile-heading">My Profile</p>

          <nav className="bag-profile-links">
            {profileItems.map((item) => (
              <Link
                to={item.path}
                className="bag-profile-link"
                key={item.label}
              >
                <span className="bag-profile-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
};

export default Bag;