const db = require("./db");

async function seedIphoneData() {
  console.log("Seeding iPhone page dynamic data...");

  // 1. IPHONE SHOPPING OFFERS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS iphone_shopping_offers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_label VARCHAR(150) DEFAULT NULL,
      title VARCHAR(500) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url VARCHAR(1000) NOT NULL,
      link_url VARCHAR(1000) DEFAULT NULL,
      link_text VARCHAR(255) DEFAULT 'Learn more',
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [offerCount] = await db.query("SELECT COUNT(*) AS count FROM iphone_shopping_offers");
  if (offerCount[0].count === 0) {
    await db.query(`
      INSERT INTO iphone_shopping_offers (category_label, title, description, image_url, link_url, link_text, sort_order, is_active) VALUES
      ('Apple Trade In', 'Save with Apple Trade In.', 'Get credit toward your new iPhone when you trade in your eligible device.', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80', '/iphone#trade-in', 'Get an estimate', 1, 1),
      ('Apple Card', 'Pay monthly at 0% APR with Apple Card.', 'Choose Apple Card Monthly Installments to split up the cost of your new iPhone interest-free, plus earn 3% Daily Cash back.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80', '/iphone#apple-card', 'Learn more', 2, 1),
      ('Specialist Help', 'Shop one-on-one with an iPhone Specialist.', 'Find the right iPhone and accessories for you with personal assistance online or in an Apple Store.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80', '/iphone#specialist', 'Connect with a Specialist', 3, 1),
      ('Free Delivery', 'Fast, free delivery or easy 2-hour pickup.', 'Get free next-day shipping or pick up ready orders at your local Apple Store in as little as two hours.', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', '/iphone#delivery', 'Learn more', 4, 1)
    `);
    console.log("Seeded iphone_shopping_offers.");
  }

  // 2. IPHONE FEATURES TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS iphone_features (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_label VARCHAR(255) DEFAULT NULL,
      title VARCHAR(500) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url VARCHAR(1000) NOT NULL,
      link_url VARCHAR(1000) DEFAULT NULL,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [featureCount] = await db.query("SELECT COUNT(*) AS count FROM iphone_features");
  if (featureCount[0].count === 0) {
    await db.query(`
      INSERT INTO iphone_features (category_label, title, description, image_url, link_url, sort_order, is_active) VALUES
      ('Apple Intelligence', 'Effortless and personal. Built into iPhone.', 'Apple Intelligence helps you write, express yourself, and get things done with ease while keeping your data private and secure.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80', '/iphone#apple-intelligence', 1, 1),
      ('Camera', 'A camera system so advanced, it thinks like a photographer.', 'Capture stunning photos and videos with the most powerful iPhone camera system ever.', 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80', '/iphone#camera', 2, 1),
      ('Performance', 'All the power you will ever need.', 'The A18 Pro chip delivers the fastest performance ever in a smartphone.', 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&auto=format&fit=crop&q=80', '/iphone#performance', 3, 1),
      ('Battery Life', 'All-day battery life. All night too.', 'With the longest battery life ever in iPhone and fast charging support, you can stay connected all day without worry.', 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&auto=format&fit=crop&q=80', '/iphone#battery', 4, 1),
      ('Display', 'Look closer. It is extraordinary.', 'The Super Retina XDR display with ProMotion technology delivers breathtaking visuals with up to 2000 nits of brightness.', 'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=800&auto=format&fit=crop&q=80', '/iphone#display', 5, 1)
    `);
    console.log("Seeded iphone_features.");
  }

  // 3. IPHONE LINEUP PRODUCTS
  await db.query("DELETE FROM products WHERE category = 'iPhone'");

  await db.query(`
    INSERT INTO products (title, description, price_upfront, price_monthly, lease_monthly, image_url, category, badge_text, colors, stock, status, is_active, learn_more_link, buy_link, buy_text) VALUES
    ('iPhone Duo', 'Hello, hello. Two displays in perfect harmony. The most versatile iPhone ever designed for the way you live.', 1199.00, 99.92, 33.99, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80', 'iPhone', 'New', '[\"#1d1d1f\", \"#e3e4e5\", \"#b8cddc\", \"#c8a9a5\"]', 40, 'Active', 1, '/iphone#iphone-duo', '/store', 'Buy'),
    ('iPhone 18 Pro', 'Titanium. So strong. So light. So Pro. Featuring the A18 Pro chip and the most advanced iPhone camera system ever.', 999.00, 83.25, 27.99, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80', 'iPhone', 'New A18 Pro chip', '[\"#1d1d1f\", \"#e8e2d8\", \"#4e5664\", \"#6f5c4e\"]', 50, 'Active', 1, '/iphone#iphone-18-pro', '/store', 'Buy'),
    ('iPhone Air', 'Impossibly thin. Amazingly capable. The thinnest iPhone ever at just 5.5mm with an all-day battery.', 899.00, 74.92, 24.99, 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&auto=format&fit=crop&q=80', 'iPhone', 'Thinnest iPhone ever', '[\"#1d1d1f\", \"#e3e4e5\", \"#b8cddc\", \"#d1cdde\"]', 60, 'Active', 1, '/iphone#iphone-air', '/store', 'Buy'),
    ('iPhone 17', 'A total upgrade. Brilliant new camera. Blazing A17 chip. Gorgeous new colors. All backed by all-day battery life.', 799.00, 66.58, 22.99, 'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=800&auto=format&fit=crop&q=80', 'iPhone', 'A17 chip', '[\"#1d1d1f\", \"#e3e4e5\", \"#2f5b88\", \"#d94e67\"]', 70, 'Active', 1, '/iphone#iphone-17', '/store', 'Buy'),
    ('iPhone 17e', 'A whole new level of fun. Dynamic Island, a powerful camera, and an incredible chip at an incredible price.', 599.00, 49.92, 16.99, 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&auto=format&fit=crop&q=80', 'iPhone', 'Great value', '[\"#1d1d1f\", \"#e3e4e5\", \"#d94e67\", \"#e4b238\"]', 80, 'Active', 1, '/iphone#iphone-17e', '/store', 'Buy')
  `);
  console.log("Seeded all 5 iPhone lineup products.");
  console.log("iPhone data seeding completed successfully.");
}

if (require.main === module) {
  seedIphoneData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedIphoneData;
