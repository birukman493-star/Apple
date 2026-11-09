
const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");

// ==================================================
// LOAD ENVIRONMENT VARIABLES
// ==================================================

dotenv.config({
    path: path.join(__dirname, ".env"),
    override: true,
});

// ==================================================
// DATABASE CONFIGURATION
// ==================================================

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "apple_store";
const DB_PORT = Number(process.env.DB_PORT) || 3306;

// Validate database name before using it as a SQL identifier.
if (!/^[a-zA-Z0-9_]+$/.test(DB_NAME)) {
    throw new Error(
        "Invalid DB_NAME. Use only letters, numbers, and underscores."
    );
}

console.log("Database configuration:");
console.log("DB_HOST:", DB_HOST);
console.log("DB_USER:", DB_USER);
console.log("DB_NAME:", DB_NAME);
console.log("DB_PORT:", DB_PORT);

// ==================================================
// SETUP DATABASE
// ==================================================

async function setupDatabase() {
    let connection;

    try {
        console.log("");
        console.log("=================================");
        console.log("DATABASE SETUP STARTING");
        console.log("=================================");

        // Connect to MySQL server.
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT,
            charset: "utf8mb4",
        });

        console.log("Connected to MySQL server.");

        // Create database if it does not exist.
        await connection.query(`
            CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
            CHARACTER SET utf8mb4
            COLLATE utf8mb4_unicode_ci
        `);

        console.log(`Database "${DB_NAME}" is ready.`);

        // Select database.
        await connection.query(`USE \`${DB_NAME}\``);

        console.log(`Using database "${DB_NAME}".`);

        // ==================================================
        // PRODUCTS
        // ==================================================


        // ==================================================
        // PRODUCTS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                badge_text VARCHAR(255) DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                price_upfront DECIMAL(12,2) DEFAULT NULL,
                price_monthly DECIMAL(12,2) DEFAULT NULL,
                lease_monthly DECIMAL(12,2) DEFAULT NULL,
                image_url TEXT,
                category VARCHAR(100) NOT NULL,
                learn_more_link TEXT DEFAULT NULL,
                buy_link TEXT DEFAULT NULL,
                buy_text VARCHAR(255) DEFAULT 'Buy',
                stock INT NOT NULL DEFAULT 0,
                discount_price DECIMAL(12,2) DEFAULT NULL,
                image_gallery JSON DEFAULT NULL,
                colors JSON DEFAULT NULL,
                storage_options JSON DEFAULT NULL,
                nav_visibility BOOLEAN NOT NULL DEFAULT TRUE,
                status ENUM('Active', 'Archived', 'Draft')
                    NOT NULL DEFAULT 'Active',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_products_category (category),
                INDEX idx_products_active (is_active),
                INDEX idx_products_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        // Add fields to an existing products table.
  
        // Add fields to an existing products table.
        const productColumns = [
            ["target_section", "VARCHAR(100) DEFAULT NULL"],
            ["stock", "INT NOT NULL DEFAULT 0"],
            ["discount_price", "DECIMAL(12,2) DEFAULT NULL"],
            ["image_gallery", "JSON DEFAULT NULL"],
            ["colors", "JSON DEFAULT NULL"],
            ["storage_options", "JSON DEFAULT NULL"],
            ["nav_visibility", "BOOLEAN NOT NULL DEFAULT TRUE"],
            ["status", "ENUM('Active','Archived','Draft') NOT NULL DEFAULT 'Active'"],
        ];

        for (const [columnName, columnDefinition] of productColumns) {
            const [existingColumns] = await connection.execute(
                `SELECT COLUMN_NAME
                 FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_SCHEMA = ?
                   AND TABLE_NAME = ?
                   AND COLUMN_NAME = ?`,
                [DB_NAME, "products", columnName]
            );

            if (existingColumns.length === 0) {
                await connection.query(
                    `ALTER TABLE products ADD COLUMN \`${columnName}\` ${columnDefinition}`
                );

                console.log(`Added missing column: ${columnName}`);
            }
        }

        

        // ==================================================
// WEBSITE SECTIONS (CMS)
// ==================================================

