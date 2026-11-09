const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const authRoutes = require("./Routes/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminAuthRoutes = require("./Routes/adminAuth");
const cookieParser = require("cookie-parser");
const paymentRoutes = require("./Routes/payments");
const adminAnalyticsRoutes = require("./Routes/adminAnalytics");


// ==================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ==================================================

dotenv.config({
    path: path.join(__dirname, ".env"),
    override: true
});

const db = require("./db");
const setupDatabase = require("./setupDatabase");

const app = express();

// CONFIGURATION
const PORT = process.env.PORT || 5000;
let databaseReady = false;
let databaseError = null;

// MIDDLEWARE
// CORS must be configured before registering API routes.
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5175",
            "http://127.0.0.1:5175",
        ],
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],
        credentials: true
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Static uploads directory for product media
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (e) {
        console.error("Failed to create uploads directory:", e);
    }
}
app.use("/uploads", express.static(uploadDir));
// AUTHENTICATION ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/checkout", paymentRoutes);
app.use("/api/admin", adminAnalyticsRoutes);

// ==================================================
// REQUEST LOGGING
// ==================================================

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// ==================================================
// ADMIN AUTHENTICATION
// ==================================================

// Temporary development middleware.
//
// IMPORTANT:
// This currently blocks admin-only requests because real
// authentication has not been configured yet.
//
// Public GET routes continue to work normally.
app.use("/api/auth", authRoutes);
app.use("/api/admin-auth", adminAuthRoutes);





const requireAdmin = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required. Please sign in as admin.",
    });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: "Admin token is missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    const configuredAdminEmail = process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

    const tokenEmail =
      typeof decoded.email === "string"
        ? decoded.email.trim().toLowerCase()
        : "";

    const isAdminRole = String(decoded.role || "").toLowerCase() === "admin";
    const isConfiguredEmail = configuredAdminEmail && tokenEmail === configuredAdminEmail;

    if (!isAdminRole && !isConfiguredEmail) {
      return res.status(403).json({
        message: "Admin access denied. Administrator privileges required.",
      });
    }

    req.user = {
      email: tokenEmail,
      role: "admin",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Admin session expired. Please sign in again."
          : "Invalid admin token. Please sign in again.",
    });
  }
};



// ==================================================
// DATABASE STATUS MIDDLEWARE
// ==================================================

// Database-dependent API routes can use this middleware.
// The server itself remains online even if setupDatabase()
// has an error.

const requireDatabase = (req, res, next) => {
    if (!databaseReady) {
        return res.status(503).json({
            message: "Database is not ready yet.",
            error: databaseError
                ? databaseError.message
                : "Database initialization is still in progress."
        });
    }

    next();
};

// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {
    res.json({
        message: "Apple Store API is running",
        server: "online",
        database: databaseReady ? "ready" : "not ready"
    });
});

// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/api/health", (req, res) => {
    res.json({
        server: "online",
        database: databaseReady ? "ready" : "not ready",
        port: PORT,
        databaseError: databaseError
            ? databaseError.message
            : null
    });
});

// ==================================================
// ADD PRODUCT
// ==================================================


/* ==================================================
   PRODUCT MANAGEMENT
   Apple Store - Express + MySQL
================================================== */

// Validate positive integer IDs.
const isValidId = (id) =>
    /^\d+$/.test(String(id)) && Number(id) > 0;

// Normalize product fields.
const normalizeNullable = (value) =>
    value === "" || value === undefined ? null : value;

// Validate product input.
// Helper to safely parse JSON or array
const parseArrayJson = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
        try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            return val.split(",").map(s => s.trim()).filter(Boolean);
        }
    }
    return [];
};

const DEFAULT_CATEGORY_IMAGES = {
    "iPhone": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
    "Mac": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    "iPad": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    "Watch": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    "AirPods": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80",
    "TV & Home": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80",
    "Vision": "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80",
    "Accessories": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
};

const getDefaultProductImage = (cat) => {
    return DEFAULT_CATEGORY_IMAGES[cat] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80";
};

// Validate product input.
function validateProduct(body, partial = false) {
    const title = (body.title || body.name || "").trim();
    const category = (body.category || "").trim();
    const price = body.price_upfront !== undefined ? body.price_upfront : body.price;

    if (!partial || (body.title !== undefined || body.name !== undefined)) {
        if (!title) {
            return "Product title is required.";
        }
    }

    if (!partial || body.category !== undefined) {
        if (!category) {
            return "Product category is required.";
        }
    }

    if (!partial) {
        if (price === undefined || price === null || price === "") {
            return "Product price is required.";
        }
    }

    for (const [field, value] of Object.entries({
        price_upfront: price,
        price_monthly: body.price_monthly,
        lease_monthly: body.lease_monthly,
        stock: body.stock,
        discount_price: body.discount_price !== undefined ? body.discount_price : body.discountPrice,
    })) {
        if (value === undefined || value === null || value === "") {
            continue;
        }

        const number = Number(value);

        if (!Number.isFinite(number) || number < 0) {
            return `${field} must be a non-negative number.`;
        }
    }

    return null;
}

// Format a product row with both snake_case and camelCase for maximum compatibility
const formatProductRow = (row) => {
    try {
        const colors = parseArrayJson(row.colors);
        const storage = parseArrayJson(row.storage_options);
        const imageGallery = parseArrayJson(row.image_gallery);
        const price = Number(row.price_upfront ?? 0);
        const discountPrice = row.discount_price != null ? Number(row.discount_price) : null;
        const stock = Number(row.stock ?? 0);
        const navVisibility = Boolean(row.nav_visibility ?? true);
        const isActive = Boolean(row.is_active ?? true);
        const status = row.status ?? (isActive ? "Active" : "Archived");

        return {
            ...row,
            id: row.id,
            title: row.title || "",
            name: row.title || "",
            category: row.category || "iPhone",
            description: row.description || "",
            badge_text: row.badge_text || null,
            badge: row.badge_text || null,
            price_upfront: price,
            price: price,
            discount_price: discountPrice,
            discountPrice: discountPrice,
            price_monthly: row.price_monthly != null ? Number(row.price_monthly) : null,
            lease_monthly: row.lease_monthly != null ? Number(row.lease_monthly) : null,
            image_url: row.image_url || "",
            imageMain: row.image_url || "",
            image_gallery: imageGallery,
            imageGallery: imageGallery,
            colors: colors,
            storage_options: storage,
            storage: storage,
            stock: stock,
            nav_visibility: navVisibility,
            navVisibility: navVisibility,
            status: status,
            is_active: isActive,
            learn_more_link: row.learn_more_link || null,
            buy_link: row.buy_link || null,
            buy_text: row.buy_text || "Buy"
        };
    } catch (err) {
        console.error("formatProductRow error:", err);
        return {
            ...row,
            name: row.title || "",
            price: Number(row.price_upfront ?? 0),
            imageMain: row.image_url || ""
        };
    }
};

// ------------------------------------------
// GET ALL PRODUCTS (Public & Admin)
// GET /api/products?category=...&search=...&status=...
// ------------------------------------------
app.get(
    "/api/products",
    requireDatabase,
    async (req, res) => {
        try {
            const { category, search, status } = req.query;

            // Check if request has admin token
            let hasAdminAuth = false;
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                try {
                    const token = authHeader.slice(7).trim();
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    if (decoded && (decoded.role === "admin" || (process.env.ADMIN_EMAIL && decoded.email === process.env.ADMIN_EMAIL))) {
                        hasAdminAuth = true;
                    }
                } catch {
                    hasAdminAuth = false;
                }
            }

            let sql = `SELECT * FROM products WHERE 1 = 1`;
            const values = [];

            if (category && category !== "All") {
                sql += " AND LOWER(category) = LOWER(?)";
                values.push(category);
            }

            if (search) {
                sql += " AND (title LIKE ? OR description LIKE ? OR CAST(id AS CHAR) = ?)";
                values.push(`%${search}%`, `%${search}%`, String(search));
            }

            if (status) {
                if (status.toLowerCase() === "active" || status.toLowerCase() === "published") {
                    sql += " AND is_active = TRUE AND (status = 'Active' OR status IS NULL)";
                } else if (status.toLowerCase() === "archived" || status.toLowerCase() === "inactive") {
                    sql += " AND (is_active = FALSE OR status = 'Archived')";
                } else if (status.toLowerCase() === "draft") {
                    sql += " AND status = 'Draft'";
                }
                // if status === "all", no filter applied
            } else if (!hasAdminAuth) {
                // Public viewers only see active products by default
                sql += " AND is_active = TRUE AND (status = 'Active' OR status IS NULL)";
            }

            sql += " ORDER BY id DESC";

            const [products] = await db.query(sql, values);
            res.json(products.map(formatProductRow));
        } catch (error) {
            console.error("Get products error:", error);
            res.status(500).json({
                message: "Failed to fetch products.",
                error: error.message
            });
        }
    }
);

// ------------------------------------------
// SEARCH PRODUCTS
// GET /api/products/search?q=iphone
// ------------------------------------------
app.get(
    "/api/products/search",
    requireDatabase,
    async (req, res) => {
        try {
            const query = (req.query.q || req.query.query || "").trim();
            if (!query) {
                return res.json([]);
            }

            const [products] = await db.query(`
                SELECT * FROM products
                WHERE is_active = TRUE
                  AND (title LIKE ? OR description LIKE ? OR category LIKE ?)
                ORDER BY id DESC
                LIMIT 20
            `, [`%${query}%`, `%${query}%`, `%${query}%`]);

            res.json(products.map(formatProductRow));
        } catch (error) {
            console.error("Product search error:", error);
            res.status(500).json({ message: "Product search failed." });
        }
    }
);

// ------------------------------------------
// LATEST PRODUCTS (For Store & Homepage)
// GET /api/products/latest?limit=8
// ------------------------------------------
app.get(
    "/api/products/latest",
    requireDatabase,
    async (req, res) => {
        try {
            const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 8));
            const [products] = await db.query(`
                SELECT * FROM products
                WHERE is_active = TRUE
                ORDER BY id DESC
                LIMIT ?
            `, [limit]);

            res.json(products.map(formatProductRow));
        } catch (error) {
            console.error("Latest products error:", error);
            res.status(500).json({ message: "Failed to fetch latest products." });
        }
    }
);

// ------------------------------------------
// ACCESSORIES PRODUCTS (For Store Page)
// GET /api/products/accessories
// ------------------------------------------
app.get(
    "/api/products/accessories",
    requireDatabase,
    async (req, res) => {
        try {
            const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
            const [products] = await db.query(`
                SELECT * FROM products
                WHERE is_active = TRUE
                  AND (LOWER(category) = 'accessories' OR LOWER(category) = 'accessory')
                ORDER BY id DESC
                LIMIT ?
            `, [limit]);

            res.json(products.map(formatProductRow));
        } catch (error) {
            console.error("Accessories products error:", error);
            res.status(500).json({ message: "Failed to fetch accessories." });
        }
    }
);

