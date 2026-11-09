const db = require("./db");

async function seedMacData() {
  console.log("Seeding Mac page dynamic data...");

  // 1. MAC SHOP BENEFITS
  await db.query(`
    CREATE TABLE IF NOT EXISTS mac_shop_benefits (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url VARCHAR(1000) NOT NULL,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [benefitCount] = await db.query("SELECT COUNT(*) AS count FROM mac_shop_benefits");
  if (benefitCount[0].count === 0) {
    await db.query(`
      INSERT INTO mac_shop_benefits (title, description, image_url, sort_order, is_active) VALUES
      ('Mac Trade In', 'Trade in your current device for credit toward a new Mac. Or recycle it for free.', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80', 1, 1),
      ('Apple Card Monthly Installments', 'Pay 0% APR over 12 months with Apple Card and earn 3% Daily Cash back with every purchase.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80', 2, 1),
      ('Customize Your Mac', 'Choose your chip, unified memory, SSD storage, and color finish to configure your dream setup.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', 3, 1),
      ('Free Next-Day Delivery', 'Enjoy free shipping on all orders or convenient pickup at your local Apple Store.', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', 4, 1),
      ('Shop with a Specialist', 'Connect one-on-one with a Mac Specialist online or in store for personalized advice.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80', 5, 1)
    `);
    console.log("Seeded mac_shop_benefits.");
  }

  // 2. MAC GET TO KNOW
  await db.query(`
    CREATE TABLE IF NOT EXISTS mac_get_to_know (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url VARCHAR(1000) NOT NULL,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [gtkCount] = await db.query("SELECT COUNT(*) AS count FROM mac_get_to_know");
  if (gtkCount[0].count === 0) {
    await db.query(`
      INSERT INTO mac_get_to_know (title, description, image_url, sort_order, is_active) VALUES
      ('Getting Started on Mac', 'Easy to learn. Astoundingly powerful. Mac makes work, study, and creativity completely intuitive.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80', 1, 1),
      ('Performance & Battery Life', 'Go faster and last longer. Apple silicon delivers exceptional speed with all-day battery life.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80', 2, 1),
      ('Mac and iPhone Continuity', 'The ultimate dream team. Copy on iPhone and paste on Mac. Take calls and messages effortlessly.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80', 3, 1),
      ('Compatibility with Your Apps', 'All your favorite apps run at blisteringly fast speeds — Microsoft 365, Adobe Creative Cloud, and more.', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80', 4, 1),
      ('Apple Intelligence on macOS', 'Personal, private, powerful intelligence integrated seamlessly across macOS Sequoia to help you create and express yourself.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', 5, 1)
    `);
    console.log("Seeded mac_get_to_know.");
  }

  // 3. MAC HELP ME CHOOSE
  await db.query(`
    CREATE TABLE IF NOT EXISTS mac_help_me_choose (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      button_text VARCHAR(100) DEFAULT NULL,
      button_url VARCHAR(1000) DEFAULT NULL,
      image_url VARCHAR(1000) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [hmcCount] = await db.query("SELECT COUNT(*) AS count FROM mac_help_me_choose");
  if (hmcCount[0].count === 0) {
    await db.query(`
      INSERT INTO mac_help_me_choose (title, description, button_text, button_url, image_url, is_active) VALUES
      ('Find the right Mac for you.', 'Answer a few quick questions to find the laptop or desktop that perfectly matches your workflow, performance needs, and budget.', 'Answer a few questions', '/mac#compare', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', 1)
    `);
    console.log("Seeded mac_help_me_choose.");
  }

  // 4. MAC LINEUP PRODUCTS
  // Remove the old dummy "mac" product with id 2 or title 'mac'
  await db.query(`DELETE FROM products WHERE id = 2 AND title = 'mac'`);

  const [macProds] = await db.query("SELECT COUNT(*) AS count FROM products WHERE LOWER(category) LIKE 'mac%'");
  if (macProds[0].count === 0) {
    await db.query(`
      INSERT INTO products (title, description, price_upfront, price_monthly, lease_monthly, image_url, category, badge_text, stock, status, is_active, learn_more_link, buy_link, buy_text) VALUES
      ('MacBook Air 13” and 15”', 'Strikingly thin and fast so you can work, play, or create anywhere.', 1099.00, 91.58, 29.99, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', 'Mac Laptops', 'Apple M3 chip', 50, 'Active', 1, '/mac#macbook-air', '/store', 'Buy ›'),
      ('MacBook Pro 14” and 16”', 'The ultimate pro laptop with M3 Pro and M3 Max for extreme workflows.', 1599.00, 133.25, 45.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80', 'Mac Laptops', 'Supercharged by M3', 40, 'Active', 1, '/mac#macbook-pro', '/store', 'Buy ›'),
      ('iMac 24”', 'An all-in-one powerhouse with a stunning 24-inch 4.5K Retina display.', 1299.00, 108.25, 34.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', 'Mac Desktops', 'Apple M3 chip', 35, 'Active', 1, '/mac#imac', '/store', 'Buy ›'),
      ('Mac mini', 'More muscle. More hustle. Built for Apple Intelligence in a 5-inch design.', 599.00, 49.91, 16.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', 'Mac Desktops', 'New M4 chip', 60, 'Active', 1, '/mac#mac-mini', '/store', 'Buy ›'),
      ('Mac Studio', 'Outrageous performance and extensive connectivity for studio creators.', 1999.00, 166.58, 55.99, 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80', 'Mac Desktops', 'M2 Max or M2 Ultra', 25, 'Active', 1, '/mac#mac-studio', '/store', 'Buy ›'),
      ('Studio Display', '27-inch 5K Retina display, 12MP camera with Center Stage, and studio-quality mics.', 1599.00, 133.25, 42.99, 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80', 'Mac Displays', '5K Retina Display', 30, 'Active', 1, '/mac#studio-display', '/store', 'Buy ›'),
      ('Pro Display XDR', '32-inch 6K Retina display with 1,600 nits peak brightness for pro grading and editing.', 4999.00, 416.58, 129.99, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80', 'Mac Displays', 'Pro HDR 6K', 15, 'Active', 1, '/mac#pro-display-xdr', '/store', 'Buy ›')
    `);
    console.log("Seeded Mac lineup products.");
  }

  console.log("Mac page dynamic data seeded successfully.");
}

if (require.main === module) {
  seedMacData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedMacData;
