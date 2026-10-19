const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const authRoutes = require("./Routes/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminAuthRoutes = require("./Routes/adminAuth");
const cookieParser = require("cookie-parser");


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
            "http://127.0.0.1:5173"
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
// AUTHENTICATION ROUTES
app.use("/api/auth", authRoutes);

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

    if (
      decoded.role !== "admin" ||
      !configuredAdminEmail ||
      tokenEmail !== configuredAdminEmail
    ) {
      return res.status(403).json({
        message: "Admin access denied. Check the admin JWT role and email.",
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
function validateProduct(body, partial = false) {
    const {
        title,
        category,
        image_url,
        price_upfront,
        price_monthly,
        lease_monthly,
    } = body;

    if (!partial || title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            return "Product title is required.";
        }
    }

    if (!partial || category !== undefined) {
        if (typeof category !== "string" || !category.trim()) {
            return "Product category is required.";
        }
    }

    if (!partial || image_url !== undefined) {
        if (typeof image_url !== "string" || !image_url.trim()) {
            return "Product image URL is required.";
        }
    }

    for (const [field, value] of Object.entries({
        price_upfront,
        price_monthly,
        lease_monthly,
    })) {
        if (value === undefined || value === null || value === "") {
            continue;
        }

        const number = Number(value);

        if (!Number.isFinite(number) || number < 0) {
            return `${field} must be a non-negative number.`;
        }
    }

    if (
        image_url &&
        !/^https?:\/\/|^\/uploads\//i.test(image_url)
    ) {
        return "Image URL must be HTTP(S) or a local /uploads/ path.";
    }

    return null;
}

// ------------------------------------------
// ADMIN: GET ALL PRODUCTS
// GET /api/products?category=iPhone
// ------------------------------------------

app.get(
    "/api/products",
    requireAdmin,
    requireDatabase,
    async (req, res) => {
        try {
            const { category, search, status } = req.query;

            let sql = `
                SELECT
                    id,
                    category,
                    badge_text,
                    title,
                    description,
                    price_upfront,
                    price_monthly,
                    lease_monthly,
                    image_url,
                    learn_more_link,
                    buy_link,
                    buy_text,
                    is_active,
                    created_at
                FROM products
                WHERE 1 = 1
            `;

            const values = [];

            if (category) {
                sql += " AND category = ?";
                values.push(category);
            }

            if (search) {
                sql += " AND (title LIKE ? OR CAST(id AS CHAR) = ?)";
                values.push(`%${search}%`, String(search));
            }

            if (status === "active") {
                sql += " AND is_active = TRUE";
            } else if (status === "inactive") {
                sql += " AND is_active = FALSE";
            }

            sql += " ORDER BY id DESC";

            const [products] = await db.query(sql, values);

            res.json(products);
        } catch (error) {
            console.error("Get admin products error:", error);
            res.status(500).json({
                message: "Failed to fetch products.",
            });
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
                return res.status(400).json({
                    message: validationError,
                });
            }

            const {
                badge_text,
                title,
                description,
                price_upfront,
                price_monthly,
                lease_monthly,
                image_url,
                category,
                learn_more_link,
                buy_link,
                buy_text,
                is_active,
            } = req.body;

            const [result] = await db.query(
                `INSERT INTO products (
                    badge_text,
                    title,
                    description,
                    price_upfront,
                    price_monthly,
                    lease_monthly,
                    image_url,
                    category,
                    learn_more_link,
                    buy_link,
                    buy_text,
                    is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    normalizeNullable(badge_text),
                    title.trim(),
                    normalizeNullable(description),
                    normalizeNullable(price_upfront),
                    normalizeNullable(price_monthly),
                    normalizeNullable(lease_monthly),
                    image_url.trim(),
                    category.trim(),
                    normalizeNullable(learn_more_link),
                    normalizeNullable(buy_link),
                    normalizeNullable(buy_text),
                    is_active === false || is_active === 0 ? 0 : 1,
                ]
            );

            const [rows] = await db.query(
                "SELECT * FROM products WHERE id = ?",
                [result.insertId]
            );

            res.status(201).json({
                message: "Product added successfully.",
                product: rows[0],
            });
        } catch (error) {
            console.error("Add product error:", error);
            res.status(500).json({
                message: "Failed to add product.",
            });
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
                return res.status(400).json({
                    message: "Invalid product ID.",
                });
            }

            const validationError = validateProduct(
                req.body,
                true
            );

            if (validationError) {
                return res.status(400).json({
                    message: validationError,
                });
            }

            const [existingRows] = await db.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            if (!existingRows.length) {
                return res.status(404).json({
                    message: "Product not found.",
                });
            }

            const existing = existingRows[0];
            const body = req.body;

            const next = {
                badge_text:
                    body.badge_text === undefined
                        ? existing.badge_text
                        : normalizeNullable(body.badge_text),

                title:
                    body.title === undefined
                        ? existing.title
                        : body.title.trim(),

                description:
                    body.description === undefined
                        ? existing.description
                        : normalizeNullable(body.description),

                price_upfront:
                    body.price_upfront === undefined
                        ? existing.price_upfront
                        : normalizeNullable(body.price_upfront),

                price_monthly:
                    body.price_monthly === undefined
                        ? existing.price_monthly
                        : normalizeNullable(body.price_monthly),

                lease_monthly:
                    body.lease_monthly === undefined
                        ? existing.lease_monthly
                        : normalizeNullable(body.lease_monthly),

                image_url:
                    body.image_url === undefined
                        ? existing.image_url
                        : body.image_url.trim(),

                category:
                    body.category === undefined
                        ? existing.category
                        : body.category.trim(),

                learn_more_link:
                    body.learn_more_link === undefined
                        ? existing.learn_more_link
                        : normalizeNullable(body.learn_more_link),

                buy_link:
                    body.buy_link === undefined
                        ? existing.buy_link
                        : normalizeNullable(body.buy_link),

                buy_text:
                    body.buy_text === undefined
                        ? existing.buy_text
                        : normalizeNullable(body.buy_text),

                is_active:
                    body.is_active === undefined
                        ? existing.is_active
                        : (
                            body.is_active === true ||
                            body.is_active === 1 ||
                            body.is_active === "1"
                        ) ? 1 : 0,
            };

            await db.query(
                `UPDATE products SET
                    badge_text = ?,
                    title = ?,
                    description = ?,
                    price_upfront = ?,
                    price_monthly = ?,
                    lease_monthly = ?,
                    image_url = ?,
                    category = ?,
                    learn_more_link = ?,
                    buy_link = ?,
                    buy_text = ?,
                    is_active = ?
                 WHERE id = ?`,
                [
                    next.badge_text,
                    next.title,
                    next.description,
                    next.price_upfront,
                    next.price_monthly,
                    next.lease_monthly,
                    next.image_url,
                    next.category,
                    next.learn_more_link,
                    next.buy_link,
                    next.buy_text,
                    next.is_active,
                    id,
                ]
            );

            res.json({
                message: "Product updated successfully.",
            });
        } catch (error) {
            console.error("Update product error:", error);
            res.status(500).json({
                message: "Failed to update product.",
            });
        }
    }
);

// ------------------------------------------
// ADMIN: SOFT DELETE PRODUCT
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
                return res.status(400).json({
                    message: "Invalid product ID.",
                });
            }

            const [result] = await db.query(
                `UPDATE products
                 SET is_active = FALSE
                 WHERE id = ? AND is_active = TRUE`,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Active product not found.",
                });
            }

            res.json({
                message: "Product removed successfully.",
            });
        } catch (error) {
            console.error("Delete product error:", error);
            res.status(500).json({
                message: "Failed to remove product.",
            });
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
                    category
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
// GET PRODUCTS
// ==================================================

app.get(
    "/api/products",
    requireAdmin,
    requireDatabase,
    async (req, res) => {
        try {
            const { category } = req.query;

            let query = `
                SELECT
                    id,
                    category,
                    badge_text,
                    title,
                    description,
                    price_upfront,
                    price_monthly,
                    lease_monthly,
                    image_url,
                    learn_more_link,
                    buy_link,
                    buy_text
                FROM products
            `;

            const values = [];

            if (category) {
                query += ` WHERE category = ?`;
                values.push(category);
            }

            query += ` ORDER BY id ASC`;

            const [products] = await db.query(
                query,
                values
            );

            res.json(products);
        } catch (error) {
            console.error(
                "Error fetching products:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch products",
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