// ------------------------------------------
// ADMIN: UPLOAD PRODUCT IMAGE
// POST /api/upload
// ------------------------------------------
app.post(
    "/api/upload",
    requireAdmin,
    async (req, res) => {
        try {
            const { image, filename } = req.body;
            if (!image) {
                return res.status(400).json({ message: "No image data provided." });
            }

            // Handle base64 data URI
            const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
            if (matches) {
                const rawExt = matches[1].toLowerCase();
                const ext = rawExt === "jpeg" ? "jpg" : (rawExt === "svg+xml" ? "svg" : rawExt);
                const buffer = Buffer.from(matches[2], "base64");
                const safeName = `product-${Date.now()}-${Math.floor(Math.random() * 1000000)}.${ext}`;
                const uploadPath = path.join(uploadDir, safeName);
                fs.writeFileSync(uploadPath, buffer);

                const fileUrl = `/uploads/${safeName}`;
                return res.json({ url: fileUrl, message: "Image uploaded successfully." });
            }

            // If it's an external URL
            if (/^https?:\/\//i.test(image)) {
                return res.json({ url: image, message: "Image URL accepted." });
            }

            return res.status(400).json({ message: "Invalid image format. Provide a valid HTTP(S) URL or base64 image data." });
        } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({ message: "Failed to upload image: " + error.message });
        }
    }
);

// ------------------------------------------
// ADMIN: ADD PRODUCT
// POST /api/products
// ------------------------------------------
app.post(
    "/api/products",
    requireAdmin,
    requireDatabase,
    async (req, res) => {
        try {
            const validationError = validateProduct(req.body);
            if (validationError) {
                return res.status(400).json({ message: validationError });
            }

            const title = (req.body.title || req.body.name || "").trim();
            const category = (req.body.category || "iPhone").trim();
            let image_url = (req.body.image_url || req.body.imageMain || "").trim();
            if (!image_url) {
                image_url = getDefaultProductImage(category);
            }
            const price = Number(req.body.price_upfront !== undefined ? req.body.price_upfront : req.body.price) || 0;
            const discountPrice = req.body.discount_price !== undefined ? req.body.discount_price : req.body.discountPrice;
            const badge_text = req.body.badge_text || req.body.badge || null;
            const description = req.body.description || null;
            const price_monthly = req.body.price_monthly ? Number(req.body.price_monthly) : null;
            const lease_monthly = req.body.lease_monthly ? Number(req.body.lease_monthly) : null;
            const learn_more_link = req.body.learn_more_link || null;
            const buy_link = req.body.buy_link || null;
            const buy_text = req.body.buy_text || "Buy";
            const stock = Number(req.body.stock !== undefined && req.body.stock !== "" ? req.body.stock : 50);
            const colors = JSON.stringify(parseArrayJson(req.body.colors));
            const storage = JSON.stringify(parseArrayJson(req.body.storage_options || req.body.storage));
            const imageGallery = JSON.stringify(parseArrayJson(req.body.image_gallery || req.body.imageGallery));
            const nav_visibility = req.body.nav_visibility !== undefined ? (Boolean(req.body.nav_visibility) ? 1 : 0) : (req.body.navVisibility !== undefined ? (Boolean(req.body.navVisibility) ? 1 : 0) : 1);
            const status = req.body.status || "Active";
            const is_active = (status === "Active" || status === "Published") ? 1 : 0;
            const dbStatus = status === "Published" ? "Active" : status;

            const [result] = await db.query(
                `INSERT INTO products (
                    badge_text, title, description, price_upfront, price_monthly,
                    lease_monthly, image_url, category, learn_more_link, buy_link,
                    buy_text, stock, discount_price, image_gallery, colors,
                    storage_options, nav_visibility, status, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    badge_text, title, description, price, price_monthly,
                    lease_monthly, image_url, category, learn_more_link, buy_link,
                    buy_text, stock, (discountPrice !== "" && discountPrice != null) ? Number(discountPrice) : null,
                    imageGallery, colors, storage, nav_visibility,
                    dbStatus, is_active
                ]
            );

            const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [result.insertId]);

            res.status(201).json({
                message: "Product added successfully.",
                product: formatProductRow(rows[0]),
                data: formatProductRow(rows[0])
            });
        } catch (error) {
            console.error("Add product error:", error);
            res.status(500).json({ message: "Failed to add product: " + error.message });
        }
    }
);

// ------------------------------------------
// ADMIN: UPDATE PRODUCT
// PUT /api/products/:id
// ------------------------------------------
app.put(
    "/api/products/:id",
    requireAdmin,
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "Invalid product ID." });
            }

            const validationError = validateProduct(req.body, true);
            if (validationError) {
                return res.status(400).json({ message: validationError });
            }

            const [existingRows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
            if (!existingRows.length) {
                return res.status(404).json({ message: "Product not found." });
            }

            const existing = existingRows[0];
            const body = req.body;

            const title = body.title !== undefined ? body.title.trim() : (body.name !== undefined ? body.name.trim() : existing.title);
            const category = body.category !== undefined ? body.category.trim() : existing.category;
            const image_url = body.image_url !== undefined ? body.image_url.trim() : (body.imageMain !== undefined ? body.imageMain.trim() : existing.image_url);
            const price = body.price_upfront !== undefined ? Number(body.price_upfront) : (body.price !== undefined ? Number(body.price) : Number(existing.price_upfront));
            const discount_price = body.discount_price !== undefined ? (body.discount_price === null || body.discount_price === "" ? null : Number(body.discount_price)) : (body.discountPrice !== undefined ? (body.discountPrice === null || body.discountPrice === "" ? null : Number(body.discountPrice)) : existing.discount_price);
            const badge_text = body.badge_text !== undefined ? body.badge_text : (body.badge !== undefined ? body.badge : existing.badge_text);
            const description = body.description !== undefined ? body.description : existing.description;
            const price_monthly = body.price_monthly !== undefined ? (body.price_monthly ? Number(body.price_monthly) : null) : existing.price_monthly;
            const lease_monthly = body.lease_monthly !== undefined ? (body.lease_monthly ? Number(body.lease_monthly) : null) : existing.lease_monthly;
            const learn_more_link = body.learn_more_link !== undefined ? body.learn_more_link : existing.learn_more_link;
            const buy_link = body.buy_link !== undefined ? body.buy_link : existing.buy_link;
            const buy_text = body.buy_text !== undefined ? body.buy_text : existing.buy_text;
            const stock = body.stock !== undefined ? Number(body.stock) : Number(existing.stock ?? 0);
            const colors = body.colors !== undefined
                ? JSON.stringify(parseArrayJson(body.colors))
                : (typeof existing.colors === "string" ? existing.colors : JSON.stringify(existing.colors || []));

            const storage = (body.storage_options !== undefined || body.storage !== undefined)
                ? JSON.stringify(parseArrayJson(body.storage_options || body.storage))
                : (typeof existing.storage_options === "string" ? existing.storage_options : JSON.stringify(existing.storage_options || []));

            const image_gallery = (body.image_gallery !== undefined || body.imageGallery !== undefined)
                ? JSON.stringify(parseArrayJson(body.image_gallery || body.imageGallery))
                : (typeof existing.image_gallery === "string" ? existing.image_gallery : JSON.stringify(existing.image_gallery || []));

            const nav_visibility = body.nav_visibility !== undefined ? (body.nav_visibility ? 1 : 0) : (body.navVisibility !== undefined ? (body.navVisibility ? 1 : 0) : (existing.nav_visibility ? 1 : 0));
            const status = body.status !== undefined ? (body.status === "Published" ? "Active" : body.status) : existing.status;
            const is_active = body.is_active !== undefined ? (body.is_active ? 1 : 0) : (status === "Active" || status === "Published" ? 1 : 0);

            await db.query(`
                UPDATE products SET
                    badge_text = ?, title = ?, description = ?, price_upfront = ?,
                    price_monthly = ?, lease_monthly = ?, image_url = ?, category = ?,
                    learn_more_link = ?, buy_link = ?, buy_text = ?, stock = ?,
                    discount_price = ?, image_gallery = ?, colors = ?,
                    storage_options = ?, nav_visibility = ?, status = ?, is_active = ?
                WHERE id = ?
            `, [
                badge_text, title, description, price, price_monthly,
                lease_monthly, image_url, category, learn_more_link, buy_link,
                buy_text, stock, discount_price, image_gallery, colors,
                storage, nav_visibility, status, is_active, id
            ]);

            const [updated] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

            res.json({
                message: "Product updated successfully.",
                product: formatProductRow(updated[0]),
                data: formatProductRow(updated[0]),
            });
        } catch (error) {
            console.error("Update product error:", error);
            res.status(500).json({ message: "Failed to update product: " + error.message, error: error.message });
        }
    }
);

// ------------------------------------------
// ADMIN: ARCHIVE / DELETE PRODUCT
// DELETE /api/products/:id
// ------------------------------------------
app.delete(
    "/api/products/:id",
    requireAdmin,
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "Invalid product ID." });
            }

            const isPermanent = req.query.permanent === "true";
            let result;
            if (isPermanent) {
                [result] = await db.query(`DELETE FROM products WHERE id = ?`, [id]);
            } else {
                [result] = await db.query(
                    `UPDATE products SET is_active = FALSE, status = 'Archived' WHERE id = ?`,
                    [id]
                );
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Product not found." });
            }

            res.json({
                message: isPermanent ? "Product permanently deleted." : "Product archived successfully.",
                id: Number(id)
            });
        } catch (error) {
            console.error("Delete product error:", error);
            res.status(500).json({ message: "Failed to archive product." });
        }
    }
);

// ------------------------------------------
// ADMIN: RESTORE PRODUCT
// POST /api/products/:id/restore
// ------------------------------------------
app.post(
    "/api/products/:id/restore",
    requireAdmin,
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                return res.status(400).json({ message: "Invalid product ID." });
            }

            const [result] = await db.query(
                `UPDATE products SET is_active = TRUE, status = 'Active' WHERE id = ?`,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Product not found." });
            }

            res.json({ message: "Product restored successfully." });
        } catch (error) {
            console.error("Restore product error:", error);
            res.status(500).json({ message: "Failed to restore product." });
        }
    }
);




// ==================================================
// MAC SHOP BENEFITS
// ==================================================

app.get(
    "/api/mac-shop-benefits",
    requireDatabase,
    async (req, res) => {
        try {
            const [benefits] = await db.query(`
                SELECT
                    id,
                    title,
                    description,
                    image_url
                FROM mac_shop_benefits
                WHERE is_active = TRUE
                ORDER BY sort_order ASC, id ASC
            `);

            res.json(benefits);
        } catch (error) {
            console.error(
                "Error fetching Mac shop benefits:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch Mac shop benefits",
                error: error.message
            });
        }
    }
);

// ==================================================
// MAC GET TO KNOW
// ==================================================

app.get(
    "/api/mac-get-to-know",
    requireDatabase,
    async (req, res) => {
        try {
            const [items] = await db.query(`
                SELECT
                    id,
                    title,
                    description,
                    image_url
                FROM mac_get_to_know
                WHERE is_active = TRUE
                ORDER BY sort_order ASC, id ASC
            `);

            res.json(items);
        } catch (error) {
            console.error(
                "Error fetching Mac Get To Know:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch Mac Get To Know",
                error: error.message
            });
        }
    }
);

// ==================================================
// MAC HELP ME CHOOSE
// ==================================================

app.get(
    "/api/mac-help-me-choose",
    requireDatabase,
    async (req, res) => {
        try {
            const [items] = await db.query(`
                SELECT
                    id,
                    title,
                    description,
                    button_text,
                    button_url,
                    image_url
                FROM mac_help_me_choose
                WHERE is_active = TRUE
                ORDER BY id ASC
            `);

            res.json(items);
        } catch (error) {
            console.error(
                "Error fetching Mac Help Me Choose:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch Mac Help Me Choose",
                error: error.message
            });
        }
    }
);

// ==================================================
// GET LATEST PRODUCTS
// ==================================================

app.get(
    "/api/products/latest",
    requireDatabase,
    async (req, res) => {
        try {
            const [products] = await db.query(`
                SELECT
                    id,
                    badge_text,
                    title,
                    description,
                    price_upfront,
                    price_monthly,
                    lease_monthly,
                    image_url
                FROM products
                WHERE is_active = TRUE
                ORDER BY created_at DESC
            `);

            res.json(products);
        } catch (error) {
            console.error(
                "Get latest products error:",
                error
            );

            res.status(500).json({
                error: "Failed to fetch products",
                details: error.message
            });
        }
    }
);

// ==================================================
// ACCESSORIES
// ==================================================

app.get(
    "/api/products/accessories",
    requireDatabase,
    async (req, res) => {
        try {
            const [products] = await db.query(`
                SELECT
                    id,
                    badge_text,
                    title,
                    description,
                    price_upfront,
                    price_monthly,
                    lease_monthly,
                    image_url,
                    category
                FROM products
                WHERE is_active = TRUE
                AND category = 'Accessories'
                ORDER BY created_at DESC
            `);

            res.json(products);
        } catch (error) {
            console.error(
                "Error fetching accessories:",
                error
            );

            res.status(500).json({
                error: "Failed to fetch accessories",
                details: error.message
            });
        }
    }
);

// ==================================================
// STORE HELP
// ==================================================

app.get(
    "/api/store-help",
    requireDatabase,
    async (req, res) => {
        try {
            const [cards] = await db.query(`
                SELECT
                    id,
                    label,
                    title,
                    description,
                    image_url,
                    link,
                    is_active
                FROM store_help_sections
                WHERE is_active = TRUE
                ORDER BY created_at ASC
            `);

            res.json(cards);
        } catch (error) {
            console.error(
                "Get Store Help error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch Store Help cards",
                details: error.message
            });
        }
    }
);

app.post(
    "/api/store-help",
    requireDatabase,
    async (req, res) => {
        try {
            const {
                label,
                title,
                description,
                image_url,
                link
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    error: "Help card title is required"
                });
            }

            const [result] = await db.query(
                `
                INSERT INTO store_help_sections
                (
                    label,
                    title,
                    description,
                    image_url,
                    link
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    label || null,
                    title,
                    description || null,
                    image_url || null,
                    link || null
                ]
            );

            res.status(201).json({
                message:
                    "Help card added successfully",
                cardId: result.insertId
            });
        } catch (error) {
            console.error(
                "Add Store Help error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to add Help card",
                details: error.message
            });
        }
    }
);

