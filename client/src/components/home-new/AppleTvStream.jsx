import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiPause, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Local show poster assets
import maydayPoster       from '../../assets/mayday.webp';
import inRunPoster        from '../../assets/InRun.webp';
import knifeEdgePoster    from '../../assets/knifeedge.webp';
import luckyPoster        from '../../assets/lucky.webp';
import smallProphetsPoster from '../../assets/smallprophets.webp';
import theDinkPoster      from '../../assets/thedink.webp';
import theDynastyPoster   from '../../assets/thedynasty.webp';
import sportPoster        from '../../assets/sport.webp';
import trailerVideo       from '../../assets/entertainment1.mp4';

const SHOWS = [
  {
    id: 'mayday',
    title: 'Mayday',
    genre: 'Thriller',
    desc: 'An ordinary flight turns into an extraordinary mystery in the sky.',
    poster: maydayPoster,
    cta: 'Stream now',
  },
  {
    id: 'inrun',
    title: 'In The Run',
    genre: 'Drama',
    desc: 'High-stakes competition meets the grit of champion runners.',
    poster: inRunPoster,
    cta: 'Stream now',
  },
  {
    id: 'knifeedge',
    title: 'Knife Edge',
    genre: 'Action',
    desc: 'One wrong move is the difference between survival and oblivion.',
    poster: knifeEdgePoster,
    cta: 'Stream now',
  },
  {
    id: 'lucky',
    title: 'Lucky',
    genre: 'Comedy',
    desc: 'Fortune favors the bold, but chaos follows the lucky.',
    poster: luckyPoster,
    cta: 'Stream now',
  },
  {
    id: 'smallprophets',
    title: 'Small Prophets',
    genre: 'Sci-Fi',
    desc: 'A vision of the future hidden in ordinary occurrences.',
    poster: smallProphetsPoster,
    cta: 'Stream now',
  },
  {
    id: 'thedink',
    title: 'The Dink',
    genre: 'Sports Comedy',
    desc: 'The unexpected phenomenon taking the sports world by storm.',
    poster: theDinkPoster,
    cta: 'Stream now',
  },
  {
    id: 'thedynasty',
    title: 'The Dynasty',
    genre: 'Documentary',
    desc: 'The definitive look inside unprecedented sporting greatness.',
    poster: theDynastyPoster,
    cta: 'Stream now',
  },
  {
    id: 'sport',
    title: 'Friday Night Baseball',
    genre: 'Live Sports',
    desc: 'Live Major League Baseball action with no blackout restrictions.',
    poster: sportPoster,
    cta: 'Watch live',
  },
];

/**
 * AppleTvStream – Apple TV+ section matching apple.com layout:
 *   • Full-bleed video background with gradient overlay
 *   • Centered tv+ badge → headline (from section data) → subhead
 *   • Currently-selected show info with CTA buttons
 *   • Horizontal scrollable thumbnail strip
 *   • Playback controls (prev / play-pause / next) + dot indicators
 *
 * Section data (title, subtitle, video_url) comes dynamically from DB.
 */
export default function AppleTvStream({ section }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying]       = useState(true);
  const videoRef = useRef(null);

  // Auto-advance every 4.5s
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (videoRef.current) {
        next ? videoRef.current.play().catch(() => {}) : videoRef.current.pause();
      }
      return next;
    });
  };

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + SHOWS.length) % SHOWS.length);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % SHOWS.length);

  const currentShow = SHOWS[currentIndex];
  const videoSrc    = section?.video_url || trailerVideo;

  // Dynamic section data from CMS/DB (falls back to hardcoded)
  const headline = section?.title    || 'Stream now on Apple TV+';
  const subhead  = section?.subtitle || 'Stream award-winning Apple Originals on the Apple TV app.';
  const streamLink = section?.button_link || '/entertainment';

  return (
    <section className="apple-tv-section" aria-label="Apple TV Plus Originals">
      {/* ── Video background ────────────────────────────── */}
      <div className="apple-tv-video-wrapper">
        <video
          ref={videoRef}
          className="apple-tv-video"
          autoPlay
          muted
          loop
          playsInline
          src={videoSrc}
          aria-hidden="true"
        />
        <div className="apple-tv-overlay" aria-hidden="true" />
      </div>

      {/* ── Foreground content ──────────────────────────── */}
      <div className="apple-tv-inner">
        {/* tv+ logo pill */}
        <div className="apple-tv-logo-pill" aria-label="Apple TV Plus">
          <span className="apple-tv-logo-symbol">tv+</span>
          <span className="apple-tv-badge-text">Original Series &amp; Films</span>
        </div>

        {/* Section headline & subhead (from DB) */}
        <h2 className="apple-tv-headline">{headline}</h2>
        <p className="apple-tv-subhead">{subhead}</p>

        {/* Currently active show info */}
        <div className="apple-tv-active-card">
          <div className="apple-tv-active-meta">
            <div className="apple-tv-genre">{currentShow.genre}</div>
            <h3 className="apple-tv-show-title">{currentShow.title}</h3>
            <p className="apple-tv-show-desc">{currentShow.desc}</p>
          </div>
          <div className="apple-tv-cta-row">
            <Link to={streamLink} className="apple-btn apple-btn--white">
              {currentShow.cta}
            </Link>
            <Link to={streamLink} className="apple-btn apple-btn--ghost-white">
              Try Apple TV+ free<sup>*</sup>
            </Link>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div
          className="apple-tv-strip"
          role="listbox"
          aria-label="Apple TV+ Shows"
        >
          {SHOWS.map((show, idx) => (
            <button
              key={show.id}
              type="button"
              role="option"
              aria-selected={idx === currentIndex}
              className={`apple-tv-thumb ${idx === currentIndex ? 'apple-tv-thumb--active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`${show.title} — ${show.genre}`}
            >
              <img
                src={show.poster}
                alt={show.title}
                className="apple-tv-thumb-img"
                loading="lazy"
              />
              <div className="apple-tv-thumb-cap">
                <span className="apple-tv-thumb-genre-txt">{show.genre}</span>
                <span className="apple-tv-thumb-title-txt">{show.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Controls row */}
        <div className="apple-tv-controls">
          {/* Dot indicators */}
          <div className="apple-tv-dots" role="tablist" aria-label="Slides">
            {SHOWS.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={idx === currentIndex}
                className={`apple-tv-dot ${idx === currentIndex ? 'apple-tv-dot--active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev / play-pause / next */}
          <div className="apple-tv-nav">
            <button
              type="button"
              className="apple-tv-ctrl"
              onClick={handlePrev}
              aria-label="Previous show"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className="apple-tv-ctrl"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            <button
              type="button"
              className="apple-tv-ctrl"
              onClick={handleNext}
              aria-label="Next show"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
