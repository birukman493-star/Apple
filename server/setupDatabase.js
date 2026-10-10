const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");

// ==================================================
// LOAD ENVIRONMENT VARIABLES
// ==================================================

dotenv.config({
    path: path.join(__dirname, ".env"),
    override: true
});

// ==================================================
// DATABASE CONFIGURATION
// ==================================================

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "apple_store";
const DB_PORT = Number(process.env.DB_PORT) || 3306;

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

        // ==================================================
        // CONNECT TO MYSQL SERVER
        // ==================================================

        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT,
            multipleStatements: true
        });

        console.log("Connected to MySQL server.");

        // ==================================================
        // CREATE DATABASE
        // ==================================================

        await connection.query(
            `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``
        );

        console.log(`Database "${DB_NAME}" is ready.`);

        // ==================================================
        // USE DATABASE
        // ==================================================

        await connection.query(
            `USE \`${DB_NAME}\``
        );

        console.log(`Using database "${DB_NAME}".`);

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
                image_url TEXT NOT NULL,
                category VARCHAR(100) NOT NULL,
                learn_more_link TEXT DEFAULT NULL,
                buy_link TEXT DEFAULT NULL,
                buy_text VARCHAR(255) DEFAULT 'Buy',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_products_category (category),
                INDEX idx_products_active (is_active)
            )
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
            )
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
            )
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
            )
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
            )
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
            )
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
            )
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
            )
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
            )
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
                card_size ENUM('normal', 'large')
                    DEFAULT 'normal',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            )
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
                card_size ENUM('normal', 'large')
                    DEFAULT 'normal',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            )
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
            )
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
            )
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
            )
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
            )
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
            )
        `);

        console.log("Watch lineup table ready.");

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
            )
        `);

        console.log("Vision closer look table ready.");

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

                console.log(
                    "Database setup connection closed."
                );

            } catch (closeError) {
                console.error(
                    "Error closing database connection:",
                    closeError
                );
            }
        }
    }
}

// ==================================================
// COMMONJS EXPORT
// ==================================================

module.exports = setupDatabase;