app.put(
    "/api/store-help/:id",
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const {
                label,
                title,
                description,
                image_url,
                link,
                is_active
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    error:
                        "Help card title is required"
                });
            }

            const [result] = await db.query(
                `
                UPDATE store_help_sections
                SET
                    label = ?,
                    title = ?,
                    description = ?,
                    image_url = ?,
                    link = ?,
                    is_active = ?
                WHERE id = ?
                `,
                [
                    label || null,
                    title,
                    description || null,
                    image_url || null,
                    link || null,
                    is_active ?? true,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Help card not found"
                });
            }

            res.json({
                message:
                    "Help card updated successfully"
            });
        } catch (error) {
            console.error(
                "Update Store Help error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to update Help card",
                details: error.message
            });
        }
    }
);

app.delete(
    "/api/store-help/:id",
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await db.query(
                `
                UPDATE store_help_sections
                SET is_active = FALSE
                WHERE id = ?
                `,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Help card not found"
                });
            }

            res.json({
                message:
                    "Help card removed successfully"
            });
        } catch (error) {
            console.error(
                "Delete Store Help error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to remove Help card",
                details: error.message
            });
        }
    }
);

// ==================================================
// STORE DIFFERENCE
// ==================================================

app.get(
    "/api/store-difference",
    requireDatabase,
    async (req, res) => {
        try {
            const [cards] = await db.query(`
                SELECT
                    id,
                    label,
                    title,
                    description,
                    icon_url,
                    image_url,
                    card_size
                FROM store_difference_sections
                WHERE is_active = TRUE
                ORDER BY created_at ASC
            `);

            res.json(cards);
        } catch (error) {
            console.error(
                "Get store difference error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch store difference cards",
                details: error.message
            });
        }
    }
);

app.post(
    "/api/store-difference",
    requireDatabase,
    async (req, res) => {
        try {
            const {
                label,
                title,
                description,
                icon_url,
                image_url,
                card_size
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    error:
                        "Card title is required"
                });
            }

            const [result] = await db.query(
                `
                INSERT INTO store_difference_sections
                (
                    label,
                    title,
                    description,
                    icon_url,
                    image_url,
                    card_size
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    label || null,
                    title,
                    description || null,
                    icon_url || null,
                    image_url || null,
                    card_size === "large"
                        ? "large"
                        : "normal"
                ]
            );

            res.status(201).json({
                message:
                    "Store difference card added successfully",
                cardId: result.insertId
            });
        } catch (error) {
            console.error(
                "Add store difference error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to add store difference card",
                details: error.message
            });
        }
    }
);

app.put(
    "/api/store-difference/:id",
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const {
                label,
                title,
                description,
                icon_url,
                image_url,
                card_size,
                is_active
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    error:
                        "Card title is required"
                });
            }

            const [result] = await db.query(
                `
                UPDATE store_difference_sections
                SET
                    label = ?,
                    title = ?,
                    description = ?,
                    icon_url = ?,
                    image_url = ?,
                    card_size = ?,
                    is_active = ?
                WHERE id = ?
                `,
                [
                    label || null,
                    title,
                    description || null,
                    icon_url || null,
                    image_url || null,
                    card_size === "large"
                        ? "large"
                        : "normal",
                    is_active !== false,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Store difference card not found"
                });
            }

            res.json({
                message:
                    "Store difference card updated successfully"
            });
        } catch (error) {
            console.error(
                "Update store difference error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to update store difference card",
                details: error.message
            });
        }
    }
);

app.delete(
    "/api/store-difference/:id",
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await db.query(
                `
                UPDATE store_difference_sections
                SET is_active = FALSE
                WHERE id = ?
                `,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Store difference card not found"
                });
            }

            res.json({
                message:
                    "Store difference card removed successfully"
            });
        } catch (error) {
            console.error(
                "Delete store difference error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to remove store difference card",
                details: error.message
            });
        }
    }
);

// ==================================================
// LOUD AND CLEAR
// ==================================================

app.get(
    "/api/store-sound",
    requireDatabase,
    async (req, res) => {
        try {
            const [cards] = await db.query(`
                SELECT
                    id,
                    label,
                    title,
                    description,
                    image_url,
                    badge_text,
                    price,
                    card_size
                FROM store_sound_sections
                WHERE is_active = TRUE
                ORDER BY created_at ASC
            `);

            res.json(cards);
        } catch (error) {
            console.error(
                "Get store sound error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch sound cards",
                details: error.message
            });
        }
    }
);

app.post(
    "/api/store-sound",
    requireDatabase,
    async (req, res) => {
        try {
            const {
                label,
                title,
                description,
                image_url,
                badge_text,
                price,
                card_size
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    error:
                        "Card title is required"
                });
            }

            const [result] = await db.query(
                `
                INSERT INTO store_sound_sections
                (
                    label,
                    title,
                    description,
                    image_url,
                    badge_text,
                    price,
                    card_size
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    label || null,
                    title,
                    description || null,
                    image_url || null,
                    badge_text || null,
                    price || null,
                    card_size === "large"
                        ? "large"
                        : "normal"
                ]
            );

            res.status(201).json({
                message:
                    "Sound card added successfully",
                cardId: result.insertId
            });
        } catch (error) {
            console.error(
                "Add sound card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to add sound card",
                details: error.message
            });
        }
    }
);

app.put(
    "/api/store-sound/:id",
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const {
                label,
                title,
                description,
                image_url,
                badge_text,
                price,
                card_size,
                is_active
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    error:
                        "Card title is required"
                });
            }

            const [result] = await db.query(
                `
                UPDATE store_sound_sections
                SET
                    label = ?,
                    title = ?,
                    description = ?,
                    image_url = ?,
                    badge_text = ?,
                    price = ?,
                    card_size = ?,
                    is_active = ?
                WHERE id = ?
                `,
                [
                    label || null,
                    title,
                    description || null,
                    image_url || null,
                    badge_text || null,
                    price || null,
                    card_size === "large"
                        ? "large"
                        : "normal",
                    is_active !== false,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Sound card not found"
                });
            }

            res.json({
                message:
                    "Sound card updated successfully"
            });
        } catch (error) {
            console.error(
                "Update sound card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to update sound card",
                details: error.message
            });
        }
    }
);

app.delete(
    "/api/store-sound/:id",
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await db.query(
                `
                UPDATE store_sound_sections
                SET is_active = FALSE
                WHERE id = ?
                `,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Sound card not found"
                });
            }

            res.json({
                message:
                    "Sound card removed successfully"
            });
        } catch (error) {
            console.error(
                "Delete sound card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to remove sound card",
                details: error.message
            });
        }
    }
);

// ==================================================
// APPLE EXPERIENCE
// ==================================================

app.get(
    "/api/store-experience",
    requireDatabase,
    async (req, res) => {
        try {
            const [cards] = await db.query(`
                SELECT
                    id,
                    label,
                    title,
                    description,
                    image_url
                FROM store_experience_sections
                WHERE is_active = TRUE
                ORDER BY created_at ASC
            `);

            res.json(cards);
        } catch (error) {
            console.error(
                "Get experience cards error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch experience cards",
                details: error.message
            });
        }
    }
);

