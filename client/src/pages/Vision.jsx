
import React from "react";
import { useRef, useState, useEffect } from "react";
import "./Vision.css";


import visionImage from "../assets/visionPro.jpg";
// import visionImage from "../assets/visionPro.jpg";

import visionPro1 from "../assets/visionPro1.jpg";
import visionPro2 from "../assets/visionPro2.jpg";
import visionPro3 from "../assets/visionPro3.jpg";
import visionPro4 from "../assets/visionPro4.jpg";
import visionPro5 from "../assets/visionPro5.jpg";
import visionPro6 from "../assets/vision6.jpg";
import visionPro7 from "../assets/vision7.jpg";
import visionPro8 from "../assets/vision8.jpg";
import visionPro9 from "../assets/vision9.jpg";
import visionPro10 from "../assets/vision10.jpg";
import visionPro11 from "../assets/vision11.jpg";
const visionData = [
  {
    id: "intro",
    title: "Innovation you can see, hear, and feel.",
    description:
      "Pushing boundaries from the inside out. Spatial experiences on Apple Vision Pro are only possible through groundbreaking Apple technology. Displays that deliver more pixels than a 4K TV to each eye. Incredible Spatial Audio. A revolutionary dual-chip design featuring the powerful M5 chip. A sophisticated array of cameras and sensors. All the elements work together to create an unprecedented experience you have to see to believe.",
    imageSrc: visionPro1,
    alt: "Apple Vision Pro Top View",
  },
  {
    id: "display",
    title: "More pixels than a 4K TV. For each eye.",
    description: (
      <>
        The <strong>custom micro-OLED display system</strong> features
        23 million pixels, delivering stunning resolution and colors.
        And a specially designed three-element lens creates the feeling
        of a display that's everywhere you look.
      </>
    ),
    imageSrc: visionPro2,
    alt: "Micro-OLED Display Visual",
  },
  {
    id: "audio",
    title: "Our most advanced Spatial Audio system ever.",
    description: (
      <>
        Dual-driver audio pods positioned next to each ear deliver
        personalized sound while letting you hear what's around you.
        <strong> Spatial Audio</strong> makes sounds feel like they're
        coming from your surroundings. Audio ray tracing analyzes your
        room's acoustic properties to adapt and match sound to your space.
      </>
    ),
    imageSrc: visionPro3,
    alt: "Spatial Audio Pods View",
  },
  {
    id: "eye-tracking",
    title: "Responsive, precision eye tracking.",
    description: (
      <>
        A high-performance eye-tracking system of{" "}
        <strong>LEDs</strong> and <strong>infrared cameras</strong>{" "}
        projects invisible light patterns onto each eye. This advanced
        system provides ultraprecise input, so you can accurately select
        elements just by looking at them.
      </>
    ),
    imageSrc: visionPro4,
    alt: "Eye Tracking Sensor Array",
  },
  {
    id: "chips",
    title: (
      <>
        Revolutionary dual-chip performance.
        <br />
        Now powered by M5.
      </>
    ),
    description: (
      <>
        Apple Vision Pro makes a giant leap in chip performance with
        the new <strong>M5</strong>. It simultaneously runs visionOS,
        executes advanced computer vision algorithms, and delivers
        stunning graphics. And the <strong>R1</strong> chip is
        specifically dedicated to processing input from the cameras,
        sensors, and microphones.
      </>
    ),
    imageSrc: visionPro5,
    alt: "M5 and R1 Dual-Chip Array",
  },
];
// ==================================================
// VISION PRO TECHNOLOGY GALLERY
// ==================================================

const stats = [
  {
    value: "120Hz",
    label: "Enables up to",
    detail: "refresh rates",
  },
  {
    value: "10%",
    label: "Renders",
    detail: "more pixels⁸",
  },
  {
    value: "3 hours",
    label: "Delivers up to",
    detail: "video playback¹",
  },
];

