import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-apple.jpg";
import "./Hero.css";
import iPhone_image from "../assets/iphone.png";
import padd from "../assets/padd.jpg";

const Hero = () => {
  return (
    <>
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-content">
          <h1>Surprise and shine.</h1>

          <p>
            Watch a special Apple Event online on 9/9 at 10 a.m. PT.
          </p>

          <Link to="/store" className="hero-button" style={{ textDecoration: "none", display: "inline-block" }}>
            Add to calendar
          </Link>
        </div>
      </section>

      <section className="hero" style={{ backgroundImage: `url(${iPhone_image})` }}>
        <div className="hero-content iphone-content">
          <p>iPhone</p>
          <h4>Meet the latest iPhone LineUp</h4>
          <Link to="/iphone" className="iphone-btn" style={{ textDecoration: "none", display: "inline-block" }}>
            Learn More
          </Link>
          <Link to="/iphone" className="iphone-gtb" style={{ textDecoration: "none", display: "inline-block" }}>
            Shop iPhone
          </Link>
        </div>
      </section>

      <section className="hero" style={{ backgroundImage: `url(${padd})` }}>
        <div className="hero-content college-content">
          <h1>College, sorted.</h1>

          <p>
            Get a gift card from $100 to $150* when you
            <br />
            buy Mac or iPad with education savings.
          </p>

          <Link to="/store" className="hero-button" style={{ textDecoration: "none", display: "inline-block" }}>
            Shop
          </Link>
        </div>
      </section>
    </>
  );
};

export default Hero;