app.post(
    "/api/store-experience",
    requireDatabase,
    async (req, res) => {
        try {
            const {
                label,
                title,
                description,
                image_url
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    error:
                        "Card title is required"
                });
            }

            const [result] = await db.query(
                `
                INSERT INTO store_experience_sections
                (
                    label,
                    title,
                    description,
                    image_url
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    label || null,
                    title,
                    description || null,
                    image_url || null
                ]
            );

            res.status(201).json({
                message:
                    "Experience card added successfully",
                cardId: result.insertId
            });
        } catch (error) {
            console.error(
                "Add experience card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to add experience card",
                details: error.message
            });
        }
    }
);

app.put(
    "/api/store-experience/:id",
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const {
                label,
                title,
                description,
                image_url,
                is_active
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    error:
                        "Card title is required"
                });
            }

            const [result] = await db.query(
                `
                UPDATE store_experience_sections
                SET
                    label = ?,
                    title = ?,
                    description = ?,
                    image_url = ?,
                    is_active = ?
                WHERE id = ?
                `,
                [
                    label || null,
                    title,
                    description || null,
                    image_url || null,
                    is_active !== false,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Experience card not found"
                });
            }

            res.json({
                message:
                    "Experience card updated successfully"
            });
        } catch (error) {
            console.error(
                "Update experience card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to update experience card",
                details: error.message
            });
        }
    }
);

app.delete(
    "/api/store-experience/:id",
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await db.query(
                `
                UPDATE store_experience_sections
                SET is_active = FALSE
                WHERE id = ?
                `,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Experience card not found"
                });
            }

            res.json({
                message:
                    "Experience card removed successfully"
            });
        } catch (error) {
            console.error(
                "Delete experience card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to remove experience card",
                details: error.message
            });
        }
    }
);

// ==================================================
// SAVINGS AND OFFERS
// ==================================================

app.get(
    "/api/store-savings",
    requireDatabase,
    async (req, res) => {
        try {
            const [cards] = await db.query(`
                SELECT
                    id,
                    label,
                    title,
                    description,
                    image_url
                FROM store_savings_sections
                WHERE is_active = TRUE
                ORDER BY created_at ASC
            `);

            res.json(cards);
        } catch (error) {
            console.error(
                "Get savings cards error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch savings cards",
                details: error.message
            });
        }
    }
);

app.post(
    "/api/store-savings",
    requireDatabase,
    async (req, res) => {
        try {
            const {
                label,
                title,
                description,
                image_url
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    error:
                        "Card title is required"
                });
            }

            const [result] = await db.query(
                `
                INSERT INTO store_savings_sections
                (
                    label,
                    title,
                    description,
                    image_url
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    label || null,
                    title,
                    description || null,
                    image_url || null
                ]
            );

            res.status(201).json({
                message:
                    "Savings card added successfully",
                cardId: result.insertId
            });
        } catch (error) {
            console.error(
                "Add savings card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to add savings card",
                details: error.message
            });
        }
    }
);

app.put(
    "/api/store-savings/:id",
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const {
                label,
                title,
                description,
                image_url,
                is_active
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    error:
                        "Card title is required"
                });
            }

            const [result] = await db.query(
                `
                UPDATE store_savings_sections
                SET
                    label = ?,
                    title = ?,
                    description = ?,
                    image_url = ?,
                    is_active = ?
                WHERE id = ?
                `,
                [
                    label || null,
                    title,
                    description || null,
                    image_url || null,
                    is_active !== false,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Savings card not found"
                });
            }

            res.json({
                message:
                    "Savings card updated successfully"
            });
        } catch (error) {
            console.error(
                "Update savings card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to update savings card",
                details: error.message
            });
        }
    }
);

app.delete(
    "/api/store-savings/:id",
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await db.query(
                `
                UPDATE store_savings_sections
                SET is_active = FALSE
                WHERE id = ?
                `,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Savings card not found"
                });
            }

            res.json({
                message:
                    "Savings card removed successfully"
            });
        } catch (error) {
            console.error(
                "Delete savings card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to remove savings card",
                details: error.message
            });
        }
    }
);

// ==================================================
// GET IPAD PRODUCTS
// ==================================================

app.get(
    "/api/products/category/ipad",
    requireDatabase,
    async (req, res) => {
        try {
            const [products] = await db.query(`
                SELECT
                    id,
                    badge_text,
                    title,
                    description,
                    price_upfront,
                    price_monthly,
                    lease_monthly,
                    image_url,
                    category,
                    colors,
                    learn_more_link,
                    buy_link,
                    buy_text
                FROM products
                WHERE category = 'iPad'
                AND is_active = TRUE
                ORDER BY id ASC
            `);

            res.json(products);
        } catch (error) {
            console.error(
                "Error fetching iPad products:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch iPad products",
                error: error.message
            });
        }
    }
);

// ==================================================
// GET IPAD SHOP BENEFITS
// ==================================================

app.get(
    "/api/ipad-shop-benefits",
    requireDatabase,
    async (req, res) => {
        try {
            const [benefits] = await db.query(`
                SELECT
                    id,
                    label,
                    title,
                    description,
                    image_url,
                    link,
                    sort_order
                FROM ipad_shop_benefits
                WHERE is_active = TRUE
                ORDER BY sort_order ASC, id ASC
            `);

            res.json(benefits);
        } catch (error) {
            console.error(
                "Error fetching iPad shop benefits:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch iPad shop benefits",
                error: error.message
            });
        }
    }
);

// ==================================================
// IPAD GET TO KNOW
// ==================================================

app.get(
    "/api/ipad-get-to-know",
    requireDatabase,
    async (req, res) => {
        try {
            const [items] = await db.query(`
                SELECT 
                    id,
                    label,
                    title,
                    description,
                    detail_description,
                    image_url,
                    detail_image_url,
                    sort_order
                FROM ipad_get_to_know
                WHERE is_active = TRUE
                ORDER BY sort_order ASC, id ASC
            `);

            res.json(items);
        } catch (error) {
            console.error(
                "Error fetching iPad get to know:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch iPad get to know items",
                error: error.message
            });
        }
    }
);

// ==================================================
// IPAD SIGNIFICANT OTHERS
// ==================================================

app.get(
    "/api/ipad-significant-others",
    requireDatabase,
    async (req, res) => {
        try {
            const [items] = await db.query(`
                SELECT 
                    id,
                    title,
                    description,
                    image_url,
                    link,
                    sort_order
                FROM ipad_significant_others
                WHERE is_active = TRUE
                ORDER BY sort_order ASC, id ASC
            `);

            res.json(items);
        } catch (error) {
            console.error(
                "Error fetching iPad significant others:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch iPad significant others",
                error: error.message
            });
        }
    }
);


// ==================================================
// GET IPHONE PRODUCTS
// ==================================================

app.get(
    "/api/products/category/iphone",
    requireDatabase,
    async (req, res) => {
        try {
            const [products] = await db.query(`
                SELECT
                    id,
                    badge_text,
                    title,
                    description,
                    price_upfront,
                    price_monthly,
                    lease_monthly,
                    image_url,
                    category,
                    colors,
                    learn_more_link,
                    buy_link,
                    buy_text
                FROM products
                WHERE category = 'iPhone'
                AND is_active = TRUE
                ORDER BY id ASC
            `);

            res.json(products);
        } catch (error) {
            console.error(
                "Error fetching iPhone products:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch iPhone products",
                error: error.message
            });
        }
    }
);

// ==================================================
// GET IPHONE SHOPPING OFFERS
// ==================================================

app.get(
    "/api/iphone-shopping-offers",
    requireDatabase,
    async (req, res) => {
        try {
            const [offers] = await db.query(`
                SELECT
                    id,
                    category_label,
                    title,
                    description,
                    image_url,
                    link_url,
                    link_text,
                    sort_order
                FROM iphone_shopping_offers
                WHERE is_active = TRUE
                ORDER BY sort_order ASC, id ASC
            `);

            res.json(offers);
        } catch (error) {
            console.error(
                "Error fetching iPhone shopping offers:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch iPhone shopping offers",
                error: error.message
            });
        }
    }
);

// ==================================================
// GET IPHONE FEATURES (GET TO KNOW)
// ==================================================

app.get(
    "/api/iphone-features",
    requireDatabase,
    async (req, res) => {
        try {
            const [features] = await db.query(`
                SELECT
                    id,
                    category_label,
                    title,
                    description,
                    image_url,
                    link_url,
                    sort_order
                FROM iphone_features
                WHERE is_active = TRUE
                ORDER BY sort_order ASC, id ASC
            `);

            res.json(features);
        } catch (error) {
            console.error(
                "Error fetching iPhone features:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch iPhone features",
                error: error.message
            });
        }
    }
);


// ==================================================
// WATCH SHOPPING BENEFITS
// ==================================================

app.get(
    "/api/watch-shopping-benefits",
    requireDatabase,
    async (req, res) => {
        try {
            const [benefits] = await db.query(`
                SELECT
                    id,
                    eyebrow,
                    title,
                    description,
                    image_url,
                    link_url,
                    sort_order
                FROM watch_shopping_benefits
                WHERE is_active = TRUE
                ORDER BY sort_order ASC, id ASC
            `);

            res.json(benefits);
        } catch (error) {
            console.error(
                "Error fetching watch shopping benefits:",
                error
            );

            res.status(500).json({
                message: "Failed to fetch watch shopping benefits",
                error: error.message
            });
        }
    }
);

// ==================================================
// IPHONE SHOPPING OFFERS
// ==================================================

app.get(
    "/api/iphone-shopping-offers",
    requireDatabase,
    async (req, res) => {
        try {
            const [offers] = await db.query(`
                SELECT
                    id,
                    category_label,
                    title,
                    description,
                    image_url,
                    link_text,
                    link_url,
                    sort_order
                FROM iphone_shopping_offers
                ORDER BY sort_order ASC, id ASC
            `);

            res.json(offers);
        } catch (error) {
            console.error(
                "Error fetching iPhone shopping offers:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch iPhone shopping offers",
                error: error.message
            });
        }
    }
);

// ==================================================
// IPHONE FEATURES
// ==================================================

app.get(
    "/api/iphone-features",
    requireDatabase,
    async (req, res) => {
        try {
            const [features] = await db.query(`
                SELECT
                    id,
                    category_label,
                    title,
                    image_url,
                    link_text,
                    link_url,
                    sort_order
                FROM iphone_features
                ORDER BY sort_order ASC, id ASC
            `);

            res.json(features);
        } catch (error) {
            console.error(
                "Error fetching iPhone features:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch iPhone features",
                error: error.message
            });
        }
    }
);

// ==================================================
// APPLE WATCH LINEUP
// ==================================================

// PUBLIC GET

app.get(
    "/api/watch-lineup",
    requireDatabase,
    async (req, res) => {
        try {
            const [rows] = await db.query(`
                SELECT *
                FROM watch_lineup
                WHERE is_active = TRUE
                ORDER BY sort_order ASC, id ASC
            `);

            const products = rows.map((product) => {
                let colors = [];

                try {
                    colors = JSON.parse(
                        product.colors_json || "[]"
                    );
                } catch (error) {
                    colors = [];
                }

                return {
                    ...product,
                    colors
                };
            });

            res.json(products);
        } catch (error) {
            console.error(
                "Failed to fetch Watch lineup:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch Watch lineup",
                error: error.message
            });
        }
    }
);

// ADMIN POST