const galleryCards = [
  {
    id: 1,
    title: "Spatial Display",
    type: "large-feature",
    imageSrc: visionPro6,
  },
  {
    id: 2,
    title: "Audio Pods Close-up",
    type: "portrait",
    imageSrc: visionPro7,
  },
  {
    id: 3,
    title: "Curved Glass Front",
    type: "portrait",
    imageSrc: visionPro8,
  },
  {
    id: 4,
    title: "Dual Chip M5 & R1",
    type: "portrait",
    imageSrc: visionPro5,
  },
];

const visionMediaCards = [
  {
    id: "privacy",
    title: "Privacy and Security",
    subtitle:
      "Optic ID uses the uniqueness of your iris to unlock Apple Vision Pro.",
    videoSrc: "/assets/privacy-eye.mp4",
    posterSrc: visionPro9,
    badge: "Privacy",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    subtitle:
      "Built-in accessibility features designed to work the way you do.",
    videoSrc: "/assets/accessibility.mp4",
    posterSrc: visionPro10,
    badge: "Accessibility",
  },
  {
    id: "environment",
    title: "Environment",
    subtitle:
      "100% recycled aluminum used in the enclosure and frame.",
    videoSrc: "/assets/environment-interface.mp4",
    posterSrc: visionPro11,
    badge: "Environment",
  },
];

