/**
 * Shared Website Section Registry & Apple.com Architecture
 *
 * Single source of truth for:
 * - Category to Frontend Page routing
 * - Section registry with stable identifiers, layout components, and field capabilities
 * - Category matching and normalization rules
 */

// ─── Supported Categories & Target Pages ──────────────────────────────────────
export const CATEGORIES = [
  { value: 'iPhone',        label: 'iPhone',           icon: '📱', path: '/iphone',        hasSections: true },
  { value: 'Mac',           label: 'Mac',              icon: '💻', path: '/mac',           hasSections: true },
  { value: 'iPad',          label: 'iPad',             icon: '⬛', path: '/ipad',          hasSections: true },
  { value: 'Watch',         label: 'Apple Watch',      icon: '⌚', path: '/watch',         hasSections: true },
  { value: 'Vision',        label: 'Apple Vision Pro', icon: '🥽', path: '/vision',        hasSections: true },
  { value: 'AirPods',       label: 'AirPods',          icon: '🎧', path: '/airpods',       hasSections: true },
  { value: 'TV & Home',     label: 'TV & Home',        icon: '📺', path: '/tv-home',       hasSections: true },
  { value: 'Entertainment', label: 'Entertainment',    icon: '🎵', path: '/entertainment', hasSections: true },
  { value: 'Accessories',   label: 'Accessories',      icon: '🎒', path: '/accessories',   hasSections: true },
  { value: 'Store',         label: 'Store',            icon: '🛍️', path: '/store',         hasSections: true },
  { value: 'Home',          label: 'Home Page',        icon: '🏠', path: '/',              hasSections: true },
  { value: 'Home (New)',    label: 'Home Page (New)',  icon: '✨', path: '/home-new',        hasSections: true },
  { value: 'Support',       label: 'Apple Support',    icon: '💬', path: '/support',        hasSections: false },
];

// ─── Layout Component Definitions ─────────────────────────────────────────────
export const LAYOUT_TYPES = [
  { value: 'hero',              label: 'Hero Banner',               supportsMultiProduct: false, desc: 'Full-width cinematic hero with primary product spotlight' },
  { value: 'product_promotion', label: 'Product Promotion Card',    supportsMultiProduct: false, desc: 'Split 2-column showcase card with CTA' },
  { value: 'product_grid',      label: 'Product Grid Showcase',     supportsMultiProduct: true,  desc: 'Curated product group or multi-product showcase' },
  { value: 'feature',           label: 'Feature Section',           supportsMultiProduct: false, desc: 'Headline with full-width media showcase' },
  { value: 'benefits',          label: 'Benefits / Incentive Card', supportsMultiProduct: false, desc: 'Apple shopping benefits or incentive value prop' },
  { value: 'image_text',        label: 'Image & Text Two-Column',   supportsMultiProduct: false, desc: 'Interactive feature details with side media' },
  { value: 'comparison',        label: 'Comparison Section',        supportsMultiProduct: true,  desc: 'Specs and models comparison framing' },
  { value: 'promo_banner',      label: 'Promotional Banner',        supportsMultiProduct: false, desc: 'Gradient accent banner with call to action' },
  { value: 'video_banner',      label: 'Video Banner',              supportsMultiProduct: false, desc: 'Cinematic loop or showcase video banner' },
  { value: 'image_banner',      label: 'Image Banner',              supportsMultiProduct: false, desc: 'Full-width graphic image showcase' },
  { value: 'promo_card',        label: 'Promotional Card',          supportsMultiProduct: false, desc: 'Compact square or split card promo' },
  { value: 'custom',            label: 'Custom Content',            supportsMultiProduct: false, desc: 'Flexible text & media container' },
];