app.post(
    "/api/watch-lineup",
    requireAdmin,
    requireDatabase,
    async (req, res) => {
        try {
            const {
                product_name,
                badge,
                image_url,
                colors,
                description,
                price_text,
                lease_text,
                learn_more_url,
                buy_url,
                sort_order,
                is_active
            } = req.body;

            if (
                !product_name?.trim() ||
                !image_url?.trim()
            ) {
                return res.status(400).json({
                    message:
                        "Product name and image URL are required"
                });
            }

            const [result] = await db.query(
                `
                INSERT INTO watch_lineup
                (
                    product_name,
                    badge,
                    image_url,
                    colors_json,
                    description,
                    price_text,
                    lease_text,
                    learn_more_url,
                    buy_url,
                    sort_order,
                    is_active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    product_name.trim(),
                    badge || "",
                    image_url.trim(),
                    JSON.stringify(
                        Array.isArray(colors)
                            ? colors
                            : []
                    ),
                    description || "",
                    price_text || "",
                    lease_text || "",
                    learn_more_url || "#",
                    buy_url || "#",
                    Number(sort_order) || 0,
                    is_active === false ? 0 : 1
                ]
            );

            res.status(201).json({
                message:
                    "Watch product added successfully",
                id: result.insertId
            });
        } catch (error) {
            console.error(
                "Failed to add Watch product:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to add Watch product",
                error: error.message
            });
        }
    }
);

// ==================================================
// VISION PRO - TAKE A CLOSER LOOK
// ==================================================

// PUBLIC GET
//
// THIS IS THE ROUTE USED BY Vision.jsx
//
// GET:
// http://localhost:5000/api/vision-closer-look

app.get(
    "/api/vision-closer-look",
    requireDatabase,
    async (req, res) => {
        try {
            console.log(
                "Loading Vision closer look cards..."
            );

            const [rows] = await db.query(`
                SELECT
                    id,
                    title,
                    description,
                    image_url,
                    display_order
                FROM vision_closer_look
                WHERE is_active = TRUE
                ORDER BY display_order ASC, id ASC
            `);

            console.log(
                `Vision closer look cards loaded: ${rows.length}`
            );

            res.json(rows);
        } catch (error) {
            console.error(
                "Vision closer look database error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to load Vision closer look",
                details: error.message
            });
        }
    }
);

// ==================================================
// ADD VISION CLOSER LOOK CARD
// ==================================================

app.post(
    "/api/admin/vision-closer-look",
    requireAdmin,
    requireDatabase,
    async (req, res) => {
        try {
            const {
                title,
                description,
                image_url,
                display_order,
                is_active
            } = req.body;

            if (!title || !image_url) {
                return res.status(400).json({
                    error:
                        "Title and image are required"
                });
            }

            const [result] = await db.query(
                `
                INSERT INTO vision_closer_look
                (
                    title,
                    description,
                    image_url,
                    display_order,
                    is_active
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    title,
                    description || "",
                    image_url,
                    Number(display_order) || 0,
                    is_active !== false
                ]
            );

            res.status(201).json({
                message:
                    "Vision card added successfully",
                id: result.insertId
            });
        } catch (error) {
            console.error(
                "Add Vision card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to add Vision card",
                details: error.message
            });
        }
    }
);

// ==================================================
// UPDATE VISION CLOSER LOOK CARD
// ==================================================

app.put(
    "/api/admin/vision-closer-look/:id",
    requireAdmin,
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const {
                title,
                description,
                image_url,
                display_order,
                is_active
            } = req.body;

            if (!title || !image_url) {
                return res.status(400).json({
                    error:
                        "Title and image are required"
                });
            }

            const [result] = await db.query(
                `
                UPDATE vision_closer_look
                SET
                    title = ?,
                    description = ?,
                    image_url = ?,
                    display_order = ?,
                    is_active = ?
                WHERE id = ?
                `,
                [
                    title,
                    description || "",
                    image_url,
                    Number(display_order) || 0,
                    is_active !== false,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Vision card not found"
                });
            }

            res.json({
                message:
                    "Vision card updated successfully"
            });
        } catch (error) {
            console.error(
                "Update Vision card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to update Vision card",
                details: error.message
            });
        }
    }
);

// ==================================================
// DELETE VISION CLOSER LOOK CARD
// ==================================================

app.delete(
    "/api/admin/vision-closer-look/:id",
    requireAdmin,
    requireDatabase,
    async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await db.query(
                `
                DELETE FROM vision_closer_look
                WHERE id = ?
                `,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Vision card not found"
                });
            }

            res.json({
                message:
                    "Vision card deleted successfully"
            });
        } catch (error) {
            console.error(
                "Delete Vision card error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to delete Vision card",
                details: error.message
            });
        }
    }
);



// ==========================================
// AIRPODS NAVIGATION - PUBLIC
// ==========================================

app.get("/api/airpods-nav", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        href,
        icon,
        is_new,
        display_order
      FROM airpods_nav_items
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("AirPods navigation GET error:", error);

    res.status(500).json({
      message: "Failed to load AirPods navigation",
    });
  }
});

// ==========================================
// AIRPODS NAVIGATION - ADMIN GET
// ==========================================

app.get("/api/admin/airpods-nav", requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        href,
        icon,
        is_new,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM airpods_nav_items
      ORDER BY display_order ASC, id ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Admin AirPods navigation GET error:", error);

    res.status(500).json({
      message: "Failed to load AirPods navigation",
    });
  }
});

// ==========================================
// AIRPODS NAVIGATION - ADMIN ADD
// ==========================================

app.post("/api/admin/airpods-nav", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      href,
      icon,
      is_new,
      display_order,
      is_active,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO airpods_nav_items
        (
          name,
          href,
          icon,
          is_new,
          display_order,
          is_active
        )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        href || "#",
        icon || "airpods",
        is_new ? 1 : 0,
        Number(display_order) || 0,
        is_active !== false ? 1 : 0,
      ]
    );

    res.status(201).json({
      message: "AirPods navigation item added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Admin AirPods navigation POST error:", error);

    res.status(500).json({
      message: "Failed to add AirPods navigation item",
    });
  }
});

// ==========================================
// AIRPODS NAVIGATION - ADMIN UPDATE
// ==========================================

app.put("/api/admin/airpods-nav/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      href,
      icon,
      is_new,
      display_order,
      is_active,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const [result] = await db.query(
      `
      UPDATE airpods_nav_items
      SET
        name = ?,
        href = ?,
        icon = ?,
        is_new = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        name.trim(),
        href || "#",
        icon || "airpods",
        is_new ? 1 : 0,
        Number(display_order) || 0,
        is_active ? 1 : 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "AirPods navigation item not found",
      });
    }

    res.json({
      message: "AirPods navigation item updated successfully",
    });
  } catch (error) {
    console.error("Admin AirPods navigation PUT error:", error);

    res.status(500).json({
      message: "Failed to update AirPods navigation item",
    });
  }
});





// ==========================================
// AIRPODS NAVIGATION - ADMIN DELETE
// ==========================================

app.delete(
  "/api/admin/airpods-nav/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await db.query(
        `
        DELETE FROM airpods_nav_items
        WHERE id = ?
        `,
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "AirPods navigation item not found",
        });
      }

      res.json({
        message: "AirPods navigation item deleted successfully",
      });
    } catch (error) {
      console.error("Admin AirPods navigation DELETE error:", error);

      res.status(500).json({
        message: "Failed to delete AirPods navigation item",
      });
    }
  }
);


// ============================================
// ADMIN AUTHENTICATION MIDDLEWARE
// Place this BEFORE the admin settings routes
// ============================================

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required. Please sign in."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjust this check if your login token uses a different role format.
    if (
      !decoded ||
      String(decoded.role || "").toLowerCase() !== "admin"
    ) {
      return res.status(403).json({
        message: "Admin access required."
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token."
    });
  }
}



// Public settings that the storefront is allowed to read.
app.get("/api/settings/public", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT setting_key, setting_value
      FROM app_settings
      WHERE setting_key IN (
        'store',
        'website'
      )
    `);

    const settings = {};

    for (const row of rows) {
      settings[row.setting_key] =
        typeof row.setting_value === "string"
          ? JSON.parse(row.setting_value)
          : row.setting_value;
    }

    res.json(settings);
  } catch (error) {
    console.error("Read public settings:", error);
    res.status(500).json({
      message: "Unable to load website settings."
    });
  }
});


// ============================================
// ADMIN SETTINGS ROUTES
// Requires: app, db, and verifyAdmin
// ============================================

// Create the settings table

// Admin reads all general settings.
app.get("/api/settings", verifyAdmin, async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await db.query(`
      SELECT setting_key, setting_value
      FROM app_settings
    `);

    const settings = {};

    for (const row of rows) {
      try {
        settings[row.setting_key] =
          typeof row.setting_value === "string"
            ? JSON.parse(row.setting_value)
            : row.setting_value;
      } catch {
        settings[row.setting_key] = row.setting_value;
      }
    }

    return res.json(settings);
  } catch (error) {
    console.error("Read admin settings:", error);

    return res.status(500).json({
      message: "Unable to load settings."
    });
  }
});


// Save one settings section
app.put("/api/settings/:section", verifyAdmin, async (req, res) => {
  const allowedSections = [
    "store",
    "website",
    "notifications"
  ];

  const { section } = req.params;

  if (!allowedSections.includes(section)) {
    return res.status(400).json({
      message: "Invalid settings section."
    });
  }

  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      message: "Invalid settings data."
    });
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(
      `INSERT INTO app_settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE
         setting_value = VALUES(setting_value)`,
      [section, JSON.stringify(req.body)]
    );

    return res.json({
      message: `${section} settings saved successfully.`,
      settings: req.body
    });
  } catch (error) {
    console.error("Save settings:", error);

    return res.status(500).json({
      message: "Unable to save settings."
    });
  }
});

// Update admin password
app.put("/api/settings/security/password", verifyAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must contain at least 8 characters." });
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    let validCurrent = false;

    if (process.env.ADMIN_PASSWORD_HASH) {
      try {
        validCurrent = await bcrypt.compare(currentPassword, process.env.ADMIN_PASSWORD_HASH);
      } catch (err) {
        console.error("Compare env password hash error:", err);
      }
    }

    // Also check if admin exists in users table
    let dbAdmin = [];
    if (adminEmail) {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [adminEmail]);
      dbAdmin = rows;
      if (dbAdmin.length > 0 && !validCurrent) {
        validCurrent = await bcrypt.compare(currentPassword, dbAdmin[0].password);
      }
    }

    if (!validCurrent) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);

    if (dbAdmin.length > 0) {
      await db.query("UPDATE users SET password = ? WHERE email = ?", [hashedNew, adminEmail]);
    }

    // Update in-process environment variable
    process.env.ADMIN_PASSWORD_HASH = hashedNew;

    return res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ message: "Failed to update password." });
  }
});

// ==================================================
// ORDERS & TRANSACTIONS API ENDPOINTS
// ==================================================