const Vision = () => {

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const galleryScrollRef = useRef(null);
  // ADD THIS
  const [activeStep, setActiveStep] = useState(0);

  const [visionCloserLook, setVisionCloserLook] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/vision-closer-look")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status}`
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log("Vision closer look:", data);

        if (Array.isArray(data)) {
          setVisionCloserLook(data);
        } else {
          setVisionCloserLook([]);
        }
      })
      .catch((error) => {
        console.error(
          "Vision closer look error:",
          error
        );
      });
  }, []);

  <video
    ref={videoRef}
    className="vision-video"
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
  >
    <source src="/videos/vision-pro.mp4" type="video/mp4" />
  </video>

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleGalleryScroll = (direction) => {
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollBy({
        left: direction === "left" ? -500 : 500,
        behavior: "smooth",
      });
    }
  };

  const mediaScrollRef = useRef(null);

  const handleMediaScroll = (direction) => {
    if (mediaScrollRef.current) {
      mediaScrollRef.current.scrollBy({
        left: direction === "left" ? -480 : 480,
        behavior: "smooth",
      });
    }
  };


  return (
    <>
      <section className="vision-hero-container">
        {/* Central Vision Pro Image */}
        <div className="vision-graphic-wrapper">
          <img
            src={visionImage}
            alt="Apple Vision Pro"
            className="vision-graphic-svg"
          />
        </div>

        {/* Bottom Content */}
        <div className="vision-hero-content">
          {/* Text */}
          <div className="vision-text-group">
            <h1 className="vision-title">
              <span className="apple-logo-icon"></span>
              <span>Vision Pro</span>
            </h1>

            <p className="vision-subtitle">
              New powerful M5 chip and comfortable Dual Knit Band.
            </p>
          </div>

          {/* Buttons */}
          <div className="vision-button-group">
            <button className="btn btn-outline">Book a demo</button>
            <button className="btn btn-solid">Buy</button>
          </div>
        </div>
      </section>

      <section className="vision-intro-section">
        <div className="vision-intro-content">
          <h2>
            Apple Vision Pro seamlessly
            <br />
            blends digital content with
            <br />
            your physical space.
          </h2>

          <h2>
            So you can work, watch, relive
            <br />
            memories, and connect in ways
            <br />
            never before possible.
          </h2>

          <h2>The era of spatial computing is here.</h2>
        </div>
      </section>

      <section className="vision-video-section">
        <div className="vision-video-container">

          {/* Vision Pro Video */}
          <video
            ref={videoRef}
            className="vision-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/vision-pro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play / Pause Button */}
          <button
            className="vision-video-control"
            onClick={toggleVideo}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <span className="pause-icon">
                <span></span>
                <span></span>
              </span>
            ) : (
              <span className="play-icon"></span>
            )}
          </button>

          {/* Floating visionOS UI */}
          <div className="vision-os-overlay">

            {/* Left floating control pill */}
            <div className="vision-control-pill">
              <div className="vision-control-dot"></div>
              <div className="vision-control-line"></div>
              <div className="vision-control-dot"></div>
            </div>

            {/* App Icons */}
            <div className="vision-app-grid">

              <div className="vision-app-icon apple-tv">
                <span></span>
                <small>TV</small>
              </div>

              <div className="vision-app-icon music">
                <span>♫</span>
              </div>

              <div className="vision-app-icon safari">
                <span>◉</span>
              </div>

              <div className="vision-app-icon photos">
                <span>✿</span>
              </div>

              <div className="vision-app-icon spatial">
                <span>◈</span>
              </div>

              <div className="vision-app-icon app-store">
                <span>A</span>
              </div>

              <div className="vision-app-icon mail">
                <span>✉</span>
              </div>

              <div className="vision-app-icon messages">
                <span>●</span>
              </div>

              <div className="vision-app-icon notes">
                <span>▤</span>
              </div>

              <div className="vision-app-icon widgets">
                <span>⊞</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Apple-style text */}
        <div className="vision-video-content">
          <h2>
            Spatial experiences<br />
            that feel incredibly real.
          </h2>

          <p>
            Explore, create, work, and connect<br />
            in an entirely new way.
          </p>

          <button className="vision-learn-button">
            Learn more
            <span>›</span>
          </button>
        </div>
      </section>

      {/* ==================================================
    TAKE A CLOSER LOOK
================================================== */}

      <section className="vision-closer-look">

        <div className="vision-closer-look-header">

          <h2>
            Take a closer look.
          </h2>

        </div>


        <div className="vision-closer-look-scroll">

          <div className="vision-closer-look-track">

            {visionCloserLook.map((item) => (

              <article
                className="vision-closer-look-card"
                key={item.id}
              >

                <div className="vision-closer-look-image">

                  <img
                    src={item.image_url}
                    alt={item.title}
                  />

                </div>


                <div className="vision-closer-look-content">

                  <p>
                    {item.title}
                  </p>

                  {item.description && (
                    <p className="vision-closer-look-description">
                      {item.description}
                    </p>
                  )}

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

      <section className="vision-video-section">
        <div className="vision-video-container">

          {/* Vision Pro Video */}
          <video
            ref={videoRef}
            className="vision-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/vision-pro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play / Pause Button */}
          <button
            className="vision-video-control"
            onClick={toggleVideo}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <span className="pause-icon">
                <span></span>
                <span></span>
              </span>
            ) : (
              <span className="play-icon"></span>
            )}
          </button>

          {/* Floating visionOS UI */}
          <div className="vision-os-overlay">

            {/* Left floating control pill */}
            <div className="vision-control-pill">
              <div className="vision-control-dot"></div>
              <div className="vision-control-line"></div>
              <div className="vision-control-dot"></div>
            </div>

            {/* App Icons */}
            <div className="vision-app-grid">

              <div className="vision-app-icon apple-tv">
                <span></span>
                <small>TV</small>
              </div>

              <div className="vision-app-icon music">
                <span>♫</span>
              </div>

              <div className="vision-app-icon safari">
                <span>◉</span>
              </div>

              <div className="vision-app-icon photos">
                <span>✿</span>
              </div>

              <div className="vision-app-icon spatial">
                <span>◈</span>
              </div>

              <div className="vision-app-icon app-store">
                <span>A</span>
              </div>

              <div className="vision-app-icon mail">
                <span>✉</span>
              </div>

              <div className="vision-app-icon messages">
                <span>●</span>
              </div>

              <div className="vision-app-icon notes">
                <span>▤</span>
              </div>

              <div className="vision-app-icon widgets">
                <span>⊞</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Apple-style text */}
        <div className="vision-video-content">
          <h2>
            Spatial experiences<br />
            that feel incredibly real.
          </h2>

          <p>
            Explore, create, work, and connect<br />
            in an entirely new way.
          </p>

          <button className="vision-learn-button">
            Learn more
            <span>›</span>
          </button>
        </div>
      </section>

      {/* ==================================================
    TAKE A CLOSER LOOK
================================================== */}

      <section className="vision-closer-look">

        <div className="vision-closer-look-header">

          <h2>
            Take a closer look.
          </h2>

        </div>


        <div className="vision-closer-look-scroll">

          <div className="vision-closer-look-track">

            {visionCloserLook.map((item) => (

              <article
                className="vision-closer-look-card"
                key={item.id}
              >

                <div className="vision-closer-look-image">

                  <img
                    src={item.image_url}
                    alt={item.title}
                  />

                </div>


                <div className="vision-closer-look-content">

                  <p>
                    {item.title}
                  </p>

                  {item.description && (
                    <p className="vision-closer-look-description">
                      {item.description}
                    </p>
                  )}

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

      <section className="vision-video-section">
        <div className="vision-video-container">

          {/* Vision Pro Video */}
          <video
            ref={videoRef}
            className="vision-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/vision-pro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play / Pause Button */}
          <button
            className="vision-video-control"
            onClick={toggleVideo}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <span className="pause-icon">
                <span></span>
                <span></span>
              </span>
            ) : (
              <span className="play-icon"></span>
            )}
          </button>

          {/* Floating visionOS UI */}
          <div className="vision-os-overlay">

            {/* Left floating control pill */}
            <div className="vision-control-pill">
              <div className="vision-control-dot"></div>
              <div className="vision-control-line"></div>
              <div className="vision-control-dot"></div>
            </div>

            {/* App Icons */}
            <div className="vision-app-grid">

              <div className="vision-app-icon apple-tv">
                <span></span>
                <small>TV</small>
              </div>

              <div className="vision-app-icon music">
                <span>♫</span>
              </div>

              <div className="vision-app-icon safari">
                <span>◉</span>
              </div>

              <div className="vision-app-icon photos">
                <span>✿</span>
              </div>

              <div className="vision-app-icon spatial">
                <span>◈</span>
              </div>

              <div className="vision-app-icon app-store">
                <span>A</span>
              </div>

              <div className="vision-app-icon mail">
                <span>✉</span>
              </div>

              <div className="vision-app-icon messages">
                <span>●</span>
              </div>

              <div className="vision-app-icon notes">
                <span>▤</span>
              </div>

              <div className="vision-app-icon widgets">
                <span>⊞</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Apple-style text */}
        <div className="vision-video-content">
          <h2>
            Spatial experiences<br />
            that feel incredibly real.
          </h2>

          <p>
            Explore, create, work, and connect<br />
            in an entirely new way.
          </p>

          <button className="vision-learn-button">
            Learn more
            <span>›</span>
          </button>
        </div>
      </section>

      {/* ==================================================
    TAKE A CLOSER LOOK
================================================== */}

      <section className="vision-closer-look">

        <div className="vision-closer-look-header">

          <h2>
            Take a closer look.
          </h2>

        </div>


        <div className="vision-closer-look-scroll">

          <div className="vision-closer-look-track">

            {visionCloserLook.map((item) => (

              <article
                className="vision-closer-look-card"
                key={item.id}
              >

                <div className="vision-closer-look-image">

                  <img
                    src={item.image_url}
                    alt={item.title}
                  />

                </div>


                <div className="vision-closer-look-content">

                  <p>
                    {item.title}
                  </p>

                  {item.description && (
                    <p className="vision-closer-look-description">
                      {item.description}
                    </p>
                  )}

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

      <section className="vision-video-section">
        <div className="vision-video-container">

          {/* Vision Pro Video */}
          <video
            ref={videoRef}
            className="vision-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/vision-pro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play / Pause Button */}
          <button
            className="vision-video-control"
            onClick={toggleVideo}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <span className="pause-icon">
                <span></span>
                <span></span>
              </span>
            ) : (
              <span className="play-icon"></span>
            )}
          </button>

          {/* Floating visionOS UI */}
          <div className="vision-os-overlay">

            {/* Left floating control pill */}
            <div className="vision-control-pill">
              <div className="vision-control-dot"></div>
              <div className="vision-control-line"></div>
              <div className="vision-control-dot"></div>
            </div>

            {/* App Icons */}
            <div className="vision-app-grid">

              <div className="vision-app-icon apple-tv">
                <span></span>
                <small>TV</small>
              </div>

              <div className="vision-app-icon music">
                <span>♫</span>
              </div>

              <div className="vision-app-icon safari">
                <span>◉</span>
              </div>

              <div className="vision-app-icon photos">
                <span>✿</span>
              </div>

              <div className="vision-app-icon spatial">
                <span>◈</span>
              </div>

              <div className="vision-app-icon app-store">
                <span>A</span>
              </div>

              <div className="vision-app-icon mail">
                <span>✉</span>
              </div>

              <div className="vision-app-icon messages">
                <span>●</span>
              </div>

              <div className="vision-app-icon notes">
                <span>▤</span>
              </div>

              <div className="vision-app-icon widgets">
                <span>⊞</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Apple-style text */}
        <div className="vision-video-content">
          <h2>
            Spatial experiences<br />
            that feel incredibly real.
          </h2>

          <p>
            Explore, create, work, and connect<br />
            in an entirely new way.
          </p>

          <button className="vision-learn-button">
            Learn more
            <span>›</span>
          </button>
        </div>
      </section>

      {/* ==================================================
    TAKE A CLOSER LOOK
================================================== */}

      <section className="vision-closer-look">

        <div className="vision-closer-look-header">

          <h2>
            Take a closer look.
          </h2>

        </div>


        <div className="vision-closer-look-scroll">

          <div className="vision-closer-look-track">

            {visionCloserLook.map((item) => (

              <article
                className="vision-closer-look-card"
                key={item.id}
              >

                <div className="vision-closer-look-image">

                  <img
                    src={item.image_url}
                    alt={item.title}
                  />

                </div>


                <div className="vision-closer-look-content">

                  <p>
                    {item.title}
                  </p>

                  {item.description && (
                    <p className="vision-closer-look-description">
                      {item.description}
                    </p>
                  )}

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

      <section className="vision-video-section">
        <div className="vision-video-container">

          {/* Vision Pro Video */}
          <video
            ref={videoRef}
            className="vision-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/vision-pro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play / Pause Button */}
          <button
            className="vision-video-control"
            onClick={toggleVideo}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <span className="pause-icon">
                <span></span>
                <span></span>
              </span>
            ) : (
              <span className="play-icon"></span>
            )}
          </button>

          {/* Floating visionOS UI */}
          <div className="vision-os-overlay">

            {/* Left floating control pill */}
            <div className="vision-control-pill">
              <div className="vision-control-dot"></div>
              <div className="vision-control-line"></div>
              <div className="vision-control-dot"></div>
            </div>

            {/* App Icons */}
            <div className="vision-app-grid">

              <div className="vision-app-icon apple-tv">
                <span></span>
                <small>TV</small>
              </div>

              <div className="vision-app-icon music">
                <span>♫</span>
              </div>

              <div className="vision-app-icon safari">
                <span>◉</span>
              </div>

              <div className="vision-app-icon photos">
                <span>✿</span>
              </div>

              <div className="vision-app-icon spatial">
                <span>◈</span>
              </div>

              <div className="vision-app-icon app-store">
                <span>A</span>
              </div>

              <div className="vision-app-icon mail">
                <span>✉</span>
              </div>

              <div className="vision-app-icon messages">
                <span>●</span>
              </div>

              <div className="vision-app-icon notes">
                <span>▤</span>
              </div>

              <div className="vision-app-icon widgets">
                <span>⊞</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Apple-style text */}
        <div className="vision-video-content">
          <h2>
            Spatial experiences<br />
            that feel incredibly real.
          </h2>

          <p>
            Explore, create, work, and connect<br />
            in an entirely new way.
          </p>

          <button className="vision-learn-button">
            Learn more
            <span>›</span>
          </button>
        </div>
      </section>

      {/* ==================================================
    TAKE A CLOSER LOOK
================================================== */}

      <section className="vision-closer-look">

        <div className="vision-closer-look-header">

          <h2>
            Take a closer look.
          </h2>

        </div>


        <div className="vision-closer-look-scroll">

          <div className="vision-closer-look-track">

            {visionCloserLook.map((item) => (

              <article
                className="vision-closer-look-card"
                key={item.id}
              >

                <div className="vision-closer-look-image">

                  <img
                    src={item.image_url}
                    alt={item.title}
                  />

                </div>


                <div className="vision-closer-look-content">

                  <p>
                    {item.title}
                  </p>

                  {item.description && (
                    <p className="vision-closer-look-description">
                      {item.description}
                    </p>
                  )}

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

      <section className="vision-video-section">
        <div className="vision-video-container">

          {/* Vision Pro Video */}
          <video
            ref={videoRef}
            className="vision-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/vision-pro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play / Pause Button */}
          <button
            className="vision-video-control"
            onClick={toggleVideo}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <span className="pause-icon">
                <span></span>
                <span></span>
              </span>
            ) : (
              <span className="play-icon"></span>
            )}
          </button>

          {/* Floating visionOS UI */}
          <div className="vision-os-overlay">

            {/* Left floating control pill */}
            <div className="vision-control-pill">
              <div className="vision-control-dot"></div>
              <div className="vision-control-line"></div>
              <div className="vision-control-dot"></div>
            </div>

            {/* App Icons */}
            <div className="vision-app-grid">

              <div className="vision-app-icon apple-tv">
                <span></span>
                <small>TV</small>
              </div>

              <div className="vision-app-icon music">
                <span>♫</span>
              </div>

              <div className="vision-app-icon safari">
                <span>◉</span>
              </div>

              <div className="vision-app-icon photos">
                <span>✿</span>
              </div>

              <div className="vision-app-icon spatial">
                <span>◈</span>
              </div>

              <div className="vision-app-icon app-store">
                <span>A</span>
              </div>

              <div className="vision-app-icon mail">
                <span>✉</span>
              </div>

              <div className="vision-app-icon messages">
                <span>●</span>
              </div>

              <div className="vision-app-icon notes">
                <span>▤</span>
              </div>

              <div className="vision-app-icon widgets">
                <span>⊞</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Apple-style text */}
        <div className="vision-video-content">
          <h2>
            Spatial experiences<br />
            that feel incredibly real.
          </h2>

          <p>
            Explore, create, work, and connect<br />
            in an entirely new way.
          </p>

          <button className="vision-learn-button">
            Learn more
            <span>›</span>
          </button>
        </div>
      </section>

      {/* ==================================================
    TAKE A CLOSER LOOK
================================================== */}

      <section className="vision-closer-look">

        <div className="vision-closer-look-header">

          <h2>
            Take a closer look.
          </h2>

        </div>


        <div className="vision-closer-look-scroll">

          <div className="vision-closer-look-track">

            {visionCloserLook.map((item) => (

              <article
                className="vision-closer-look-card"
                key={item.id}
              >

                <div className="vision-closer-look-image">

                  <img
                    src={item.image_url}
                    alt={item.title}
                  />

                </div>


                <div className="vision-closer-look-content">

                  <p>
                    {item.title}
                  </p>

                  {item.description && (
                    <p className="vision-closer-look-description">
                      {item.description}
                    </p>
                  )}

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

      {/* ==================================================
   {/* ==================================================
    VISION PRO TECHNOLOGY FEATURES
================================================== */}

      <section className="vision-features-section">

        <div className="vision-features-container">

          {visionData.map((item, index) => (
            <div className="vision-feature-item" key={item.id}>

              {/* Feature Number */}
              <div className="vision-feature-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Text */}
              <div className="vision-feature-text">

                <h2>
                  {item.title}
                </h2>

                <div className="vision-feature-description">
                  {item.description}
                </div>

              </div>

              {/* Image */}
              <div className="vision-feature-image">

                <img
                  src={item.imageSrc}
                  alt={item.alt}
                />

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* ==================================================
    VISION PRO TECHNOLOGY GALLERY
================================================== */}

      <section className="vision-tech-gallery">

        {/* Heading */}
        <div className="vision-tech-gallery-header">

          <h2>
            Innovation you can see, hear, and feel.
          </h2>

          <p>
            Pushing boundaries from the inside out. Spatial experiences
            on Apple Vision Pro are only possible through groundbreaking
            Apple technology.
          </p>

        </div>


        {/* Stats */}
        <div className="vision-tech-stats">

          {stats.map((stat, index) => (
            <div
              className="vision-tech-stat"
              key={index}
            >

              <span className="vision-tech-stat-label">
                {stat.label}
              </span>

              <strong className="vision-tech-stat-value">
                {stat.value}
              </strong>

              <span className="vision-tech-stat-detail">
                {stat.detail}
              </span>

            </div>
          ))}

        </div>


        {/* Gallery */}
        <div className="vision-tech-gallery-wrapper">

          <div
            ref={galleryScrollRef}
            className="vision-tech-gallery-scroll"
          >

            {galleryCards.map((card) => (

              <article
                key={card.id}
                className={
                  card.type === "large-feature"
                    ? "vision-tech-card vision-tech-card-large"
                    : "vision-tech-card vision-tech-card-small"
                }
              >

                <img
                  src={card.imageSrc}
                  alt={card.title}
                />

                <div className="vision-tech-card-overlay">
                  <h3>{card.title}</h3>
                </div>

              </article>

            ))}

          </div>


          {/* Navigation */}
          <div className="vision-tech-gallery-controls">

            <button
              type="button"
              onClick={() => handleGalleryScroll("left")}
              aria-label="Previous"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => handleGalleryScroll("right")}
              aria-label="Next"
            >
              →
            </button>

          </div>

        </div>

      </section>

      <section className="vision-values-section">
        {/* Header */}
        <div className="vision-values-header">
          <h2>Designed to make a difference.</h2>

          <p>
            <strong>Our values lead the way.</strong> Apple Vision Pro was
            designed to help protect your privacy and keep you in control of
            your data. Its built-in accessibility features are designed to
            work the way you do.
          </p>
        </div>

        {/* Video Cards */}
        <div className="vision-values-carousel">
          <div
            ref={mediaScrollRef}
            className="vision-values-scroll"
          >
            {visionMediaCards.map((card) => (
              <article
                key={card.id}
                className="vision-value-card"
              >
                <video
                  src={card.videoSrc}
                  poster={card.posterSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="vision-value-video"
                />

                <div className="vision-value-overlay">
                  <span>{card.badge}</span>

                  <h3>{card.title}</h3>

                  <p>{card.subtitle}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Arrows */}
          <div className="vision-values-controls">
            <button
              type="button"
              onClick={() => handleMediaScroll("left")}
              aria-label="Scroll left"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => handleMediaScroll("right")}
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Vision;

