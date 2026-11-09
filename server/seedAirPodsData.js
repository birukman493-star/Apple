const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env"), override: true });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "apple_store";
const DB_PORT = Number(process.env.DB_PORT) || 3306;

async function seedAirPodsData() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            port: DB_PORT,
            charset: "utf8mb4",
        });

        console.log("Seeding AirPods data...");

        // ==================================================
        // AIRPODS NAV ITEMS TABLE
        // ==================================================
        await connection.query(`
            CREATE TABLE IF NOT EXISTS airpods_nav_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                href VARCHAR(500) DEFAULT '#',
                icon VARCHAR(100) DEFAULT 'airpods',
                is_new TINYINT(1) DEFAULT 0,
                display_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        const [existingNav] = await connection.query("SELECT COUNT(*) AS cnt FROM airpods_nav_items");
        if (existingNav[0].cnt === 0) {
            await connection.query(`
                INSERT INTO airpods_nav_items (name, href, icon, is_new, display_order, is_active) VALUES
                ('AirPods', '#', 'airpods', 0, 1, 1),
                ('AirPods Pro 3', '#', 'airpods-pro', 1, 2, 1),
                ('AirPods Max', '#', 'airpods-max', 0, 3, 1),
                ('Compare', '#', 'compare', 0, 4, 1)
            `);
            console.log("Seeded AirPods nav items.");
        }

        // ==================================================
        // AIRPODS COMPARE CARDS TABLE
        // ==================================================
        await connection.query(`
            CREATE TABLE IF NOT EXISTS airpods_compare_cards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                badge_text VARCHAR(100) DEFAULT 'New',
                product_name VARCHAR(255) NOT NULL,
                subtitle VARCHAR(255) DEFAULT NULL,
                description TEXT DEFAULT NULL,
                price DECIMAL(10,2) DEFAULT NULL,
                image_url TEXT DEFAULT NULL,
                buy_link VARCHAR(500) DEFAULT '#',
                learn_more_link VARCHAR(500) DEFAULT '#',
                sort_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        const [existingCompare] = await connection.query("SELECT COUNT(*) AS cnt FROM airpods_compare_cards");
        if (existingCompare[0].cnt === 0) {
            await connection.query(`
                INSERT INTO airpods_compare_cards (badge_text, product_name, subtitle, description, price, image_url, buy_link, learn_more_link, sort_order) VALUES
                ('New', 'AirPods 4', 'The next evolution of sound.', 'Personalized Spatial Audio with dynamic head tracking, Voice Isolation, and an all-new fit.', 129.00, '/airpods_4.jpg', '#', '#', 1),
                ('New', 'AirPods 4 with Active Noise Cancellation', 'Active Noise Cancellation. Made simple.', 'Active Noise Cancellation, Transparency mode, Adaptive Audio, and Conversation Awareness.', 179.00, '/airpods_4_anc.jpg', '#', '#', 2),
                ('New', 'AirPods Pro 3', 'The ultimate AirPods experience.', 'The ultimate wireless headphones experience with powerful noise cancellation and immersive sound.', 249.00, '/airpods_pro.jpg', '#', '#', 3),
                ('New', 'AirPods Max', 'A radically original composition.', 'High-fidelity audio, Active Noise Cancellation, and personalized Spatial Audio in an over-ear design.', 549.00, '/airpods_max.jpg', '#', '#', 4)
            `);
            console.log("Seeded AirPods compare cards.");
        }

        // ==================================================
        // AIRPODS FEATURE COMPARISON TABLE
        // ==================================================
        await connection.query(`
            CREATE TABLE IF NOT EXISTS airpods_feature_comparison (
                id INT AUTO_INCREMENT PRIMARY KEY,
                card_position INT NOT NULL DEFAULT 1,
                anc_text TEXT DEFAULT NULL,
                has_heart_rate TINYINT(1) DEFAULT 0,
                has_ear_icon TINYINT(1) DEFAULT 0,
                sort_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        const [existingFeature] = await connection.query("SELECT COUNT(*) AS cnt FROM airpods_feature_comparison");
        if (existingFeature[0].cnt === 0) {
            await connection.query(`
                INSERT INTO airpods_feature_comparison (card_position, anc_text, has_heart_rate, has_ear_icon, sort_order) VALUES
                (1, 'Up to 1.5x more Active Noise Cancellation than AirPods 4 with Active Noise Cancellation', 0, 0, 1),
                (2, 'Up to 1.5x more Active Noise Cancellation than AirPods 4 with Active Noise Cancellation', 0, 0, 2),
                (3, 'Up to 3x more Active Noise Cancellation than AirPods 5', 1, 1, 3),
                (4, 'Up to 1.5x more Active Noise Cancellation than original AirPods Max', 0, 1, 4)
            `);
            console.log("Seeded AirPods feature comparison.");
        }

        // ==================================================
        // AIRPODS BOTTOM COMPARISON TABLE
        // ==================================================
        await connection.query(`
            CREATE TABLE IF NOT EXISTS airpods_bottom_comparison (
                id INT AUTO_INCREMENT PRIMARY KEY,
                card_position INT NOT NULL DEFAULT 1,
                translation_text VARCHAR(255) DEFAULT NULL,
                control_icon VARCHAR(50) DEFAULT 'touch',
                control_text TEXT DEFAULT NULL,
                battery_hours VARCHAR(20) DEFAULT NULL,
                battery_text TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        const [existingBottom] = await connection.query("SELECT COUNT(*) AS cnt FROM airpods_bottom_comparison");
        if (existingBottom[0].cnt === 0) {
            await connection.query(`
                INSERT INTO airpods_bottom_comparison (card_position, translation_text, control_icon, control_text, battery_hours, battery_text, sort_order) VALUES
                (1, 'Live Translation and Siri AI', 'touch', 'Force sensor to manage playback and calls', '4 hrs', 'Up to 4 hours of battery life on one charge with Active Noise Cancellation and up to 20 hours with the case and ANC enabled', 1),
                (2, 'Live Translation and Siri AI', 'touch', 'Force sensor with volume swipe to manage playback and calls', '5 hrs', 'Up to 5 hours of battery life on one charge with Active Noise Cancellation and up to 22 hours with the case and ANC enabled', 2),
                (3, 'Live Translation and Siri AI', 'touch', 'Force sensor with volume swipe to manage playback and calls', '8 hrs', 'Up to 8 hours of battery life on one charge with Active Noise Cancellation, and up to 24 hours with the case and ANC enabled', 3),
                (4, 'Live Translation and Siri AI', 'crown', 'Digital Crown', '20 hrs', 'Up to 20 hours of battery life on one charge with Active Noise Cancellation', 4)
            `);
            console.log("Seeded AirPods bottom comparison.");
        }

        // ==================================================
        // AIRPODS KNOW CARDS TABLE (Get to Know AirPods)
        // ==================================================
        await connection.query(`
            CREATE TABLE IF NOT EXISTS airpods_know_cards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_label VARCHAR(255) NOT NULL,
                title VARCHAR(500) NOT NULL,
                description TEXT DEFAULT NULL,
                card_type VARCHAR(50) DEFAULT 'anc',
                sort_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        const [existingKnow] = await connection.query("SELECT COUNT(*) AS cnt FROM airpods_know_cards");
        if (existingKnow[0].cnt === 0) {
            await connection.query(`
                INSERT INTO airpods_know_cards (category_label, title, description, card_type, sort_order) VALUES
                ('Active Noise Cancellation', 'Control what you hear. And what you don''t.', NULL, 'anc', 1),
                ('Live Translation', 'Easily communicate across languages.', 'Available in select languages and regions. For more information, see Feature Availability.', 'translation', 2),
                ('Heart Rate Sensing', 'Track your heart rate and calories burned during workouts.', NULL, 'heart', 3),
                ('Personalized Spatial Audio', 'Sound tuned specifically to your ear shape.', NULL, 'spatial', 4)
            `);
            console.log("Seeded AirPods know cards.");
        }

        // ==================================================
        // AIRPODS SERVICES TABLE
        // ==================================================
        await connection.query(`
            CREATE TABLE IF NOT EXISTS airpods_services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT DEFAULT NULL,
                link_text VARCHAR(100) DEFAULT NULL,
                link_url VARCHAR(500) DEFAULT '#',
                icon_type VARCHAR(50) DEFAULT 'delivery',
                sort_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        const [existingServices] = await connection.query("SELECT COUNT(*) AS cnt FROM airpods_services");
        if (existingServices[0].cnt === 0) {
            await connection.query(`
                INSERT INTO airpods_services (title, description, link_text, link_url, icon_type, sort_order) VALUES
                ('Fast delivery or pickup', 'Or pick up available items at an Apple Store.', 'Learn more', '#', 'delivery', 1),
                ('Pay monthly at 0% APR', 'You can pay over time when you choose to check out at Apple with Apple Card Monthly Installments.', NULL, NULL, 'payment', 2),
                ('Get help buying', 'Have a question? Call a Specialist or chat online.', 'Contact us', '#', 'chat', 3),
                ('Make them yours', 'Engrave your AirPods with your initials or favorite emoji free. Only at Apple.', 'Learn more', '#', 'engrave', 4)
            `);
            console.log("Seeded AirPods services.");
        }

        // ==================================================
        // AIRPODS PROMO TABLE
        // ==================================================
        await connection.query(`
            CREATE TABLE IF NOT EXISTS airpods_promos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                link_text VARCHAR(100) DEFAULT 'Learn more',
                link_url VARCHAR(500) DEFAULT '#',
                image_url TEXT DEFAULT NULL,
                sort_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        const [existingPromos] = await connection.query("SELECT COUNT(*) AS cnt FROM airpods_promos");
        if (existingPromos[0].cnt === 0) {
            await connection.query(`
                INSERT INTO airpods_promos (title, link_text, link_url, image_url, sort_order) VALUES
                ('Get 3 months of Apple Music free with your AirPods.*', 'Learn more', '#', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', 1)
            `);
            console.log("Seeded AirPods promos.");
        }

        console.log("AirPods data seeding complete.");
    } catch (error) {
        console.error("AirPods seeding error:", error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

module.exports = seedAirPodsData;

if (require.main === module) {
    seedAirPodsData()
        .then(() => {
            console.log("Done.");
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