// GET /api/orders (supports admin listing all, or user filtering)
app.get("/api/orders", requireDatabase, async (req, res) => {
    try {
        const { user_id, email, status } = req.query;
        let sql = `SELECT * FROM orders WHERE 1=1`;
        const params = [];

        if (user_id) {
            sql += ` AND user_id = ?`;
            params.push(user_id);
        }
        if (email) {
            sql += ` AND customer_email = ?`;
            params.push(email);
        }
        if (status && status !== 'All') {
            sql += ` AND (order_status = ? OR payment_status = ?)`;
            params.push(status, status);
        }

        sql += ` ORDER BY id DESC`;
        const [orders] = await db.query(sql, params);

        // Fetch all order items
        const [items] = await db.query(`SELECT * FROM order_items ORDER BY id ASC`);
        
        const itemsByOrder = {};
        for (const item of items) {
            if (!itemsByOrder[item.order_id]) {
                itemsByOrder[item.order_id] = [];
            }
            itemsByOrder[item.order_id].push({
                id: item.id,
                productId: item.product_id,
                name: item.title,
                title: item.title,
                price: Number(item.price),
                quantity: item.quantity,
                image: item.image_url
            });
        }

        const formattedOrders = orders.map(o => ({
            id: o.order_number || `ORD-${o.id}`,
            orderId: o.id,
            customerName: o.customer_name,
            email: o.customer_email,
            phone: o.customer_phone || "",
            date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            items: itemsByOrder[o.id] || [],
            shippingCost: Number(o.shipping_cost || 0),
            totalAmount: Number(o.total_amount || 0),
            subtotalAmount: Number(o.subtotal_amount || 0),
            taxAmount: Number(o.tax_amount || 0),
            paymentStatus: o.payment_status,
            orderStatus: o.order_status,
            shippingAddress: o.shipping_address || "",
            paymentMethod: o.payment_method || "card",
            paymentReference: o.payment_reference || "",
            deliveryMethod: o.delivery_method || "shipping",
            orderNotes: o.order_notes || ""
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({ message: "Failed to fetch orders." });
    }
});

// GET /api/orders/:id
app.get("/api/orders/:id", requireDatabase, async (req, res) => {
    try {
        const { id } = req.params;
        const isNumeric = /^\d+$/.test(String(id));
        const [orders] = await db.query(
            isNumeric 
                ? "SELECT * FROM orders WHERE id = ? OR order_number = ? LIMIT 1"
                : "SELECT * FROM orders WHERE order_number = ? LIMIT 1",
            isNumeric ? [Number(id), String(id)] : [String(id)]
        );

        if (!orders.length) {
            return res.status(404).json({ message: "Order not found." });
        }

        const o = orders[0];
        const [items] = await db.query(
            "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC",
            [o.id]
        );

        res.json({
            id: o.order_number || `ORD-${o.id}`,
            orderId: o.id,
            customerName: o.customer_name,
            email: o.customer_email,
            phone: o.customer_phone || "",
            date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            items: items.map(item => ({
                id: item.id,
                productId: item.product_id,
                name: item.title,
                title: item.title,
                price: Number(item.price),
                quantity: item.quantity,
                image: item.image_url
            })),
            shippingCost: Number(o.shipping_cost || 0),
            totalAmount: Number(o.total_amount || 0),
            subtotalAmount: Number(o.subtotal_amount || 0),
            taxAmount: Number(o.tax_amount || 0),
            paymentStatus: o.payment_status,
            orderStatus: o.order_status,
            shippingAddress: o.shipping_address || "",
            paymentMethod: o.payment_method || "card",
            paymentReference: o.payment_reference || "",
            deliveryMethod: o.delivery_method || "shipping",
            orderNotes: o.order_notes || ""
        });
    } catch (error) {
        console.error("Get single order error:", error);
        res.status(500).json({ message: "Failed to fetch order details." });
    }
});

// POST /api/orders (Create order from bag/checkout)
app.post("/api/orders", requireDatabase, async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            items = [],
            shippingCost = 0,
            paymentStatus = "Paid",
            userId = null
        } = req.body;

        if (!customerName || !customerEmail || !items.length) {
            return res.status(400).json({ message: "Customer name, email, and items are required." });
        }

        const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
        let totalAmount = Number(shippingCost) || 0;
        for (const item of items) {
            totalAmount += (Number(item.price) || 0) * (Number(item.quantity) || 1);
        }

        const [result] = await db.query(`
            INSERT INTO orders (
                order_number, user_id, customer_name, customer_email, customer_phone,
                total_amount, shipping_cost, payment_status, order_status, shipping_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Processing', ?)
        `, [
            orderNumber, userId, customerName.trim(), customerEmail.trim(),
            customerPhone || null, totalAmount, shippingCost, paymentStatus, shippingAddress || null
        ]);

        const orderId = result.insertId;

        for (const item of items) {
            await db.query(`
                INSERT INTO order_items (order_id, product_id, title, price, quantity, image_url)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                orderId,
                item.id || item.productId || null,
                item.name || item.title || "Product",
                Number(item.price) || 0,
                Number(item.quantity) || 1,
                item.image || item.image_url || null
            ]);

            // Deduct stock if product ID exists
            if (item.id || item.productId) {
                await db.query(`
                    UPDATE products SET stock = GREATEST(0, stock - ?)
                    WHERE id = ?
                `, [Number(item.quantity) || 1, item.id || item.productId]);
            }
        }

        res.status(201).json({
            message: "Order placed successfully.",
            orderId,
            orderNumber
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ message: "Failed to create order." });
    }
});

// PUT /api/orders/:id/status (Admin updates order/payment status)
app.put("/api/orders/:id/status", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus, paymentStatus } = req.body;

        const updates = [];
        const params = [];

        if (orderStatus) {
            updates.push("order_status = ?");
            params.push(orderStatus);
        }
        if (paymentStatus) {
            updates.push("payment_status = ?");
            params.push(paymentStatus);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: "Nothing to update." });
        }

        const isNumeric = /^\d+$/.test(String(id));
        let whereClause = "";
        if (isNumeric) {
            whereClause = "id = ? OR order_number = ?";
            params.push(Number(id), String(id));
        } else {
            whereClause = "order_number = ?";
            params.push(String(id));
        }

        const [result] = await db.query(
            `UPDATE orders SET ${updates.join(", ")} WHERE ${whereClause}`,
            params
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.json({ message: "Order status updated successfully." });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({ message: "Failed to update order status." });
    }
});

// ==================================================
// WEBSITE SECTIONS (CMS) API ENDPOINTS
// ==================================================

// PUBLIC: Get published sections for a specific page
// ==================================================
// PUBLIC WEBSITE SECTIONS ENDPOINT
// ==================================================

// Helper: Attach resolved assigned products to sections
async function attachAssignedProducts(sections, isPublic = true) {
    if (!Array.isArray(sections) || sections.length === 0) return sections;

    const allIds = new Set();
    sections.forEach((sec) => {
        let pids = sec.assigned_product_ids;
        if (typeof pids === "string") {
            try { pids = JSON.parse(pids); } catch { pids = []; }
        }
        if (Array.isArray(pids)) {
            pids.forEach((id) => { if (id) allIds.add(Number(id)); });
        }
    });

    if (allIds.size === 0) {
        sections.forEach((s) => {
            s.assigned_products = [];
            if (typeof s.assigned_product_ids === "string") {
                try { s.assigned_product_ids = JSON.parse(s.assigned_product_ids); } catch { s.assigned_product_ids = []; }
            }
        });
        return sections;
    }

    const idList = Array.from(allIds);
    let sql = `
        SELECT id, title, description, price_upfront, price_monthly, image_url, category, badge_text, status, is_active
        FROM products
        WHERE id IN (?)
    `;
    if (isPublic) {
        sql += ` AND (status = 'Active' OR is_active = 1) AND status != 'Archived'`;
    }

    const [productRows] = await db.query(sql, [idList]);
    const productMap = new Map();
    productRows.forEach((p) => productMap.set(p.id, p));

    sections.forEach((sec) => {
        let pids = sec.assigned_product_ids;
        if (typeof pids === "string") {
            try { pids = JSON.parse(pids); } catch { pids = []; }
        }
        if (Array.isArray(pids) && pids.length > 0) {
            sec.assigned_products = pids
                .map((id) => productMap.get(Number(id)))
                .filter(Boolean);
            sec.assigned_product_ids = pids;
        } else {
            sec.assigned_products = [];
            sec.assigned_product_ids = [];
        }
    });

    return sections;
}

app.get("/api/website-sections", requireDatabase, async (req, res) => {
    try {
        const { page, category } = req.query;
        const targetCategory = (category || page || "").trim();

        let sql = `
            SELECT 
                s.*,
                COALESCE(s.category, s.target_page) AS category,
                p.title AS product_title,
                p.price_upfront AS product_price,
                p.image_url AS product_image,
                p.category AS product_category
            FROM website_sections s
            LEFT JOIN products p ON s.product_id = p.id
            WHERE s.status = 'Published'
        `;
        const values = [];

        if (targetCategory) {
            const cleanTarget = targetCategory.toLowerCase().replace(/[\s\-_&()]/g, "");
            sql += ` AND (
                LOWER(s.category) = LOWER(?)
                OR LOWER(s.target_page) = LOWER(?)
                OR LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(s.category, s.target_page), ' ', ''), '-', ''), '_', ''), '&', ''), '(', ''), ')', '')) = ?
                OR LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(s.target_page, s.category), ' ', ''), '-', ''), '_', ''), '&', ''), '(', ''), ')', '')) = ?
                OR (? = 'home' AND (LOWER(s.category) = 'front' OR LOWER(s.target_page) = 'front'))
                OR (? = 'front' AND (LOWER(s.category) = 'home' OR LOWER(s.target_page) = 'home'))
                OR (? = 'homenew' AND (
                    LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(s.category, s.target_page), ' ', ''), '-', ''), '_', ''), '&', ''), '(', ''), ')', '')) IN ('homenew', 'home(new)', 'newhome')
                ))
            )`;
            values.push(targetCategory, targetCategory, cleanTarget, cleanTarget, cleanTarget, cleanTarget, cleanTarget);
        } else {
            sql += ` AND (LOWER(s.category) = 'home' OR LOWER(s.target_page) = 'home' OR LOWER(s.category) = 'front' OR LOWER(s.target_page) = 'front')`;
        }

        sql += " ORDER BY s.display_order ASC, s.id DESC";

        const [sections] = await db.query(sql, values);
        const resolved = await attachAssignedProducts(sections, true);
        res.json(resolved);
    } catch (error) {
        console.error("Get website sections error:", error);
        res.status(500).json({ message: "Failed to fetch website sections." });
    }
});

// ADMIN: Get all website sections (including Drafts)
app.get("/api/admin/website-sections", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { category } = req.query;
        let sql = `
            SELECT 
                s.*,
                COALESCE(s.category, s.target_page) AS category,
                p.title AS product_title,
                p.price_upfront AS product_price,
                p.image_url AS product_image,
                p.category AS product_category
            FROM website_sections s
            LEFT JOIN products p ON s.product_id = p.id
        `;
        const values = [];
        if (category && category !== "All") {
            const cleanCat = category.toLowerCase().replace(/[\s\-_&()]/g, "");
            sql += ` WHERE (
                LOWER(s.category) = LOWER(?)
                OR LOWER(s.target_page) = LOWER(?)
                OR LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(s.category, s.target_page), ' ', ''), '-', ''), '_', ''), '&', ''), '(', ''), ')', '')) = ?
                OR (? = 'homenew' AND (
                    LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(s.category, s.target_page), ' ', ''), '-', ''), '_', ''), '&', ''), '(', ''), ')', '')) IN ('homenew', 'home(new)', 'newhome')
                ))
            )`;
            values.push(category, category, cleanCat, cleanCat);
        }
        sql += ` ORDER BY s.display_order ASC, s.id DESC`;

        const [sections] = await db.query(sql, values);
        const resolved = await attachAssignedProducts(sections, false);
        res.json(resolved);
    } catch (error) {
        console.error("Get admin website sections error:", error);
        res.status(500).json({ message: "Failed to fetch admin sections." });
    }
});

// ADMIN: Create a website section
app.post("/api/admin/website-sections", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const {
            title,
            subtitle,
            description,
            section_name,
            section_key,
            badge_text,
            background_theme,
            background_color,
            category,
            target_page,
            product_id,
            assigned_product_ids,
            image_url,
            video_url,
            button_text,
            button_link,
            secondary_button_text,
            secondary_button_link,
            layout_type,
            display_order,
            status
        } = req.body;

        const resolvedCategory = (category || target_page || "").trim();
        const resolvedTargetPage = (target_page || category || resolvedCategory).trim();

        if (!title || (!resolvedCategory && !resolvedTargetPage)) {
            return res.status(400).json({ message: "Section title and product category are required." });
        }

        const serializedPids = Array.isArray(assigned_product_ids)
            ? JSON.stringify(assigned_product_ids)
            : (typeof assigned_product_ids === "string" ? assigned_product_ids : null);

        const [result] = await db.query(
            `INSERT INTO website_sections (
                section_name, section_key, title, subtitle, description, badge_text, category, target_page,
                product_id, assigned_product_ids, background_theme, background_color, image_url, video_url,
                button_text, button_link, secondary_button_text, secondary_button_link,
                layout_type, display_order, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                section_name || null,
                section_key || null,
                title.trim(),
                subtitle || null,
                description || null,
                badge_text || null,
                resolvedCategory,
                resolvedTargetPage,
                product_id ? Number(product_id) : null,
                serializedPids,
                background_theme || "default",
                background_color || null,
                image_url || null,
                video_url || null,
                button_text || "Learn More",
                button_link || "#",
                secondary_button_text || null,
                secondary_button_link || null,
                layout_type || "hero",
                Number(display_order) || 0,
                status === "Published" ? "Published" : "Draft"
            ]
        );

        const [newSection] = await db.query(
            `SELECT s.*, COALESCE(s.category, s.target_page) AS category,
                    p.title AS product_title, p.category AS product_category
             FROM website_sections s
             LEFT JOIN products p ON s.product_id = p.id
             WHERE s.id = ?`,
            [result.insertId]
        );

        const [resolved] = await attachAssignedProducts(newSection, false);

        res.status(201).json({
            message: "Website section created successfully.",
            section: resolved
        });
    } catch (error) {
        console.error("Create website section error:", error);
        res.status(500).json({ message: "Failed to create website section." });
    }
});

