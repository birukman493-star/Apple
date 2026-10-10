import React from "react";

const Search = () => {
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
      { name: "iPhone", image: "/iphone.png", link: "#" },
      { name: "Mac", image: "/mac.png", link: "#" },
      { name: "iPad", image: "/ipad.png", link: "#" },
      { name: "Watch", image: "/watch.png", link: "#" },
      { name: "Vision", image: "/vision.png", link: "#" },
      { name: "AirPods", image: "/airpods.png", link: "#" },
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

  </>
  )
};

export default Search;