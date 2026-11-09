const db = require("./db");

async function seedStoreData() {
  console.log("Seeding Store Sections dynamic data...");

  // 1. STORE HELP
  await db.query(`
    CREATE TABLE IF NOT EXISTS store_help_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url TEXT DEFAULT NULL,
      link TEXT DEFAULT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [helpCount] = await db.query("SELECT COUNT(*) AS count FROM store_help_sections");
  if (helpCount[0].count === 0) {
    await db.query(`
      INSERT INTO store_help_sections (label, title, description, image_url, link, is_active) VALUES
      ('APPLE SPECIALIST', 'Shop one on one with a Specialist. Online or in a store.', 'Get expert shopping advice, compare products, and find the right device for you.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80', '/store', 1),
      ('TODAY AT APPLE', 'Join free sessions at your Apple Store.', 'Learn the basics or take your creative projects further with hands-on sessions.', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80', '/store', 1),
      ('PERSONAL SETUP', 'Get to know your new Apple device.', 'Connect with a Specialist who can walk you through setup and guide you through key features.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80', '/store', 1),
      ('GENIUS BAR', 'Get expert service and support.', 'From hardware repairs to software troubleshooting, our certified technicians are here to help.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80', '/support', 1)
    `);
    console.log("Seeded store_help_sections.");
  }

  // 2. STORE DIFFERENCE
  await db.query(`
    CREATE TABLE IF NOT EXISTS store_difference_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      icon_url TEXT DEFAULT NULL,
      image_url TEXT DEFAULT NULL,
      card_size VARCHAR(50) DEFAULT 'standard',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [diffCount] = await db.query("SELECT COUNT(*) AS count FROM store_difference_sections");
  if (diffCount[0].count === 0) {
    await db.query(`
      INSERT INTO store_difference_sections (label, title, description, icon_url, image_url, card_size, is_active) VALUES
      ('EXCHANGE & CREDIT', 'Trade in your current device. Get credit toward a new one.', 'Trade in an eligible device for instant credit toward your purchase or recycle it for free.', NULL, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80', 'large', 1),
      ('FAST DELIVERY', 'Enjoy free delivery, or easy pickup at an Apple Store.', 'Choose free two-hour delivery from an Apple Store, free next-day delivery, or store pickup.', NULL, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', 'normal', 1),
      ('APPLE CARD', 'Pay over time, interest-free with Apple Card Monthly Installments.', 'Get 3% Daily Cash back with every purchase and choose interest-free monthly payments.', NULL, 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80', 'normal', 1),
      ('CUSTOM ENGRAVING', 'Make them yours. Engrave emoji, names, and initials for free.', 'Personalize AirPods, AirTag, Apple Pencil, and iPad with free custom engraving.', NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 'large', 1)
    `);
    console.log("Seeded store_difference_sections.");
  }

  // 3. STORE SOUND
  await db.query(`
    CREATE TABLE IF NOT EXISTS store_sound_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url TEXT DEFAULT NULL,
      badge_text VARCHAR(255) DEFAULT NULL,
      price VARCHAR(100) DEFAULT NULL,
      card_size VARCHAR(50) DEFAULT 'standard',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [soundCount] = await db.query("SELECT COUNT(*) AS count FROM store_sound_sections");
  if (soundCount[0].count === 0) {
    await db.query(`
      INSERT INTO store_sound_sections (label, title, description, image_url, badge_text, price, card_size, is_active) VALUES
      ('SPATIAL AUDIO', 'AirPods Pro 2', 'Pro-level Active Noise Cancellation with Transparency mode and USB-C.', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80', 'Free Engraving', '$249.00', 'large', 1),
      ('ACOUSTIC MASTERPIECE', 'AirPods Max', 'High-fidelity audio with effortless setup, Active Noise Cancellation, and new colors.', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80', 'New Colors', '$549.00', 'normal', 1),
      ('SURROUND SOUND', 'HomePod', 'Immersive, high-fidelity audio with intelligent Siri assistant built-in.', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', 'Popular', '$299.00', 'normal', 1),
      ('NEXT-GEN SOUND', 'AirPods 4', 'Iconic design reimagined with exceptional acoustic clarity and open-ear comfort.', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', 'From $129', '$129.00', 'normal', 1)
    `);
    console.log("Seeded store_sound_sections.");
  }

  // 4. STORE EXPERIENCE
  await db.query(`
    CREATE TABLE IF NOT EXISTS store_experience_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url TEXT DEFAULT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [expCount] = await db.query("SELECT COUNT(*) AS count FROM store_experience_sections");
  if (expCount[0].count === 0) {
    await db.query(`
      INSERT INTO store_experience_sections (label, title, description, image_url, is_active) VALUES
      ('APPLE ONE', 'Bundle up to six Apple services. And enjoy more for less.', 'Apple Music, Apple TV+, Apple Arcade, iCloud+, Fitness+, and Apple News+ all in one.', 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&auto=format&fit=crop&q=80', 1),
      ('APPLE PAY', 'The safer, easier way to pay in stores and online.', 'Pay touch-free with Face ID or Touch ID. Private, secure, and accepted worldwide.', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80', 1),
      ('APPLE FITNESS+', 'From HIIT to Meditation, there is something for everyone.', 'Stay motivated with personalized metrics from Apple Watch on every workout.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', 1),
      ('APPLE TV+', 'Stream award-winning Apple Originals.', 'Watch gripping dramas, star-studded comedies, and groundbreaking documentaries.', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80', 1)
    `);
    console.log("Seeded store_experience_sections.");
  }

  // 5. STORE SAVINGS
  await db.query(`
    CREATE TABLE IF NOT EXISTS store_savings_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url TEXT DEFAULT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [savCount] = await db.query("SELECT COUNT(*) AS count FROM store_savings_sections");
  if (savCount[0].count === 0) {
    await db.query(`
      INSERT INTO store_savings_sections (label, title, description, image_url, is_active) VALUES
      ('APPLE CARD', 'Get 3% Daily Cash back with Apple Card.', 'And pay interest-free over time when you choose to pay monthly with Apple Card.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80', 1),
      ('EDUCATION PRICING', 'Save on Mac or iPad with Apple education pricing.', 'Available to current and newly accepted college students, parents, teachers, and staff.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80', 1),
      ('CERTIFIED REFURBISHED', 'Shop refurbished products backed by a one-year warranty.', 'Thoroughly inspected, cleaned, and tested with genuine Apple replacement parts.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80', 1),
      ('BUSINESS SOLUTIONS', 'Special pricing and finance options for business.', 'From flexible payment terms to Apple hardware advisors tailored for your team.', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80', 1)
    `);
    console.log("Seeded store_savings_sections.");
  }

  // 6. Fix broken 404 image URLs in products table
  // Replace the expired Apple CDN links with verified 200 OK images
  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%store-card-50-trade-in%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%store-card-50-apple-card%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%store-card-50-subscriptions%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%store-card-50-today-at-apple%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%store-card-50-apple-intelligence%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%watch-ultra-2%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%vision-pro%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%airpods-pro-2%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%apple-tv-4k%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%airpods-max%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%homepod-mini%'
  `);

  await db.query(`
    UPDATE products
    SET image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    WHERE image_url LIKE '%magsafe-charger%'
  `);

  // 7. Seed Accessories if needed
  const [accCount] = await db.query("SELECT COUNT(*) AS count FROM products WHERE LOWER(category) = 'accessories' AND is_active = TRUE");
  if (accCount[0].count < 4) {
    await db.query(`
      INSERT INTO products (title, description, price_upfront, image_url, category, badge_text, stock, status, is_active) VALUES
      ('MagSafe Charger (1m)', 'Snap on fast wireless charging up to 25W.', 39.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 'Accessories', 'Popular', 50, 'Active', 1),
      ('Apple Pencil Pro', 'Engineered for limitless creativity with pixel-perfect precision.', 129.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80', 'Accessories', 'New', 40, 'Active', 1),
      ('Magic Keyboard for iPad Pro', 'Comfortable typing, a glass trackpad, and a sleek aluminum palm rest.', 299.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', 'Accessories', 'New', 30, 'Active', 1),
      ('iPhone 16 Clear Case with MagSafe', 'Thin, light, and easy to grip with Camera Control protection.', 49.00, 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80', 'Accessories', 'Featured', 60, 'Active', 1),
      ('AirTag 4 Pack', 'Keep track of your keys, wallet, luggage, and backpack in the Find My app.', 99.00, 'https://images.unsplash.com/photo-1628191010210-a59de33e5941?w=800&auto=format&fit=crop&q=80', 'Accessories', 'Free Engraving', 80, 'Active', 1),
      ('Apple Watch Sport Loop', 'Soft, breathable, and lightweight with an easily adjustable hook-and-loop fastener.', 49.00, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80', 'Accessories', 'New Colors', 45, 'Active', 1)
    `);
    console.log("Seeded accessories into products table.");
  }

  console.log("Store Sections dynamic data seeded successfully and product image URLs updated.");
}

if (require.main === module) {
  seedStoreData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedStoreData;
