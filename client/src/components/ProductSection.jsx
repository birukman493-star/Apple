import React from "react";
import { Link } from "react-router-dom";
import "./ProductSection.css";

const ProductSection = ({
  title,
  description,
  image,
  dark = false,
  learnLink = "/mac",
  buyLink = "/store",
}) => {
  return (
    <section className={`product-section ${dark ? "dark" : ""}`}>

      <div className="product-content">

        <h2>{title}</h2>

        <p>{description}</p>

        <div className="product-buttons">
          <Link to={learnLink} className="learn-button" style={{ textDecoration: "none" }}>
            Learn more
          </Link>

          <Link to={buyLink} className="buy-button" style={{ textDecoration: "none" }}>
            Buy
          </Link>
        </div>

      </div>

      <img
        src={image}
        alt={title}
        className="product-image"
      />

    </section>
  );
};

export default ProductSection;