// ADMIN: Update a website section
app.put("/api/admin/website-sections/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            subtitle,
            description,
            section_name,
            section_key,
            badge_text,
            background_theme,
            background_color,
            category,
            target_page,
            product_id,
            assigned_product_ids,
            image_url,
            video_url,
            button_text,
            button_link,
            secondary_button_text,
            secondary_button_link,
            layout_type,
            display_order,
            status
        } = req.body;

        const [existing] = await db.query("SELECT * FROM website_sections WHERE id = ?", [id]);
        if (!existing.length) {
            return res.status(404).json({ message: "Section not found." });
        }

        const current = existing[0];
        const resolvedCategory = (category || target_page || current.category || current.target_page || "Home").trim();
        const resolvedTargetPage = (target_page || category || resolvedCategory).trim();

        const serializedPids = assigned_product_ids !== undefined
            ? (Array.isArray(assigned_product_ids) ? JSON.stringify(assigned_product_ids) : assigned_product_ids)
            : current.assigned_product_ids;

        await db.query(
            `UPDATE website_sections SET
                section_name = ?, section_key = ?, title = ?, subtitle = ?, description = ?, badge_text = ?,
                category = ?, target_page = ?, product_id = ?, assigned_product_ids = ?, background_theme = ?, background_color = ?,
                image_url = ?, video_url = ?, button_text = ?, button_link = ?, secondary_button_text = ?, secondary_button_link = ?,
                layout_type = ?, display_order = ?, status = ?
             WHERE id = ?`,
            [
                section_name !== undefined ? (section_name || null) : current.section_name,
                section_key !== undefined ? (section_key || null) : current.section_key,
                title ? title.trim() : current.title,
                subtitle !== undefined ? subtitle : current.subtitle,
                description !== undefined ? description : current.description,
                badge_text !== undefined ? badge_text : current.badge_text,
                resolvedCategory,
                resolvedTargetPage,
                product_id !== undefined ? (product_id ? Number(product_id) : null) : current.product_id,
                serializedPids,
                background_theme !== undefined ? background_theme : (current.background_theme || "default"),
                background_color !== undefined ? background_color : current.background_color,
                image_url !== undefined ? image_url : current.image_url,
                video_url !== undefined ? video_url : current.video_url,
                button_text || "Learn More",
                button_link || "#",
                secondary_button_text !== undefined ? secondary_button_text : current.secondary_button_text,
                secondary_button_link !== undefined ? secondary_button_link : current.secondary_button_link,
                layout_type || current.layout_type || "hero",
                display_order !== undefined ? Number(display_order) : current.display_order,
                status === "Published" ? "Published" : "Draft",
                id
            ]
        );

        const [updated] = await db.query(
            `SELECT s.*, COALESCE(s.category, s.target_page) AS category,
                    p.title AS product_title, p.category AS product_category
             FROM website_sections s
             LEFT JOIN products p ON s.product_id = p.id
             WHERE s.id = ?`,
            [id]
        );

        const [resolved] = await attachAssignedProducts(updated, false);

        res.json({ message: "Website section updated successfully.", section: resolved });
    } catch (error) {
        console.error("Update website section error:", error);
        res.status(500).json({ message: "Failed to update website section." });
    }
});

// ADMIN: Delete a website section
app.delete("/api/admin/website-sections/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM website_sections WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Section not found." });
        }

        res.json({ message: "Website section deleted successfully." });
    } catch (error) {
        console.error("Delete website section error:", error);
        res.status(500).json({ message: "Failed to delete website section." });
    }
});

// ==================================================
// GET MAC PRODUCTS (PUBLIC)
// ==================================================

app.get("/api/products/category/mac", requireDatabase, async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT
                id,
                badge_text,
                title,
                description,
                price_upfront,
                price_monthly,
                lease_monthly,
                image_url,
                category
            FROM products
            WHERE (LOWER(category) = 'mac' OR LOWER(category) LIKE 'mac%')
            AND is_active = TRUE
            ORDER BY id ASC
        `);

        res.json(products);
    } catch (error) {
        console.error("Error fetching Mac products:", error);
        res.status(500).json({
            message: "Failed to fetch Mac products",
            error: error.message
        });
    }
});

// ==================================================
// GET WATCH PRODUCTS (PUBLIC)
// ==================================================

app.get("/api/products/category/watch", requireDatabase, async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT
                id,
                badge_text,
                title,
                description,
                price_upfront,
                price_monthly,
                lease_monthly,
                image_url,
                category,
                colors,
                learn_more_link,
                buy_link,
                buy_text
            FROM products
            WHERE (LOWER(category) = 'watch' OR LOWER(category) LIKE '%watch%')
            AND is_active = TRUE
            ORDER BY id ASC
        `);

        res.json(products);
    } catch (error) {
        console.error("Error fetching Watch products:", error);
        res.status(500).json({
            message: "Failed to fetch Watch products",
            error: error.message
        });
    }
});

// ==================================================
// GET VISION PRODUCTS (PUBLIC)
// ==================================================

app.get("/api/products/category/vision", requireDatabase, async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT
                id,
                badge_text,
                title,
                description,
                price_upfront,
                price_monthly,
                lease_monthly,
                image_url,
                category,
                colors,
                storage_options,
                learn_more_link,
                buy_link,
                buy_text
            FROM products
            WHERE (LOWER(category) = 'vision' OR LOWER(category) LIKE '%vision%')
            AND is_active = TRUE
            ORDER BY id ASC
        `);

        res.json(products);
    } catch (error) {
        console.error("Error fetching Vision products:", error);
        res.status(500).json({
            message: "Failed to fetch Vision products",
            error: error.message
        });
    }
});

// ==================================================
// GENERIC CATEGORY PRODUCTS (PUBLIC)
// GET /api/products/category/:category
// ==================================================
app.get("/api/products/category/:category", requireDatabase, async (req, res) => {
    try {
        const cat = (req.params.category || "").trim();
        const [products] = await db.query(`
            SELECT * FROM products
            WHERE (LOWER(category) = LOWER(?) OR LOWER(category) LIKE ?)
              AND is_active = TRUE
            ORDER BY id ASC
        `, [cat, `%${cat}%`]);

        res.json(products.map(formatProductRow));
    } catch (error) {
        console.error("Error fetching category products:", error);
        res.status(500).json({
            message: "Failed to fetch category products: " + error.message
        });
    }
});
// ==================================================
// AIRPODS COMPARE CARDS
// ==================================================

app.get("/api/airpods-compare-cards", requireDatabase, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, badge_text, product_name, subtitle, description, price, image_url, buy_link, learn_more_link, sort_order
            FROM airpods_compare_cards
            WHERE is_active = 1
            ORDER BY sort_order ASC, id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error("AirPods compare cards error:", error);
        res.status(500).json({ message: "Failed to fetch AirPods compare cards." });
    }
});

app.post("/api/admin/airpods-compare-cards", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { badge_text, product_name, subtitle, description, price, image_url, buy_link, learn_more_link, sort_order, is_active } = req.body;
        if (!product_name) return res.status(400).json({ message: "product_name is required." });
        const [result] = await db.query(
            `INSERT INTO airpods_compare_cards (badge_text, product_name, subtitle, description, price, image_url, buy_link, learn_more_link, sort_order, is_active) VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [badge_text || "New", product_name, subtitle || null, description || null, price || null, image_url || null, buy_link || "#", learn_more_link || "#", sort_order || 0, is_active !== false ? 1 : 0]
        );
        res.status(201).json({ message: "Added.", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Failed to add." });
    }
});