await connection.query(`
    CREATE TABLE IF NOT EXISTS website_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_name VARCHAR(255) DEFAULT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT DEFAULT NULL,
        category VARCHAR(100) DEFAULT NULL,
        target_page VARCHAR(100) NOT NULL,
        product_id INT DEFAULT NULL,
        image_url TEXT DEFAULT NULL,
        button_text VARCHAR(255) DEFAULT 'Learn More',
        button_link TEXT DEFAULT NULL,
        layout_type VARCHAR(50) DEFAULT 'hero',
        display_order INT DEFAULT 0,
        status ENUM('Draft', 'Published') NOT NULL DEFAULT 'Draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_website_section_product
            FOREIGN KEY (product_id)
            REFERENCES products(id)
            ON DELETE SET NULL,
        INDEX idx_website_sections_category (category),
        INDEX idx_website_sections_page (target_page),
        INDEX idx_website_sections_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`);

// Backward-compatible: add category column if missing
const [categoryColCheck] = await connection.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'website_sections' AND COLUMN_NAME = 'category'
`, [DB_NAME]);

if (categoryColCheck.length === 0) {
    await connection.query(`
        ALTER TABLE website_sections
        ADD COLUMN category VARCHAR(100) DEFAULT NULL AFTER subtitle,
        ADD INDEX idx_website_sections_category (category)
    `);
    await connection.query(`
        UPDATE website_sections
        SET category = target_page
        WHERE category IS NULL OR category = ''
    `);
}

// Backward-compatible: add section_name column if missing
const [sectionNameColCheck] = await connection.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'website_sections' AND COLUMN_NAME = 'section_name'
`, [DB_NAME]);

if (sectionNameColCheck.length === 0) {
    await connection.query(`
        ALTER TABLE website_sections
        ADD COLUMN section_name VARCHAR(255) DEFAULT NULL AFTER id
    `);
    console.log('Added section_name column to website_sections.');
}