// ─── Frontend Page Section Registry ───────────────────────────────────────────
// Maps every category to the real sections rendered on that page in the frontend
export const SECTION_REGISTRY = {
  iPhone: [
    {
      key: 'iphone-duo',
      name: 'iPhone Duo Spotlight',
      defaultLayout: 'hero',
      supportsMultiProduct: false,
      description: 'Flagship dual-lens introduction spotlight',
      selector: '.iphone-duo-section'
    },
    {
      key: 'explore-lineup',
      name: 'Explore the Lineup',
      defaultLayout: 'product_grid',
      supportsMultiProduct: true,
      description: 'Curated group of current iPhone models with specifications and pricing',
      selector: '.iphone-lineup'
    },
    {
      key: 'why-apple-iphone',
      name: 'Why Apple is the best place to buy iPhone',
      defaultLayout: 'benefits',
      supportsMultiProduct: false,
      description: 'Trade-in incentives, carrier deals, and shopping assistance',
      selector: '.iphone-shopping'
    },
    {
      key: 'significant-features',
      name: 'Significant Features',
      defaultLayout: 'feature',
      supportsMultiProduct: false,
      description: 'Battery life, camera innovations, and Apple Intelligence features',
      selector: '.iphone-features'
    },
    {
      key: 'iphone-essentials',
      name: 'iPhone Essentials',
      defaultLayout: 'product_promotion',
      supportsMultiProduct: true,
      description: 'MagSafe accessories, cases, and charging gear',
      selector: '.iphone-essentials'
    },
    {
      key: 'apple-world',
      name: 'Apple World Ecosystem',
      defaultLayout: 'promo_banner',
      supportsMultiProduct: false,
      description: 'Cross-device synergy with Mac, Apple Watch, and AirPods',
      selector: '.apple-world-section'
    },
  ],

  Mac: [
    {
      key: 'explore-lineup',
      name: 'Explore the Lineup',
      defaultLayout: 'product_grid',
      supportsMultiProduct: true,
      description: 'Laptops, desktops, and displays lineup with configuration filters',
      selector: '.mac-lineup'
    },
    {
      key: 'why-apple-mac',
      name: 'Why Apple is the best place to shop Mac',
      defaultLayout: 'benefits',
      supportsMultiProduct: false,
      description: 'Custom build-to-order, trade-in, and AppleCard monthly installments',
      selector: '.mac-shop-section'
    },
    {
      key: 'get-to-know-mac',
      name: 'Get to know Mac',
      defaultLayout: 'feature',
      supportsMultiProduct: false,
      description: 'macOS power, battery life, and Apple silicon performance overview',
      selector: '.get-to-know-mac'
    },
    {
      key: 'help-me-choose',
      name: 'Help Me Choose',
      defaultLayout: 'image_text',
      supportsMultiProduct: false,
      description: 'Interactive wizard answering user workflow needs',
      selector: '.mac-help-section'
    },
    {
      key: 'switch-to-mac',
      name: 'Switch to Mac',
      defaultLayout: 'product_promotion',
      supportsMultiProduct: false,
      description: 'Migration Assistant and PC to Mac ease of use',
      selector: '.switch-mac-section'
    },
    {
      key: 'mac-essentials',
      name: 'Mac Essentials',
      defaultLayout: 'benefits',
      supportsMultiProduct: true,
      description: 'Magic Keyboard, Magic Mouse, Studio Display, and cables',
      selector: '.mac-essentials-section'
    },
  ],

  iPad: [
    {
      key: 'explore-lineup',
      name: 'Explore the Lineup',
      defaultLayout: 'product_grid',
      supportsMultiProduct: true,
      description: 'iPad Pro, iPad Air, iPad, and iPad mini showcase',
      selector: '.ipad-lineup'
    },
    {
      key: 'why-apple-ipad',
      name: 'Why Apple is the best place to shop iPad',
      defaultLayout: 'benefits',
      supportsMultiProduct: false,
      description: 'Education savings, free engraving, and trade-in perks',
      selector: '.ipad-shop-benefits'
    },
    {
      key: 'get-to-know-ipad',
      name: 'Get to know iPad',
      defaultLayout: 'feature',
      supportsMultiProduct: false,
      description: 'Versatile iPadOS capabilities and creative tools',
      selector: '.ipad-get-to-know'
    },
    {
      key: 'ipad-essentials',
      name: 'iPad Essentials',
      defaultLayout: 'product_promotion',
      supportsMultiProduct: true,
      description: 'Apple Pencil Pro and Magic Keyboard pairings',
      selector: '.ipad-essentials'
    },
    {
      key: 'significant-others',
      name: 'iPad and Significant Others',
      defaultLayout: 'promo_banner',
      supportsMultiProduct: false,
      description: 'Continuity, Sidecar, and Universal Control with Mac',
      selector: '.ipad-significant'
    },
  ],

  Watch: [
    {
      key: 'explore-lineup',
      name: 'Explore the Lineup',
      defaultLayout: 'product_grid',
      supportsMultiProduct: true,
      description: 'Apple Watch Ultra, Series 10, and SE models comparison',
      selector: '.watch-lineup-section'
    },
    {
      key: 'why-apple-watch',
      name: 'Why Apple is the best place to buy Apple Watch',
      defaultLayout: 'benefits',
      supportsMultiProduct: false,
      description: 'Apple Watch Studio band customization and trade-in',
      selector: '.watch-shopping-section'
    },
    {
      key: 'made-for-watch',
      name: 'Made for Apple Watch',
      defaultLayout: 'feature',
      supportsMultiProduct: false,
      description: 'Health sensors, workout tracking, and cellular freedom',
      selector: '.watch-made-section'
    },
  ],

  Vision: [
    {
      key: 'vision-intro',
      name: 'Apple Vision Pro Intro',
      defaultLayout: 'hero',
      supportsMultiProduct: false,
      description: 'Spatial computing headline and immersive demo',
      selector: '.vision-intro-section'
    },
    {
      key: 'vision-features',
      name: 'Vision Pro Features',
      defaultLayout: 'feature',
      supportsMultiProduct: false,
      description: 'visionOS spatial apps and 3D camera capabilities',
      selector: '.vision-features-section'
    },
    {
      key: 'tech-gallery',
      name: 'Technology Gallery',
      defaultLayout: 'product_grid',
      supportsMultiProduct: false,
      description: 'Hardware architecture: Micro-OLED displays and M2/R1 dual chips',
      selector: '.vision-tech-gallery'
    },
    {
      key: 'apple-values',
      name: 'Apple Values',
      defaultLayout: 'promo_banner',
      supportsMultiProduct: false,
      description: 'Optic ID privacy, accessibility features, and materials',
      selector: '.vision-values-section'
    },
  ],

  AirPods: [
    {
      key: 'compare-airpods',
      name: 'Compare AirPods Models',
      defaultLayout: 'comparison',
      supportsMultiProduct: true,
      description: 'AirPods 4, AirPods Pro 2, and AirPods Max side-by-side',
      selector: '.airpods-compare-section'
    },
    {
      key: 'feature-comparison',
      name: 'Audio Technology Comparison',
      defaultLayout: 'feature',
      supportsMultiProduct: false,
      description: 'Active Noise Cancellation and Transparency mode comparison',
      selector: '.airpods-feature-comparison'
    },
    {
      key: 'get-to-know-airpods',
      name: 'Get to know AirPods',
      defaultLayout: 'benefits',
      supportsMultiProduct: false,
      description: 'Personalized Spatial Audio and seamless device switching',
      selector: '.airpods-know-section'
    },
    {
      key: 'promos-services',
      name: 'Promos and Services',
      defaultLayout: 'promo_banner',
      supportsMultiProduct: false,
      description: '6 months free Apple Music with eligible headphones',
      selector: '.airpods-promos-services'
    },
  ],

  'TV & Home': [
    {
      key: 'tvhome-products',
      name: 'TV & Home Products',
      defaultLayout: 'product_grid',
      supportsMultiProduct: true,
      description: 'Apple TV 4K, HomePod, HomePod mini, and accessories',
      selector: '.tvhome-product-grid'
    },
    {
      key: 'smart-slider',
      name: 'Smart Home Slider',
      defaultLayout: 'feature',
      supportsMultiProduct: false,
      description: 'HomeKit security, lighting, and climate control hubs',
      selector: '.tvhome-smart-slider'
    },
    {
      key: 'tvhome-accessories',
      name: 'TV & Home Accessories',
      defaultLayout: 'product_promotion',
      supportsMultiProduct: true,
      description: 'Siri Remote, audio cables, and smart plugs',
      selector: '.tvhome-accessories'
    },
    {
      key: 'services-perks',
      name: 'Services and Perks',
      defaultLayout: 'promo_banner',
      supportsMultiProduct: false,
      description: 'Apple TV+, Apple Fitness+, and Apple Music subscription benefits',
      selector: '.tvhome-services-perks'
    },
  ],

  Entertainment: [
    {
      key: 'entertainment-hero',
      name: 'Entertainment All-in-One Hero',
      defaultLayout: 'hero',
      supportsMultiProduct: false,
      description: 'Header showcasing all award-winning Apple services',
      selector: '.entertainment-hero'
    },
    {
      key: 'music-spotlight',
      name: 'Apple Music Spotlight',
      defaultLayout: 'product_grid',
      supportsMultiProduct: false,
      description: 'Spatial audio with Dolby Atmos and 100M+ songs',
      selector: '.entertainment-music'
    },
    {
      key: 'apple-one-bundle',
      name: 'Apple One Bundle',
      defaultLayout: 'feature',
      supportsMultiProduct: false,
      description: 'Bundle up to six services with multi-tier pricing',
      selector: '.apple-one-section'
    },
    {
      key: 'top-picks',
      name: 'Curated Entertainment Picks',
      defaultLayout: 'product_promotion',
      supportsMultiProduct: false,
      description: 'Trending Apple Originals, Arcade titles, and Podcasts',
      selector: '.accessories-top-picks'
    },
  ],

  Accessories: [
    {
      key: 'featured-accessories',
      name: 'Featured Accessories',
      defaultLayout: 'product_grid',
      supportsMultiProduct: true,
      description: 'Curated MagSafe chargers, wallets, and seasonal cases',
      selector: '.accessories-featured'
    },
    {
      key: 'case-protection',
      name: 'Find the Right Case',
      defaultLayout: 'image_text',
      supportsMultiProduct: false,
      description: 'Silicone, clear, and FineWoven case options',
      selector: '.case-protection-section'
    },
    {
      key: 'duo-showcase',
      name: 'Power & Charging Showcase',
      defaultLayout: 'product_promotion',
      supportsMultiProduct: true,
      description: 'MagSafe Duo and high-wattage USB-C power adapters',
      selector: '.duo-showcase-section'
    },
    {
      key: 'accessory-benefits',
      name: 'Accessory Benefits',
      defaultLayout: 'benefits',
      supportsMultiProduct: false,
      description: 'Fast delivery, free returns, and Apple Care+ protection',
      selector: '.accessory-benefits-section'
    },
  ],

  Store: [
    {
      key: 'store-header',
      name: 'Store Welcome Banner',
      defaultLayout: 'hero',
      supportsMultiProduct: false,
      description: 'The best way to buy the products you love greeting',
      selector: '.store-header'
    },
    {
      key: 'store-latest',
      name: 'The Latest (Curated Product Group)',
      defaultLayout: 'product_grid',
      supportsMultiProduct: true,
      description: 'Curated carousel of flagship new releases across categories',
      selector: '.latest-section'
    },
    {
      key: 'store-difference',
      name: 'The Apple Store Difference',
      defaultLayout: 'benefits',
      supportsMultiProduct: false,
      description: 'Specialist assistance, free setup, and easy trade-in',
      selector: '.store-difference'
    },
    {
      key: 'store-sound',
      name: 'Loud and Clear Audio Showcase',
      defaultLayout: 'feature',
      supportsMultiProduct: true,
      description: 'AirPods, HomePod, and Beats headphones showcase',
      selector: '.store-sound'
    },
    {
      key: 'store-help',
      name: 'Help is Here',
      defaultLayout: 'image_text',
      supportsMultiProduct: false,
      description: 'One-on-one specialist video or chat sessions',
      selector: '.help-section'
    },
    {
      key: 'store-experience',
      name: 'The Apple Experience',
      defaultLayout: 'promo_banner',
      supportsMultiProduct: false,
      description: 'Today at Apple creative sessions and workshops',
      selector: '.store-experience'
    },
    {
      key: 'store-savings',
      name: 'Special Savings',
      defaultLayout: 'benefits',
      supportsMultiProduct: false,
      description: 'Education pricing, business financing, and certified refurbished',
      selector: '.store-savings'
    },
  ],

  Home: [
    {
      key: 'hero-spotlight',
      name: 'Flagship Launch Hero',
      defaultLayout: 'hero',
      supportsMultiProduct: false,
      description: 'Main homepage billboard introducing the newest flagship device',
      selector: '.hero-container'
    },
    {
      key: 'home-lineup',
      name: 'Home Lineup Highlights',
      defaultLayout: 'product_grid',
      supportsMultiProduct: true,
      description: 'Tiles highlighting top products across iPhone, Mac, and Watch',
      selector: '.home-container'
    },
    {
      key: 'entertainment-stream',
      name: 'Apple Originals Stream',
      defaultLayout: 'promo_banner',
      supportsMultiProduct: false,
      description: 'Current popular movies and series streaming on Apple TV+',
      selector: '.entertainment-wrapper'
    },
  ],

  'Home (New)': [
    {
      key: 'hero-spotlight',
      name: 'Flagship Launch Hero (iPhone 16 Pro)',
      defaultLayout: 'hero',
      supportsMultiProduct: false,
      description: 'Main flagship billboard introducing iPhone 16 Pro with dual action buttons',
      selector: '.apple-hero-primary'
    },
    {
      key: 'hero-iphone16',
      name: 'Secondary Hero (iPhone 16)',
      defaultLayout: 'hero',
      supportsMultiProduct: false,
      description: 'Second wide billboard showcasing iPhone 16 and Apple Intelligence',
      selector: '.apple-hero-secondary'
    },
    {
      key: 'hero-watch10',
      name: 'Tertiary Hero (Apple Watch Series 10)',
      defaultLayout: 'hero',
      supportsMultiProduct: false,
      description: 'Third hero banner featuring Apple Watch Series 10',
      selector: '.apple-hero-watch'
    },
    {
      key: 'promo-grid-lineup',
      name: 'Two-Column Product Promo Grid',
      defaultLayout: 'product_grid',
      supportsMultiProduct: true,
      description: 'Curated 2-column tiles for MacBook Air, iPad Pro, Watch Ultra 2, AirPods, Trade In, and Card',
      selector: '.apple-promo-grid'
    },
    {
      key: 'entertainment-carousel',
      name: 'Apple TV+ Entertainment Stream',
      defaultLayout: 'promo_banner',
      supportsMultiProduct: false,
      description: 'Cinematic Apple TV+ originals preview with stream controls',
      selector: '.apple-entertainment-section'
    },
  ],

  Support: [], // Apple Support has fixed guides; no dynamic configurable sections
};

// ─── Normalization & Category Matching ────────────────────────────────────────
export const normalise = (str) =>
  (str || '').toLowerCase().replace(/[\s\-_&()]/g, '');

export function categoryMatches(section, catValue) {
  if (!section || !catValue) return false;
  const want = normalise(catValue);
  const secCat = normalise(section.category);
  const secTarget = normalise(section.target_page);

  if (want === 'home' || want === 'front') {
    return secCat === 'home' || secCat === 'front' || secTarget === 'home' || secTarget === 'front';
  }
  if (want === 'homenew' || want === 'newhome') {
    return secCat === 'homenew' || secCat === 'newhome' || secTarget === 'homenew' || secTarget === 'newhome';
  }
  if (want === 'tvhome' || want === 'tvamphome' || want === 'tvandhome') {
    return (
      secCat === 'tvhome' || secCat === 'tvamphome' || secCat === 'tvandhome' ||
      secTarget === 'tvhome' || secTarget === 'tvamphome' || secTarget === 'tvandhome'
    );
  }
  return secCat === want || secTarget === want;
}