app.put("/api/admin/airpods-compare-cards/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { badge_text, product_name, subtitle, description, price, image_url, buy_link, learn_more_link, sort_order, is_active } = req.body;
        const [result] = await db.query(
            `UPDATE airpods_compare_cards SET badge_text=?, product_name=?, subtitle=?, description=?, price=?, image_url=?, buy_link=?, learn_more_link=?, sort_order=?, is_active=? WHERE id=?`,
            [badge_text || "New", product_name, subtitle || null, description || null, price || null, image_url || null, buy_link || "#", learn_more_link || "#", sort_order || 0, is_active !== false ? 1 : 0, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Not found." });
        res.json({ message: "Updated." });
    } catch (error) {
        res.status(500).json({ message: "Failed to update." });
    }
});

app.delete("/api/admin/airpods-compare-cards/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        await db.query("UPDATE airpods_compare_cards SET is_active=0 WHERE id=?", [req.params.id]);
        res.json({ message: "Deleted." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete." });
    }
});

// ==================================================
// AIRPODS FEATURE COMPARISON
// ==================================================

app.get("/api/airpods-feature-comparison", requireDatabase, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, card_position, anc_text, has_heart_rate, has_ear_icon, sort_order
            FROM airpods_feature_comparison
            WHERE is_active = 1
            ORDER BY sort_order ASC, card_position ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error("AirPods feature comparison error:", error);
        res.status(500).json({ message: "Failed to fetch AirPods feature comparison." });
    }
});

app.put("/api/admin/airpods-feature-comparison/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { anc_text, has_heart_rate, has_ear_icon, sort_order, is_active } = req.body;
        await db.query(
            `UPDATE airpods_feature_comparison SET anc_text=?, has_heart_rate=?, has_ear_icon=?, sort_order=?, is_active=? WHERE id=?`,
            [anc_text || null, has_heart_rate ? 1 : 0, has_ear_icon ? 1 : 0, sort_order || 0, is_active !== false ? 1 : 0, req.params.id]
        );
        res.json({ message: "Updated." });
    } catch (error) {
        res.status(500).json({ message: "Failed to update." });
    }
});

// ==================================================
// AIRPODS BOTTOM COMPARISON
// ==================================================

app.get("/api/airpods-bottom-comparison", requireDatabase, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, card_position, translation_text, control_icon, control_text, battery_hours, battery_text, sort_order
            FROM airpods_bottom_comparison
            WHERE is_active = 1
            ORDER BY sort_order ASC, card_position ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error("AirPods bottom comparison error:", error);
        res.status(500).json({ message: "Failed to fetch AirPods bottom comparison." });
    }
});

app.put("/api/admin/airpods-bottom-comparison/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { translation_text, control_icon, control_text, battery_hours, battery_text, sort_order, is_active } = req.body;
        await db.query(
            `UPDATE airpods_bottom_comparison SET translation_text=?, control_icon=?, control_text=?, battery_hours=?, battery_text=?, sort_order=?, is_active=? WHERE id=?`,
            [translation_text, control_icon || "touch", control_text, battery_hours, battery_text, sort_order || 0, is_active !== false ? 1 : 0, req.params.id]
        );
        res.json({ message: "Updated." });
    } catch (error) {
        res.status(500).json({ message: "Failed to update." });
    }
});

// ==================================================
// AIRPODS KNOW CARDS (Get to Know AirPods)
// ==================================================

app.get("/api/airpods-know-cards", requireDatabase, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, category_label, title, description, card_type, sort_order
            FROM airpods_know_cards
            WHERE is_active = 1
            ORDER BY sort_order ASC, id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error("AirPods know cards error:", error);
        res.status(500).json({ message: "Failed to fetch AirPods know cards." });
    }
});

app.post("/api/admin/airpods-know-cards", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { category_label, title, description, card_type, sort_order, is_active } = req.body;
        if (!title) return res.status(400).json({ message: "title is required." });
        const [result] = await db.query(
            `INSERT INTO airpods_know_cards (category_label, title, description, card_type, sort_order, is_active) VALUES (?,?,?,?,?,?)`,
            [category_label || "", title, description || null, card_type || "anc", sort_order || 0, is_active !== false ? 1 : 0]
        );
        res.status(201).json({ message: "Added.", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Failed to add." });
    }
});

app.put("/api/admin/airpods-know-cards/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { category_label, title, description, card_type, sort_order, is_active } = req.body;
        const [result] = await db.query(
            `UPDATE airpods_know_cards SET category_label=?, title=?, description=?, card_type=?, sort_order=?, is_active=? WHERE id=?`,
            [category_label, title, description || null, card_type || "anc", sort_order || 0, is_active !== false ? 1 : 0, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Not found." });
        res.json({ message: "Updated." });
    } catch (error) {
        res.status(500).json({ message: "Failed to update." });
    }
});

app.delete("/api/admin/airpods-know-cards/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        await db.query("UPDATE airpods_know_cards SET is_active=0 WHERE id=?", [req.params.id]);
        res.json({ message: "Deleted." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete." });
    }
});

// ==================================================
// AIRPODS SERVICES
// ==================================================

app.get("/api/airpods-services", requireDatabase, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, title, description, link_text, link_url, icon_type, sort_order
            FROM airpods_services
            WHERE is_active = 1
            ORDER BY sort_order ASC, id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error("AirPods services error:", error);
        res.status(500).json({ message: "Failed to fetch AirPods services." });
    }
});

app.post("/api/admin/airpods-services", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { title, description, link_text, link_url, icon_type, sort_order, is_active } = req.body;
        if (!title) return res.status(400).json({ message: "title is required." });
        const [result] = await db.query(
            `INSERT INTO airpods_services (title, description, link_text, link_url, icon_type, sort_order, is_active) VALUES (?,?,?,?,?,?,?)`,
            [title, description || null, link_text || null, link_url || "#", icon_type || "delivery", sort_order || 0, is_active !== false ? 1 : 0]
        );
        res.status(201).json({ message: "Added.", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Failed to add." });
    }
});

app.put("/api/admin/airpods-services/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { title, description, link_text, link_url, icon_type, sort_order, is_active } = req.body;
        const [result] = await db.query(
            `UPDATE airpods_services SET title=?, description=?, link_text=?, link_url=?, icon_type=?, sort_order=?, is_active=? WHERE id=?`,
            [title, description || null, link_text || null, link_url || "#", icon_type || "delivery", sort_order || 0, is_active !== false ? 1 : 0, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Not found." });
        res.json({ message: "Updated." });
    } catch (error) {
        res.status(500).json({ message: "Failed to update." });
    }
});

app.delete("/api/admin/airpods-services/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        await db.query("UPDATE airpods_services SET is_active=0 WHERE id=?", [req.params.id]);
        res.json({ message: "Deleted." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete." });
    }
});

// ==================================================
// AIRPODS PROMOS
// ==================================================

app.get("/api/airpods-promos", requireDatabase, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, title, link_text, link_url, image_url, sort_order
            FROM airpods_promos
            WHERE is_active = 1
            ORDER BY sort_order ASC, id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error("AirPods promos error:", error);
        res.status(500).json({ message: "Failed to fetch AirPods promos." });
    }
});

app.post("/api/admin/airpods-promos", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { title, link_text, link_url, image_url, sort_order, is_active } = req.body;
        if (!title) return res.status(400).json({ message: "title is required." });
        const [result] = await db.query(
            `INSERT INTO airpods_promos (title, link_text, link_url, image_url, sort_order, is_active) VALUES (?,?,?,?,?,?)`,
            [title, link_text || "Learn more", link_url || "#", image_url || null, sort_order || 0, is_active !== false ? 1 : 0]
        );
        res.status(201).json({ message: "Added.", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Failed to add." });
    }
});

app.put("/api/admin/airpods-promos/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        const { title, link_text, link_url, image_url, sort_order, is_active } = req.body;
        const [result] = await db.query(
            `UPDATE airpods_promos SET title=?, link_text=?, link_url=?, image_url=?, sort_order=?, is_active=? WHERE id=?`,
            [title, link_text || "Learn more", link_url || "#", image_url || null, sort_order || 0, is_active !== false ? 1 : 0, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Not found." });
        res.json({ message: "Updated." });
    } catch (error) {
        res.status(500).json({ message: "Failed to update." });
    }
});

app.delete("/api/admin/airpods-promos/:id", requireAdmin, requireDatabase, async (req, res) => {
    try {
        await db.query("UPDATE airpods_promos SET is_active=0 WHERE id=?", [req.params.id]);
        res.json({ message: "Deleted." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete." });
    }
});

// ==================================================
// 404 HANDLER
// ==================================================

app.use((req, res) => {
    res.status(404).json({
        message: "API route not found",
        method: req.method,
        path: req.originalUrl
    });
});


// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================

app.use((error, req, res, next) => {
    console.error(
        "Unhandled Express error:",
        error
    );

    res.status(500).json({
        message: "Internal server error",
        error: error.message
    });
});

// ==================================================
// START SERVER
// ==================================================
//
// IMPORTANT FIX:
//
// The old code did:
//
//     await setupDatabase();
//     app.listen();
//
// If setupDatabase() failed, Express never started.
//
// The new code starts Express first, then initializes
// the database.
//
// Therefore localhost:5000 will remain available and
// database problems will be reported as API errors instead
// of ERR_CONNECTION_REFUSED.
//

const server = app.listen(PORT,"0.0.0.0", () => {
    console.log("");
    console.log("=================================");
    console.log("APPLE STORE SERVER");
    console.log("=================================");
    console.log(
        `Server running on http://localhost:${PORT}`
    );
    console.log(
        `Health check: http://localhost:${PORT}/api/health`
    );
    console.log(
        `Vision API: http://localhost:${PORT}/api/vision-closer-look`
    );
    console.log("=================================");
    console.log("");
});

// ==================================================
// DATABASE INITIALIZATION
// ==================================================

(async () => {
    try {
        console.log(
            "Initializing database..."
        );

        await setupDatabase();

        // Test the database connection after setup.
        await db.query("SELECT 1");

        databaseReady = true;
        databaseError = null;

        console.log("");
        console.log(
            "================================="
        );
        console.log(
            "DATABASE READY"
        );
        console.log(
            "================================="
        );
        console.log("");
    } catch (error) {
        databaseReady = false;
        databaseError = error;

        console.error("");
        console.error(
            "================================="
        );
        console.error(
            "DATABASE INITIALIZATION FAILED"
        );
        console.error(
            "================================="
        );
        console.error(
            error
        );
        console.error(
            "The Express server is still running."
        );
        console.error(
            "Fix the database/setupDatabase.js problem and restart the server."
        );
        console.error("");
    }
})();

// ==================================================
// SERVER ERROR HANDLING
// ==================================================

server.on("error", (error) => {
    console.error(
        "Express server error:",
        error
    );

    if (error.code === "EADDRINUSE") {
        console.error(
            `Port ${PORT} is already in use.`
        );
        process.exit(1);
    }
});

// ==================================================
// PROCESS ERROR HANDLING
// ==================================================

process.on(
    "unhandledRejection",
    (reason) => {
        console.error(
            "Unhandled Promise Rejection:",
            reason
        );
    }
);

process.on(
    "uncaughtException",
    (error) => {
        console.error(
            "Uncaught Exception:",
            error
        );
    }
);