const db = require("./db");

async function seedVisionData() {
  console.log("Seeding Vision Pro page dynamic data...");

  // 1. VISION CLOSER LOOK TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS vision_closer_look (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      image_url TEXT NOT NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query("DELETE FROM vision_closer_look");

  await db.query(`
    INSERT INTO vision_closer_look (title, description, image_url, display_order, is_active)
    VALUES
    (
      'Curved 3D Laminated Glass',
      'A singular piece of three-dimensionally formed laminated glass acts as an optical surface for the cameras and sensors.',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80',
      1,
      1
    ),
    (
      'Dual-Chip Power: M5 & R1',
      'The M5 chip delivers unprecedented standalone computing performance, while R1 processes 12 cameras, 5 sensors, and 6 microphones with virtually zero lag.',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      2,
      1
    ),
    (
      '23 Million Pixels Beyond 4K',
      'Custom micro-OLED display system fits 64 pixels into the space of a single iPhone pixel for mind-blowing resolution.',
      'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&auto=format&fit=crop&q=80',
      3,
      1
    ),
    (
      'Acoustic Ray-Tracing Audio',
      'Dual-driver audio pods deliver rich personalized sound that matches the acoustic properties of your room.',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      4,
      1
    ),
    (
      'Precision Eye & Hand Tracking',
      'High-speed cameras and LED rings track your eyes with surgical accuracy, making navigation as natural as looking and tapping.',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      5,
      1
    ),
    (
      'Dual Knit Band Ergonomics',
      '3D-knitted structure with overhead strap offers continuous breathability, cushioning, and effortless micro-adjustments.',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      6,
      1
    )
  `);
  console.log("Seeded vision_closer_look successfully.");

  // 2. PRODUCTS TABLE (CATEGORY = 'Vision')
  await db.query("DELETE FROM products WHERE category = 'Vision'");

  await db.query(`
    INSERT INTO products
    (title, description, price_upfront, price_monthly, lease_monthly, image_url, category, badge_text, colors, storage_options, stock, status, is_active, learn_more_link, buy_link, buy_text)
    VALUES
    (
      'Apple Vision Pro',
      'The era of spatial computing is here. Seamlessly blends digital content with your physical space, now powered by the M5 chip.',
      3499.00,
      291.58,
      99.99,
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80',
      'Vision',
      'New M5 Chip',
      '["#1D1D1F", "#E3E4E5"]',
      '["256GB", "512GB", "1TB"]',
      45,
      'Active',
      1,
      '/vision',
      '/store',
      'Buy'
    ),
    (
      'Apple Vision Pro Dual Knit Band',
      'Engineered with 3D knitting technology for supreme all-day comfort, upper strap distribution, and breathability.',
      99.00,
      8.25,
      NULL,
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'Vision',
      'New',
      '["#E8E2D8", "#1D1D1F", "#3B4754"]',
      '["S", "M", "L"]',
      80,
      'Active',
      1,
      '/vision',
      '/store',
      'Buy'
    ),
    (
      'Apple Vision Pro Travel Case',
      'Designed by Apple with a retractable handle and custom compartments for your battery, optical inserts, and accessories.',
      199.00,
      16.58,
      NULL,
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'Vision',
      '',
      '["#F5F5F7"]',
      '["Standard"]',
      60,
      'Active',
      1,
      '/vision',
      '/store',
      'Buy'
    ),
    (
      'ZEISS Optical Inserts',
      'Custom prescription inserts developed in partnership with ZEISS that attach magnetically to the optical system.',
      99.00,
      8.25,
      NULL,
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80',
      'Vision',
      'Prescription',
      '["#1D1D1F"]',
      '["Readers", "Prescription"]',
      100,
      'Active',
      1,
      '/vision',
      '/store',
      'Buy'
    ),
    (
      'Apple Vision Pro Battery',
      'Machined aluminum battery packs up to 2.5 hours of general use or up to 3 hours of video playback.',
      199.00,
      16.58,
      NULL,
      'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&auto=format&fit=crop&q=80',
      'Vision',
      '',
      '["#E3E4E5"]',
      '["Standard"]',
      75,
      'Active',
      1,
      '/vision',
      '/store',
      'Buy'
    )
  `);
  console.log("Seeded Vision products into products table.");
  console.log("Apple Vision Pro data seeding completed successfully.");
}

if (require.main === module) {
  seedVisionData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedVisionData;
