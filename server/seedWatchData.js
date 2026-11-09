const db = require("./db");

async function seedWatchData() {
  console.log("Seeding Watch page dynamic data...");

  // 1. WATCH LINEUP TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS watch_lineup (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      badge VARCHAR(255) DEFAULT NULL,
      image_url TEXT NOT NULL,
      colors_json JSON DEFAULT NULL,
      description TEXT DEFAULT NULL,
      price_text VARCHAR(255) DEFAULT NULL,
      lease_text VARCHAR(255) DEFAULT NULL,
      price_upfront DECIMAL(10,2) DEFAULT NULL,
      price_monthly DECIMAL(10,2) DEFAULT NULL,
      lease_monthly DECIMAL(10,2) DEFAULT NULL,
      learn_more_url TEXT DEFAULT NULL,
      buy_url TEXT DEFAULT NULL,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Ensure extra price columns exist if table was previously created with older schema
  const watchCols = [
    ["price_upfront", "DECIMAL(10,2) DEFAULT NULL"],
    ["price_monthly", "DECIMAL(10,2) DEFAULT NULL"],
    ["lease_monthly", "DECIMAL(10,2) DEFAULT NULL"],
  ];

  for (const [colName, colDef] of watchCols) {
    const [existing] = await db.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'watch_lineup' AND COLUMN_NAME = ?`,
      [colName]
    );
    if (existing.length === 0) {
      await db.query(`ALTER TABLE watch_lineup ADD COLUMN ${colName} ${colDef}`);
      console.log(`Added column ${colName} to watch_lineup.`);
    }
  }

  // Refresh watch_lineup data
  await db.query("DELETE FROM watch_lineup");

  await db.query(`
    INSERT INTO watch_lineup 
    (product_name, badge, image_url, colors_json, description, price_text, lease_text, price_upfront, price_monthly, lease_monthly, learn_more_url, buy_url, sort_order, is_active)
    VALUES
    (
      'Apple Watch Series 12',
      'New',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      '["#47372F", "#E6D2B2", "#171717", "#A7A7A7", "#F2E5C1", "#D8D3CB", "#252B39"]',
      'The ultimate way to watch your health.',
      'From $399 or $33.25/mo. for 12 mo.*',
      'Lease from $11.99/mo. for 24 mo. with Apple Upgrade.**',
      399.00,
      33.25,
      11.99,
      '/watch/series-12',
      '/store',
      1,
      1
    ),
    (
      'Apple Watch Ultra 4',
      'New',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      '["#C7C1B8", "#171717", "#E45A25"]',
      'The ultimate sports and adventure watch.',
      'From $799 or $66.58/mo. for 12 mo.*',
      'Lease from $24.99/mo. for 24 mo. with Apple Upgrade.**',
      799.00,
      66.58,
      24.99,
      '/watch/ultra-4',
      '/store',
      2,
      1
    ),
    (
      'Apple Watch SE 3',
      '',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      '["#202A34", "#D8D3CB", "#F4E8CE"]',
      'Essential health features at a great value.',
      'From $249 or $20.75/mo. for 12 mo.*',
      '',
      249.00,
      20.75,
      NULL,
      '/watch/se-3',
      '/store',
      3,
      1
    ),
    (
      'Apple Watch Nike',
      'New Colors',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80',
      '["#171717", "#D4F064", "#0A4D68"]',
      'Move and groove with iconic Nike Sport Bands.',
      'From $399 or $33.25/mo. for 12 mo.*',
      'Lease from $11.99/mo. for 24 mo. with Apple Upgrade.**',
      399.00,
      33.25,
      11.99,
      '/watch/nike',
      '/store',
      4,
      1
    ),
    (
      'Apple Watch Hermès',
      'New',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      '["#C26330", "#1C1D21", "#3F2A1D"]',
      'The pinnacle of horology and Parisian luxury.',
      'From $1,249 or $104.08/mo. for 12 mo.*',
      'Lease from $39.99/mo. for 24 mo. with Apple Upgrade.**',
      1249.00,
      104.08,
      39.99,
      '/watch/hermes',
      '/store',
      5,
      1
    )
  `);
  console.log("Seeded watch_lineup successfully.");

  // 2. WATCH SHOPPING BENEFITS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS watch_shopping_benefits (
      id INT AUTO_INCREMENT PRIMARY KEY,
      eyebrow VARCHAR(255) DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url TEXT NOT NULL,
      link_url TEXT DEFAULT NULL,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query("DELETE FROM watch_shopping_benefits");

  await db.query(`
    INSERT INTO watch_shopping_benefits (eyebrow, title, description, image_url, link_url, sort_order, is_active)
    VALUES
    (
      'Apple Trade In',
      'Get credit toward a new Apple Watch.',
      'Trade in your eligible device for credit toward your next purchase, or recycle it for free.',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      '/watch#trade-in',
      1,
      1
    ),
    (
      'Monthly Payments',
      'Pay 0% APR with Apple Card.',
      'Choose easy monthly installments with 0% APR when you pay with Apple Card.',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80',
      '/watch#apple-card',
      2,
      1
    ),
    (
      'Free Delivery',
      'Get free two-hour delivery from an Apple Store.',
      'Or free standard delivery on all eligible online orders.',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
      '/watch#delivery',
      3,
      1
    ),
    (
      'Specialist Support',
      'Shop with a Specialist online or in a store.',
      'Connect with a Specialist who can help you choose the right watch and band.',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      '/watch#specialist',
      4,
      1
    )
  `);
  console.log("Seeded watch_shopping_benefits successfully.");

  // 3. PRODUCTS TABLE (CATEGORY = 'Watch')
  await db.query("DELETE FROM products WHERE category = 'Watch'");

  await db.query(`
    INSERT INTO products 
    (title, description, price_upfront, price_monthly, lease_monthly, image_url, category, badge_text, colors, stock, status, is_active, learn_more_link, buy_link, buy_text)
    VALUES
    (
      'Apple Watch Series 12',
      'The ultimate way to watch your health.',
      399.00,
      33.25,
      11.99,
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'Watch',
      'New',
      '["#47372F", "#E6D2B2", "#171717", "#A7A7A7", "#F2E5C1", "#D8D3CB", "#252B39"]',
      50,
      'Active',
      1,
      '/watch/series-12',
      '/store',
      'Buy'
    ),
    (
      'Apple Watch Ultra 4',
      'The ultimate sports and adventure watch.',
      799.00,
      66.58,
      24.99,
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'Watch',
      'New',
      '["#C7C1B8", "#171717", "#E45A25"]',
      35,
      'Active',
      1,
      '/watch/ultra-4',
      '/store',
      'Buy'
    ),
    (
      'Apple Watch SE 3',
      'Essential health features at a great value.',
      249.00,
      20.75,
      NULL,
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      'Watch',
      '',
      '["#202A34", "#D8D3CB", "#F4E8CE"]',
      60,
      'Active',
      1,
      '/watch/se-3',
      '/store',
      'Buy'
    ),
    (
      'Apple Watch Nike',
      'Move and groove with iconic Nike Sport Bands.',
      399.00,
      33.25,
      11.99,
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80',
      'Watch',
      'New Colors',
      '["#171717", "#D4F064", "#0A4D68"]',
      40,
      'Active',
      1,
      '/watch/nike',
      '/store',
      'Buy'
    ),
    (
      'Apple Watch Hermès',
      'The pinnacle of horology and Parisian luxury.',
      1249.00,
      104.08,
      39.99,
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'Watch',
      'New',
      '["#C26330", "#1C1D21", "#3F2A1D"]',
      20,
      'Active',
      1,
      '/watch/hermes',
      '/store',
      'Buy'
    )
  `);
  console.log("Seeded Watch products into products table.");
  console.log("Apple Watch data seeding completed successfully.");
}

if (require.main === module) {
  seedWatchData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedWatchData;
