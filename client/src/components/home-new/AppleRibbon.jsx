import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AppleRibbon – top announcement banner matching apple.com style.
 * Message, linkText, and linkUrl can all be driven from a DB section
 * (layout_type: 'ribbon') or from hardcoded defaults.
 */
export default function AppleRibbon({ message, linkText, linkUrl }) {
  const displayMsg  = message  || 'Get $180–$650 in credit when you trade in iPhone 11 or higher.';
  const displayLink = linkText || 'Shop iPhone';
  const displayUrl  = linkUrl  || '/iphone';

  return (
    <div className="apple-ribbon" role="banner" aria-label="Announcement">
      <div className="apple-ribbon-content">
        <span>{displayMsg} </span>
        <Link to={displayUrl} className="apple-ribbon-link">
          {displayLink}&nbsp;<span aria-hidden="true" className="apple-chevron">›</span>
        </Link>
      </div>
    </div>
  );
}
