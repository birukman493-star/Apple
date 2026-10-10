import React from 'react'
import heroImage from "../assets/hero-apple.jpg"
import "./Hero.css"
import iPhone_image from "../assets/iphone.png"
import padd from "../assets/padd.jpg"



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

          <button className="hero-button">
            Add to calendar
          </button>
        </div>
      </section>

      <section className="hero" style={{ backgroundImage: `url(${iPhone_image})` }}>
        <div className="hero-content iphone-content">

          <p>iPhone</p>
          <h4>Meet the latest iPhone LineUp</h4>
          <button className="iphone-btn">Learn More</button>
          <button className="iphone-gtb">Shop iPhone</button>
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

    <button className="hero-button">
      Shop
    </button>
  </div>
</section>
    </>
  );
}

export default Hero