// Backward-compatible: add section_key, badge_text, assigned_product_ids, background_theme if missing
const [allCols] = await connection.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'website_sections'
`, [DB_NAME]);
const colNames = allCols.map(c => c.COLUMN_NAME);

if (!colNames.includes('section_key')) {
    await connection.query(`ALTER TABLE website_sections ADD COLUMN section_key VARCHAR(100) DEFAULT NULL AFTER section_name`);
    console.log('Added section_key column to website_sections.');
}
// Ensure badge_text column exists and is large enough
if (!colNames.includes('badge_text')) {
    await connection.query(`ALTER TABLE website_sections ADD COLUMN badge_text VARCHAR(500) DEFAULT NULL AFTER subtitle`);
    console.log('Added badge_text column to website_sections.');
} else {
    await connection.query(`ALTER TABLE website_sections MODIFY badge_text VARCHAR(500) DEFAULT NULL AFTER subtitle`);
    console.log('Ensured badge_text column size is sufficient.');
}

if (!colNames.includes('assigned_product_ids')) {
    await connection.query(`ALTER TABLE website_sections ADD COLUMN assigned_product_ids JSON DEFAULT NULL AFTER product_id`);
    console.log('Added assigned_product_ids column to website_sections.');
}
if (!colNames.includes('background_theme')) {
    await connection.query(`ALTER TABLE website_sections ADD COLUMN background_theme VARCHAR(50) DEFAULT 'default' AFTER layout_type`);
    console.log('Added background_theme column to website_sections.');
}
if (!colNames.includes('description')) {
    await connection.query(`ALTER TABLE website_sections ADD COLUMN description TEXT DEFAULT NULL AFTER subtitle`);
    console.log('Added description column to website_sections.');
}
if (!colNames.includes('secondary_button_text')) {
    await connection.query(`ALTER TABLE website_sections ADD COLUMN secondary_button_text VARCHAR(255) DEFAULT NULL AFTER button_link`);
    console.log('Added secondary_button_text column to website_sections.');
}
if (!colNames.includes('secondary_button_link')) {
    await connection.query(`ALTER TABLE website_sections ADD COLUMN secondary_button_link TEXT DEFAULT NULL AFTER secondary_button_text`);
    console.log('Added secondary_button_link column to website_sections.');
}
if (!colNames.includes('video_url')) {
    await connection.query(`ALTER TABLE website_sections ADD COLUMN video_url TEXT DEFAULT NULL AFTER image_url`);
    console.log('Added video_url column to website_sections.');
}
if (!colNames.includes('background_color')) {
    await connection.query(`ALTER TABLE website_sections ADD COLUMN background_color VARCHAR(50) DEFAULT NULL AFTER background_theme`);
    console.log('Added background_color column to website_sections.');
}

console.log("Website sections table ready.");

        // Keep legacy active/inactive status consistent.
        await connection.query(`
            UPDATE products
            SET status = CASE
                WHEN is_active = 0 THEN 'Archived'
                WHEN status = 'Archived' THEN 'Active'
                ELSE status
            END
            WHERE status IS NULL
        `);

        console.log("Products table ready.");

        // ==================================================
        // MAC SHOP BENEFITS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS mac_shop_benefits (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Mac shop benefits table ready.");

        // ==================================================
        // MAC GET TO KNOW
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS mac_get_to_know (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Mac get to know table ready.");

        // ==================================================
        // MAC HELP ME CHOOSE
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS mac_help_me_choose (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                button_text VARCHAR(255) DEFAULT NULL,
                button_url TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Mac help me choose table ready.");

        // ==================================================
        // IPAD SHOP BENEFITS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS ipad_shop_benefits (
                id INT AUTO_INCREMENT PRIMARY KEY,
                label VARCHAR(255) DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                link TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("iPad shop benefits table ready.");

        // ==================================================
        // IPAD GET TO KNOW
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS ipad_get_to_know (
                id INT AUTO_INCREMENT PRIMARY KEY,
                label VARCHAR(255) DEFAULT NULL,
                title VARCHAR(500) NOT NULL,
                description TEXT DEFAULT NULL,
                detail_description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                detail_image_url TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("iPad get to know table ready.");

        // ==================================================
        // IPAD SIGNIFICANT OTHERS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS ipad_significant_others (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("iPad significant others table ready.");

        // ==================================================
        // AIRPODS NAVIGATION
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS airpods_nav_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                href VARCHAR(255) DEFAULT '#',
                icon VARCHAR(100) DEFAULT 'airpods',
                is_new BOOLEAN DEFAULT FALSE,
                display_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("AirPods navigation table ready.");

        // ==================================================
        // STORE HELP
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS store_help_sections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                label VARCHAR(255) DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                link TEXT DEFAULT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Store help table ready.");

        // ==================================================
        // STORE DIFFERENCE
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS store_difference_sections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                label VARCHAR(255) DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                icon_url TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                card_size ENUM('normal', 'large') DEFAULT 'normal',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Store difference table ready.");

        // ==================================================
        // STORE SOUND
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS store_sound_sections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                label VARCHAR(255) DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                badge_text VARCHAR(255) DEFAULT NULL,
                price VARCHAR(255) DEFAULT NULL,
                card_size ENUM('normal', 'large') DEFAULT 'normal',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Store sound table ready.");

        // ==================================================
        // STORE EXPERIENCE
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS store_experience_sections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                label VARCHAR(255) DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Store experience table ready.");

        // ==================================================
        // STORE SAVINGS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS store_savings_sections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                label VARCHAR(255) DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Store savings table ready.");

        // ==================================================
        // IPHONE SHOPPING OFFERS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS iphone_shopping_offers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_label VARCHAR(255) DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                link_text VARCHAR(255) DEFAULT NULL,
                link_url TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("iPhone shopping offers table ready.");

        // ==================================================
        // IPHONE FEATURES
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS iphone_features (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_label VARCHAR(255) DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                image_url TEXT DEFAULT NULL,
                link_text VARCHAR(255) DEFAULT NULL,
                link_url TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("iPhone features table ready.");

        // ==================================================
        // APPLE WATCH LINEUP
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS watch_lineup (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_name VARCHAR(255) NOT NULL,
                badge VARCHAR(255) DEFAULT NULL,
                image_url TEXT NOT NULL,
                colors_json JSON DEFAULT NULL,
                description TEXT DEFAULT NULL,
                price_text VARCHAR(255) DEFAULT NULL,
                lease_text VARCHAR(255) DEFAULT NULL,
                learn_more_url TEXT DEFAULT NULL,
                buy_url TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Watch lineup table ready.");

        // ==================================================
        // USERS - SIGNUP AND SIGNIN
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Users table ready.");

        // Add extra profile fields to users table if missing
        const userCols = [
            ["phone", "VARCHAR(50) DEFAULT NULL"],
            ["birthday", "VARCHAR(50) DEFAULT NULL"],
            ["country", "VARCHAR(100) DEFAULT 'United States'"],
            ["language", "VARCHAR(50) DEFAULT 'English'"],
            ["two_factor_enabled", "BOOLEAN DEFAULT TRUE"],
            ["shipping_address", "TEXT DEFAULT NULL"],
            ["billing_address", "TEXT DEFAULT NULL"],
        ];

        for (const [colName, colDef] of userCols) {
            const [existing] = await connection.execute(
                `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = ?`,
                [DB_NAME, colName]
            );
            if (existing.length === 0) {
                await connection.query(`ALTER TABLE users ADD COLUMN \`${colName}\` ${colDef}`);
                console.log(`Added user column: ${colName}`);
            }
        }



      

        // ==================================================
        // VISION PRO - CLOSER LOOK
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS vision_closer_look (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT NOT NULL,
                display_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_vision_active (is_active),
                INDEX idx_vision_order (display_order)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Vision closer look table ready.");

        // ==================================================
        // ORDERS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_number VARCHAR(100) NOT NULL UNIQUE,
                user_id INT DEFAULT NULL,
                customer_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255) NOT NULL,
                customer_phone VARCHAR(50) DEFAULT NULL,
                total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
                shipping_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
                payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') NOT NULL DEFAULT 'Pending',
                order_status ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Processing',
                shipping_address TEXT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_orders_user (user_id),
                INDEX idx_orders_status (order_status),
                INDEX idx_orders_payment (payment_status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Orders table ready.");

        // Add missing order columns for payment & checkout if not present
        const orderColumns = [
            ["payment_method", "VARCHAR(50) DEFAULT 'card'"],
            ["payment_reference", "VARCHAR(100) DEFAULT NULL"],
            ["delivery_method", "VARCHAR(50) DEFAULT 'shipping'"],
            ["subtotal_amount", "DECIMAL(12,2) NOT NULL DEFAULT 0.00"],
            ["tax_amount", "DECIMAL(12,2) NOT NULL DEFAULT 0.00"],
            ["order_notes", "TEXT DEFAULT NULL"],
        ];

        for (const [colName, colDef] of orderColumns) {
            const [existing] = await connection.execute(
                `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'orders' AND COLUMN_NAME = ?`,
                [DB_NAME, colName]
            );
            if (existing.length === 0) {
                await connection.query(`ALTER TABLE orders ADD COLUMN \`${colName}\` ${colDef}`);
                console.log(`Added order column: ${colName}`);
            }
        }

        // ==================================================
        // PAYMENTS / TRANSACTIONS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                transaction_reference VARCHAR(100) NOT NULL UNIQUE,
                gateway VARCHAR(50) NOT NULL,
                amount DECIMAL(12,2) NOT NULL,
                currency VARCHAR(10) NOT NULL DEFAULT 'USD',
                status ENUM('pending', 'successful', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
                gateway_reference VARCHAR(255) DEFAULT NULL,
                payment_details JSON DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_payments_order
                    FOREIGN KEY (order_id) REFERENCES orders(id)
                    ON DELETE CASCADE,
                INDEX idx_payments_order (order_id),
                INDEX idx_payments_reference (transaction_reference),
                INDEX idx_payments_status (status),
                INDEX idx_payments_gateway (gateway)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Payments table ready.");

        // ==================================================
        // PAYMENT GATEWAYS CONFIGURATION
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS payment_gateways_config (
                id INT AUTO_INCREMENT PRIMARY KEY,
                gateway_key VARCHAR(50) NOT NULL UNIQUE,
                name VARCHAR(100) NOT NULL,
                description TEXT DEFAULT NULL,
                badge VARCHAR(50) DEFAULT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                is_test_mode BOOLEAN NOT NULL DEFAULT TRUE,
                supported_currencies JSON DEFAULT NULL,
                instructions TEXT DEFAULT NULL,
                config_data JSON DEFAULT NULL,
                display_order INT NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Payment gateways config table ready.");

        // Seed default payment gateways if empty
        const [existingGateways] = await connection.query("SELECT COUNT(*) AS cnt FROM payment_gateways_config");
        if (existingGateways[0].cnt === 0) {
            const defaultGateways = [
                {
                    key: 'telebirr',
                    name: 'Telebirr',
                    description: 'Fast and secure mobile payment with your Telebirr wallet account or USSD.',
                    badge: 'Mobile Money',
                    isActive: true,
                    isTestMode: true,
                    supportedCurrencies: JSON.stringify(['ETB', 'USD']),
                    instructions: 'Enter your registered Telebirr phone number. You will receive an official authorization prompt on your Telebirr app or USSD (*127#) to complete payment.',
                    config: JSON.stringify({
                        appId: 'TELEBIRR_SANDBOX_APP_ID',
                        shortCode: '10014',
                        testPhone: '0911000000',
                        timeoutMinutes: 15
                    }),
                    order: 1
                },
                {
                    key: 'chapa',
                    name: 'Chapa',
                    description: 'Pay securely using Telebirr, CBE Birr, Awash, or local & international cards via Chapa.',
                    badge: 'Multi-Channel',
                    isActive: true,
                    isTestMode: true,
                    supportedCurrencies: JSON.stringify(['ETB', 'USD']),
                    instructions: 'You will be redirected to the secure Chapa payment page to complete your payment.',
                    config: JSON.stringify({
                        publicKey: 'CHAPUBK_TEST-xxxxxxxxxxxxxxxxxxxx',
                        supportedMethods: ['telebirr', 'cbebirr', 'bank_transfer', 'card']
                    }),
                    order: 2
                },
                {
                    key: 'cbe_birr',
                    name: 'CBE Birr',
                    description: 'Commercial Bank of Ethiopia mobile banking and CBE Birr wallet.',
                    badge: 'Mobile Banking',
                    isActive: true,
                    isTestMode: true,
                    supportedCurrencies: JSON.stringify(['ETB']),
                    instructions: 'Transfer to CBE Birr Merchant ID: 884920 or dial *847# with your order reference number.',
                    config: JSON.stringify({
                        merchantCode: '884920',
                        accountNumber: '1000123456789'
                    }),
                    order: 3
                },
                {
                    key: 'bank_transfer',
                    name: 'Bank Transfer (Ethiopian Banks)',
                    description: 'Direct transfer or mobile app payment via CBE, Awash, Dashen, or Abyssinia.',
                    badge: 'Manual Verification',
                    isActive: true,
                    isTestMode: true,
                    supportedCurrencies: JSON.stringify(['ETB', 'USD']),
                    instructions: 'Transfer the exact order total to any of our official verified accounts below. Once transferred, submit your transaction reference number or slip for immediate approval.',
                    config: JSON.stringify({
                        banks: [
                            { bankName: 'Commercial Bank of Ethiopia (CBE)', accountName: 'Apple Store Ethiopia Ltd', accountNumber: '1000293847561', branch: 'Addis Ababa Finfine Branch' },
                            { bankName: 'Awash Bank', accountName: 'Apple Store Ethiopia Ltd', accountNumber: '01320495867100', branch: 'Bole Medhanialem Branch' },
                            { bankName: 'Dashen Bank', accountName: 'Apple Store Ethiopia Ltd', accountNumber: '503928174625', branch: 'Meskel Square Branch' },
                            { bankName: 'Bank of Abyssinia', accountName: 'Apple Store Ethiopia Ltd', accountNumber: '84920173', branch: 'Kazanchis Branch' }
                        ]
                    }),
                    order: 4
                },
                {
                    key: 'card',
                    name: 'Credit or Debit Card',
                    description: 'Visa, Mastercard, or UnionPay processed securely with 256-bit SSL encryption.',
                    badge: 'Instant',
                    isActive: true,
                    isTestMode: true,
                    supportedCurrencies: JSON.stringify(['USD', 'EUR', 'GBP', 'ETB']),
                    instructions: 'Enter your card details. Sensitive information is encrypted and tokenized through our certified payment processor. We never store CVV or full card numbers.',
                    config: JSON.stringify({
                        supportedBrands: ['visa', 'mastercard'],
                        sandboxMode: true
                    }),
                    order: 5
                },
                {
                    key: 'cod',
                    name: 'Cash on Delivery (COD)',
                    description: 'Pay cash or mobile transfer when your package arrives at your doorstep.',
                    badge: 'Doorstep Payment',
                    isActive: true,
                    isTestMode: false,
                    supportedCurrencies: JSON.stringify(['ETB', 'USD']),
                    instructions: 'Please have the exact amount ready upon courier arrival. Our authorized courier will issue an official Apple Store printed delivery receipt.',
                    config: JSON.stringify({
                        availableRegions: ['Addis Ababa', 'Hawassa', 'Adama', 'Dire Dawa', 'Bahir Dar'],
                        maxLimit: 100000
                    }),
                    order: 6
                }
            ];

            for (const gw of defaultGateways) {
                await connection.query(`
                    INSERT INTO payment_gateways_config (
                        gateway_key, name, description, badge, is_active, is_test_mode,
                        supported_currencies, instructions, config_data, display_order
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    gw.key, gw.name, gw.description, gw.badge, gw.isActive ? 1 : 0, gw.isTestMode ? 1 : 0,
                    gw.supportedCurrencies, gw.instructions, gw.config, gw.order
                ]);
            }
            console.log("Seeded payment gateway configurations.");
        }

        // ==================================================
        // ORDER ITEMS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
                quantity INT NOT NULL DEFAULT 1,
                image_url TEXT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_order_items_order
                    FOREIGN KEY (order_id) REFERENCES orders(id)
                    ON DELETE CASCADE,
                INDEX idx_order_items_order (order_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Order items table ready.");

        // Seed initial orders if empty
        const [existingOrders] = await connection.query("SELECT COUNT(*) AS cnt FROM orders");
        if (existingOrders[0].cnt === 0) {
            await connection.query(`
                INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, total_amount, shipping_cost, payment_status, order_status, shipping_address)
                VALUES 
                ('ORD-9821', 'Alex Johnson', 'alex.j@example.com', '+1 (555) 234-5678', 999.00, 0.00, 'Paid', 'Processing', '123 Apple Blossom St, Cupertino, CA 95014'),
                ('ORD-9822', 'Sarah Connor', 'sarah.c@example.com', '+1 (555) 876-5432', 2499.00, 0.00, 'Paid', 'Shipped', '456 Cyberdyne Blvd, Los Angeles, CA 90001'),
                ('ORD-9823', 'Michael Scott', 'm.scott@dundermifflin.com', '+1 (555) 432-1098', 249.00, 0.00, 'Pending', 'Processing', '1725 Slough Ave, Scranton, PA 18503')
            `);

            const [allOrders] = await connection.query("SELECT id, order_number FROM orders");
            for (const ord of allOrders) {
                if (ord.order_number === 'ORD-9821') {
                    await connection.query(`
                        INSERT INTO order_items (order_id, title, price, quantity)
                        VALUES (?, 'iPhone 17 Pro', 999.00, 1)
                    `, [ord.id]);
                } else if (ord.order_number === 'ORD-9822') {
                    await connection.query(`
                        INSERT INTO order_items (order_id, title, price, quantity)
                        VALUES (?, 'MacBook Pro 16"', 2499.00, 1)
                    `, [ord.id]);
                } else if (ord.order_number === 'ORD-9823') {
                    await connection.query(`
                        INSERT INTO order_items (order_id, title, price, quantity)
                        VALUES (?, 'AirPods Pro 2', 249.00, 1)
                    `, [ord.id]);
                }
            }
            console.log("Seeded sample orders.");
        }

        // ==================================================
        // WATCH SHOPPING BENEFITS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS watch_shopping_benefits (
                id INT AUTO_INCREMENT PRIMARY KEY,
                eyebrow VARCHAR(255) DEFAULT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                link_url TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("Watch shopping benefits table ready.");

        // Seed initial watch shopping benefits if empty
        const [existingWatchBenefits] = await connection.query(
            "SELECT COUNT(*) AS cnt FROM watch_shopping_benefits"
        );
        if (existingWatchBenefits[0].cnt === 0) {
            await connection.query(`
                INSERT INTO watch_shopping_benefits (eyebrow, title, description, image_url, link_url, sort_order, is_active)
                VALUES 
                ('Apple Trade In', 'Get credit toward a new Apple Watch.', 'Trade in your eligible device for credit toward your next purchase, or recycle it for free.', 'https://www.apple.com/v/watch/bu/images/overview/incentive/trade_in__dl56vdsm0qiu_large.jpg', '/watch', 1, 1),
                ('Monthly Payments', 'Pay 0% APR with Apple Card.', 'Choose easy monthly installments with 0% APR when you pay with Apple Card.', 'https://www.apple.com/v/watch/bu/images/overview/incentive/apple_card__c246f6345p2q_large.jpg', '/watch', 2, 1),
                ('Free Delivery', 'Get free two-hour delivery from an Apple Store.', 'Or free standard delivery on all eligible online orders.', 'https://www.apple.com/v/watch/bu/images/overview/incentive/delivery__e8028mvdioie_large.jpg', '/watch', 3, 1),
                ('Specialist Support', 'Shop with a Specialist online or in a store.', 'Connect with a Specialist who can help you choose the right watch and band.', 'https://www.apple.com/v/watch/bu/images/overview/incentive/specialist__ez4r60u4k6eu_large.jpg', '/watch', 4, 1)
            `);
            console.log("Seeded watch shopping benefits.");
        }

        // ==================================================
        // APP SETTINGS
        // ==================================================

        await connection.query(`
            CREATE TABLE IF NOT EXISTS app_settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value JSON NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("App settings table ready.");

        // Default seed settings if not present
        const defaultSettings = [
            ['store', JSON.stringify({ storeName: "Apple Store Online", currency: "USD", currencySymbol: "$", taxRate: 8.5, freeShippingThreshold: 50, contactEmail: "support@apple.com" })],
            ['website', JSON.stringify({ siteTitle: "Apple (Clone)", siteTagline: "Think Different", maintenanceMode: false, bannerAlert: "" })],
            ['notifications', JSON.stringify({ orderConfirmation: true, shippingUpdates: true, promotionalEmails: false })]
        ];

        for (const [key, value] of defaultSettings) {
            await connection.query(`
                INSERT INTO app_settings (setting_key, setting_value)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE setting_value = setting_value
            `, [key, value]);
        }

        // ==================================================
        // STORE DYNAMIC SECTIONS SEEDING
        // ==================================================
        try {
            const seedStoreData = require("./seedStoreData");
            await seedStoreData();
        } catch (seedErr) {
            console.error("Store sections seeding note:", seedErr.message);
        }

        // ==================================================
        // MAC DYNAMIC SECTIONS SEEDING
        // ==================================================
        try {
            const seedMacData = require("./seedMacData");
            await seedMacData();
        } catch (macErr) {
            console.error("Mac sections seeding note:", macErr.message);
        }

        // ==================================================
        // IPAD DYNAMIC SECTIONS SEEDING
        // ==================================================
        try {
            const seedIpadData = require("./seedIpadData");
            await seedIpadData();
        } catch (ipadErr) {
            console.error("iPad sections seeding note:", ipadErr.message);
        }

        // ==================================================
        // IPHONE DYNAMIC SECTIONS SEEDING
        // ==================================================
        try {
            const seedIphoneData = require("./seedIphoneData");
            await seedIphoneData();
        } catch (iphoneErr) {
            console.error("iPhone sections seeding note:", iphoneErr.message);
        }

        // ==================================================
        // WATCH DYNAMIC SECTIONS SEEDING
        // ==================================================
        try {
            const seedWatchData = require("./seedWatchData");
            await seedWatchData();
        } catch (watchErr) {
            console.error("Watch sections seeding note:", watchErr.message);
        }

        // ==================================================
        // VISION DYNAMIC SECTIONS SEEDING
        // ==================================================
        try {
            const seedVisionData = require("./seedVisionData");
            await seedVisionData();
        } catch (visionErr) {
            console.error("Vision sections seeding note:", visionErr.message);
        }

        // ==================================================
        // AIRPODS DYNAMIC SECTIONS SEEDING
        // ==================================================
        try {
            const seedAirPodsData = require("./seedAirPodsData");
            await seedAirPodsData();
        } catch (airPodsErr) {
            console.error("AirPods sections seeding note:", airPodsErr.message);
        }

        // ==================================================
        // FINAL DATABASE TEST
        // ==================================================

        await connection.query("SELECT 1");

        console.log("");
        console.log("=================================");
        console.log("DATABASE SETUP COMPLETED");
        console.log("=================================");
        console.log("");

    } catch (error) {
        console.error("");
        console.error("=================================");
        console.error("DATABASE SETUP ERROR");
        console.error("=================================");
        console.error(error);
        console.error("");

        throw error;

    } finally {
        if (connection) {
            try {
                await connection.end();
                console.log("Database setup connection closed.");
            } catch (closeError) {
                console.error(
                    "Error closing database setup connection:",
                    closeError.message
                );
            }
        }
    }
}

// ==================================================
// COMMONJS EXPORT
// ==================================================

module.exports = setupDatabase;
