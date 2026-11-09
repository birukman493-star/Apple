import React from 'react';
import './VideoBanner.css';

// Placeholder YouTube video ID (replace with actual Apple video)
const VIDEO_ID = 'dQw4w9WgXcQ';

const VideoBanner = () => (
  <div className="video-banner">
    <iframe
      src={`https://www.youtube.com/embed/${VIDEO_ID}`}
      title="Apple Promotional Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ width: '100%', height: '480px' }}
    ></iframe>
  </div>
);

export default VideoBanner;
