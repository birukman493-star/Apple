const db = require("./db");

async function seedIpadData() {
  console.log("Seeding iPad page dynamic data...");

  // 1. IPAD SHOP BENEFITS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS ipad_shop_benefits (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(150) DEFAULT NULL,
      title VARCHAR(500) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url VARCHAR(1000) NOT NULL,
      link VARCHAR(1000) DEFAULT NULL,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [benefitCount] = await db.query("SELECT COUNT(*) AS count FROM ipad_shop_benefits");
  if (benefitCount[0].count === 0) {
    await db.query(`
      INSERT INTO ipad_shop_benefits (label, title, description, image_url, link, sort_order, is_active) VALUES
      ('Apple Trade In', 'Save on a new iPad with Apple Trade In.', 'Get credit toward your new iPad when you trade in your eligible device. Good for your pocket and the planet.', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80', '/ipad#trade-in', 1, 1),
      ('Apple Card', 'Pay monthly at 0% APR with Apple Card.', 'Choose Apple Card Monthly Installments to split up the cost of your new iPad interest-free, plus earn 3% Daily Cash back.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80', '/ipad#apple-card', 2, 1),
      ('Specialist Help', 'Shop one-on-one with an iPad Specialist.', 'Find the right iPad and accessories for you with personal assistance online or in an Apple Store.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80', '/ipad#specialist', 3, 1),
      ('Free Delivery & Pickup', 'Fast, free delivery or easy 2-hour pickup.', 'Get free next-day shipping or pick up ready orders at your local Apple Store in as little as two hours.', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', '/ipad#delivery', 4, 1),
      ('Custom Engraving', 'Make it distinctly yours with free engraving.', 'Add a free personalized message or emoji to your iPad and Apple Pencil only at Apple.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', '/ipad#engraving', 5, 1)
    `);
    console.log("Seeded ipad_shop_benefits.");
  }

  // 2. IPAD GET TO KNOW TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS ipad_get_to_know (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) DEFAULT NULL,
      title VARCHAR(500) NOT NULL,
      description TEXT DEFAULT NULL,
      detail_description TEXT DEFAULT NULL,
      image_url VARCHAR(1000) NOT NULL,
      detail_image_url VARCHAR(1000) DEFAULT NULL,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [gtkCount] = await db.query("SELECT COUNT(*) AS count FROM ipad_get_to_know");
  if (gtkCount[0].count === 0) {
    await db.query(`
      INSERT INTO ipad_get_to_know (label, title, description, detail_description, image_url, detail_image_url, sort_order, is_active) VALUES
      ('Apple Intelligence', 'Effortless and personal. Built into iPad.', 'Apple Intelligence helps you write, express yourself, and get things done with ease while keeping your data private.', 'Apple Intelligence is the personal intelligence system that helps you write, express yourself, and get things done effortlessly. With groundbreaking privacy protections, it gives you peace of mind that no one else can access your data.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80', 1, 1),
      ('Productivity', 'Power through your work from anywhere.', 'Run pro apps, take handwritten notes, and multitask with Stage Manager on stunning Liquid Retina displays.', 'iPad combines the power of a computer with the versatility and mobility of a tablet. Edit 4K videos, create 3D renders, annotate PDFs with Apple Pencil, and run multiple apps side by side.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80', 2, 1),
      ('Creativity', 'Your dream digital sketchbook and studio.', 'Bring your vision to life with pixel-perfect precision using Apple Pencil Pro and incredible creative apps.', 'Whether you are painting illustrations in Procreate, designing logos, or animating motion graphics, iPad gives you an ultra-responsive digital canvas with barrel roll, squeeze, and haptic feedback.', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop&q=80', 3, 1),
      ('Portability & Battery', 'Incredibly thin and light with all-day battery.', 'Slip it in your bag and go. With up to 10 hours of battery life and fast 5G connectivity, work anywhere.', 'Engineered for ultimate mobility, iPad delivers all-day performance in remarkably thin profiles. Fast Wi-Fi 6E and 5G cellular ensure you stay connected wherever inspiration strikes.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop&q=80', 4, 1),
      ('iPadOS', 'Intuitive, versatile, and deeply capable.', 'Designed specifically for iPad, iPadOS lets you work with touch, Apple Pencil, keyboard, and trackpad effortlessly.', 'iPadOS is designed from the ground up for the large Multi-Touch display. Seamlessly move between apps with Stage Manager, jot notes with Quick Note, and customize your Lock Screen.', 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=1200&auto=format&fit=crop&q=80', 5, 1)
    `);
    console.log("Seeded ipad_get_to_know.");
  }

  // 3. IPAD LINEUP PRODUCTS
  await db.query("DELETE FROM products WHERE category = 'iPad'");

  await db.query(`
    INSERT INTO products (title, description, price_upfront, price_monthly, lease_monthly, image_url, category, badge_text, colors, stock, status, is_active, learn_more_link, buy_link, buy_text) VALUES
    (
      'iPad Pro',
      'The ultimate iPad experience with the breakthrough Ultra Retina XDR display and outrageous M4 performance.',
      999.00,
      83.25,
      27.99,
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
      'iPad',
      'New M4 chip',
      '["#1d1d1f", "#e3e4e5"]',
      50,
      'Active',
      1,
      '/ipad#ipad-pro',
      '/store',
      'Buy ›'
    ),
    (
      'iPad Air',
      'Fresh Air. Supercharged by Apple M2 with choice of two sizes and all-day battery life.',
      599.00,
      49.91,
      16.99,
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80',
      'iPad',
      'Supercharged by M2',
      '["#68696d", "#b8cddc", "#d1cdde", "#e2dcce"]',
      60,
      'Active',
      1,
      '/ipad#ipad-air',
      '/store',
      'Buy ›'
    ),
    (
      'iPad (10th generation)',
      'Colorfully reimagined to be more capable, intuitive, and fun. The all-screen design for everyday essentials.',
      349.00,
      29.08,
      9.99,
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
      'iPad',
      'A14 Bionic chip',
      '["#2f5b88", "#d94e67", "#e4b238", "#e3e4e5"]',
      75,
      'Active',
      1,
      '/ipad#ipad',
      '/store',
      'Buy ›'
    ),
    (
      'iPad mini',
      'Mega power. Mini size. Built for Apple Intelligence with the blazing-fast A17 Pro chip.',
      499.00,
      41.58,
      13.99,
      'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop&q=80',
      'iPad',
      'New A17 Pro chip',
      '["#68696d", "#b8cddc", "#d1cdde", "#e2dcce"]',
      45,
      'Active',
      1,
      '/ipad#ipad-mini',
      '/store',
      'Buy ›'
    )
  `);
  console.log("Seeded all 4 iPad lineup products.");
  console.log("iPad data seeding completed successfully.");
}

if (require.main === module) {
  seedIpadData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedIpadData;
