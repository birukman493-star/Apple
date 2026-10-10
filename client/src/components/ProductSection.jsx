import React from "react";
import "./ProductSection.css";

const ProductSection = ({
  title,
  description,
  image,
  dark = false,
}) => {
  return (
    <section className={`product-section ${dark ? "dark" : ""}`}>

      <div className="product-content">

        <h2>{title}</h2>

        <p>{description}</p>

        <div className="product-buttons">
          <button className="learn-button">
            Learn more
          </button>

          <button className="buy-button">
            Buy
          </button>
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