const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const {
    generateTransactionReference,
    validateAndCalculateOrder,
    GatewayHandlers
} = require("../services/paymentService");

// Helper: Require Admin Middleware
const requireAdmin = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Admin authorization required." });
    }
    const token = authorization.slice(7).trim();
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && (decoded.role === "admin" || (process.env.ADMIN_EMAIL && decoded.email === process.env.ADMIN_EMAIL))) {
            req.user = decoded;
            return next();
        }
        return res.status(403).json({ message: "Access forbidden. Admin role required." });
    } catch {
        return res.status(401).json({ message: "Invalid or expired admin session token." });
    }
};

/**
 * ------------------------------------------------------------------
 * PUBLIC: GET ACTIVE PAYMENT METHODS
 * GET /api/payments/methods
 * ------------------------------------------------------------------
 */
router.get("/methods", async (req, res) => {
    try {
        const [methods] = await db.query(`
            SELECT id, gateway_key, name, description, badge, is_active,
                   is_test_mode, supported_currencies, instructions, config_data, display_order
            FROM payment_gateways_config
            WHERE is_active = TRUE
            ORDER BY display_order ASC
        `);

        // Sanitize: never expose secret keys to public
        const sanitized = methods.map(m => {
            let config = {};
            try {
                config = typeof m.config_data === "string" ? JSON.parse(m.config_data) : (m.config_data || {});
            } catch {
                config = {};
            }

            // Remove any potential secrets
            delete config.secretKey;
            delete config.privateKey;
            delete config.appKey;

            let currencies = ["USD", "ETB"];
            try {
                currencies = typeof m.supported_currencies === "string" ? JSON.parse(m.supported_currencies) : (m.supported_currencies || ["USD"]);
            } catch {
                currencies = ["USD"];
            }

            return {
                id: m.id,
                key: m.gateway_key,
                name: m.name,
                description: m.description,
                badge: m.badge,
                isTestMode: Boolean(m.is_test_mode),
                supportedCurrencies: currencies,
                instructions: m.instructions,
                config: config
            };
        });

        res.json(sanitized);
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        res.status(500).json({ message: "Unable to load payment methods." });
    }
});

/**
 * ------------------------------------------------------------------
 * PUBLIC: CALCULATE ORDER SUMMARY WITH DATABASE PRICES
 * POST /api/checkout/calculate
 * ------------------------------------------------------------------
 */
router.post("/calculate", async (req, res) => {
    try {
        const { items = [], deliveryMethod = "shipping" } = req.body;
        const calculation = await validateAndCalculateOrder(items, deliveryMethod);
        res.json(calculation);
    } catch (error) {
        console.error("Checkout calculate error:", error);
        res.status(400).json({ message: error.message || "Calculation failed." });
    }
});

/**
 * ------------------------------------------------------------------
 * PUBLIC: INITIALIZE ORDER & PAYMENT
 * POST /api/payments/initialize
 * ------------------------------------------------------------------
 */
router.post("/initialize", async (req, res) => {
    let connection;
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            deliveryMethod = "shipping",
            paymentMethod = "card",
            items = [],
            orderNotes = "",
            userId = null,
            cardData = {}
        } = req.body;

        // Basic validations
        if (!customerName || !customerName.trim()) {
            return res.status(400).json({ message: "Customer full name is required." });
        }
        if (!customerEmail || !customerEmail.trim()) {
            return res.status(400).json({ message: "Customer email address is required." });
        }
        if (!items || !items.length) {
            return res.status(400).json({ message: "Your shopping bag is empty." });
        }

        // Validate and calculate totals with DB prices
        const calculation = await validateAndCalculateOrder(items, deliveryMethod);

        // Fetch gateway configuration
        const [gatewayRows] = await db.query(
            "SELECT * FROM payment_gateways_config WHERE gateway_key = ? AND is_active = TRUE LIMIT 1",
            [paymentMethod]
        );

        if (!gatewayRows.length) {
            return res.status(400).json({ message: `Payment method '${paymentMethod}' is currently unavailable.` });
        }
        const gatewayConfig = gatewayRows[0];

        // Generate unique Order Number and Transaction Reference
        const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
        const txRef = generateTransactionReference("APL");

        // Obtain connection for transaction
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Insert Order
        const [orderResult] = await connection.query(`
            INSERT INTO orders (
                order_number, user_id, customer_name, customer_email, customer_phone,
                total_amount, shipping_cost, payment_status, order_status, shipping_address,
                payment_method, payment_reference, delivery_method, subtotal_amount,
                tax_amount, order_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', 'Processing', ?, ?, ?, ?, ?, ?, ?)
        `, [
            orderNumber,
            userId || null,
            customerName.trim(),
            customerEmail.trim().toLowerCase(),
            customerPhone || null,
            calculation.totalAmount,
            calculation.shippingCost,
            shippingAddress || null,
            paymentMethod,
            txRef,
            deliveryMethod,
            calculation.subtotal,
            calculation.taxAmount,
            orderNotes || null
        ]);

        const orderId = orderResult.insertId;

        // 2. Insert Order Items & Deduct Stock
        for (const item of calculation.items) {
            await connection.query(`
                INSERT INTO order_items (order_id, product_id, title, price, quantity, image_url)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                orderId,
                item.productId,
                item.title,
                item.unitPrice,
                item.quantity,
                item.imageUrl
            ]);

            if (item.productId) {
                await connection.query(`
                    UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?
                `, [item.quantity, item.productId]);
            }
        }

        // 3. Create Payment Record (Pending)
        const [paymentResult] = await connection.query(`
            INSERT INTO payments (
                order_id, transaction_reference, gateway, amount, currency,
                status, gateway_reference, payment_details
            ) VALUES (?, ?, ?, ?, 'USD', 'pending', NULL, ?)
        `, [
            orderId,
            txRef,
            paymentMethod,
            calculation.totalAmount,
            JSON.stringify({
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim(),
                deliveryMethod: deliveryMethod,
                timestamp: new Date().toISOString()
            })
        ]);

        const paymentId = paymentResult.insertId;

        // 4. Invoke Gateway Handler
        const orderSummary = {
            id: orderId,
            order_number: orderNumber,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress
        };

        const paymentRecord = {
            id: paymentId,
            transaction_reference: txRef,
            amount: calculation.totalAmount
        };

        const handler = GatewayHandlers[paymentMethod] || GatewayHandlers.card;
        const gatewayResult = await handler(paymentRecord, gatewayConfig, orderSummary, cardData);

        // If gateway immediately confirmed payment (e.g. Test Card instant authorize)
        let finalPaymentStatus = "Pending";
        if (gatewayResult.paymentStatus === "successful") {
            finalPaymentStatus = "Paid";
            await connection.query(
                "UPDATE payments SET status = 'successful', payment_details = ? WHERE id = ?",
                [JSON.stringify({ ...gatewayResult, verifiedAt: new Date().toISOString() }), paymentId]
            );
            await connection.query(
                "UPDATE orders SET payment_status = 'Paid' WHERE id = ?",
                [orderId]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            orderId,
            orderNumber,
            transactionReference: txRef,
            paymentStatus: finalPaymentStatus,
            gateway: paymentMethod,
            calculation,
            gatewayResult
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Order initialization error:", error);
        res.status(500).json({
            message: error.message || "Failed to initialize checkout transaction."
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

/**
 * ------------------------------------------------------------------
 * PUBLIC: VERIFY PAYMENT STATUS
 * GET /api/payments/verify/:reference
 * ------------------------------------------------------------------
 */
router.get("/verify/:reference", async (req, res) => {
    try {
        const { reference } = req.params;

        const [payments] = await db.query(`
            SELECT p.*, o.order_number, o.customer_name, o.customer_email, o.order_status, o.payment_status as order_payment_status
            FROM payments p
            JOIN orders o ON p.order_id = o.id
            WHERE p.transaction_reference = ? OR o.order_number = ?
            LIMIT 1
        `, [reference, reference]);

        if (!payments.length) {
            return res.status(404).json({ message: "Transaction reference not found." });
        }

        const p = payments[0];
        let details = {};
        try {
            details = typeof p.payment_details === "string" ? JSON.parse(p.payment_details) : (p.payment_details || {});
        } catch {
            details = {};
        }

        res.json({
            transactionReference: p.transaction_reference,
            orderNumber: p.order_number,
            gateway: p.gateway,
            amount: Number(p.amount),
            currency: p.currency,
            status: p.status,
            orderPaymentStatus: p.order_payment_status,
            orderStatus: p.order_status,
            customerName: p.customer_name,
            customerEmail: p.customer_email,
            paymentDetails: details,
            createdAt: p.created_at
        });

    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: "Failed to verify transaction." });
    }
});

/**
 * ------------------------------------------------------------------
 * PUBLIC: SUBMIT BANK TRANSFER SLIP / REFERENCE
 * POST /api/payments/bank-transfer/submit-slip
 * ------------------------------------------------------------------
 */
router.post("/bank-transfer/submit-slip", async (req, res) => {
    try {
        const { orderNumber, bankName, transferReference, senderName, notes } = req.body;

        if (!orderNumber || !transferReference) {
            return res.status(400).json({ message: "Order number and bank transfer reference are required." });
        }

        const [orders] = await db.query(
            "SELECT id FROM orders WHERE order_number = ? LIMIT 1",
            [orderNumber]
        );

        if (!orders.length) {
            return res.status(404).json({ message: "Order not found." });
        }

        const orderId = orders[0].id;

        const [payments] = await db.query(
            "SELECT id, payment_details FROM payments WHERE order_id = ? ORDER BY id DESC LIMIT 1",
            [orderId]
        );

        let details = {};
        if (payments.length && payments[0].payment_details) {
            try {
                details = typeof payments[0].payment_details === "string" 
                    ? JSON.parse(payments[0].payment_details) 
                    : payments[0].payment_details;
            } catch {
                details = {};
            }
        }

        details.bankSubmission = {
            bankName: bankName || "Commercial Bank of Ethiopia",
            transferReference: transferReference.trim(),
            senderName: senderName || "",
            notes: notes || "",
            submittedAt: new Date().toISOString()
        };

        if (payments.length) {
            await db.query(
                "UPDATE payments SET payment_details = ?, gateway_reference = ? WHERE id = ?",
                [JSON.stringify(details), transferReference.trim(), payments[0].id]
            );
        }

        await db.query(
            "UPDATE orders SET payment_reference = ? WHERE id = ?",
            [transferReference.trim(), orderId]
        );

        res.json({
            success: true,
            message: "Bank transfer verification details submitted successfully. Our team will review and approve shortly."
        });

    } catch (error) {
        console.error("Submit slip error:", error);
        res.status(500).json({ message: "Failed to submit bank transfer verification." });
    }
});

/**
 * ------------------------------------------------------------------
 * PUBLIC: PAYMENT WEBHOOK (Chapa / Telebirr callback)
 * POST /api/payments/webhook
 * ------------------------------------------------------------------
 */
router.post("/webhook", async (req, res) => {
    try {
        const body = req.body || {};
        console.log("Received payment gateway webhook:", JSON.stringify(body));

        const txRef = body.tx_ref || body.transactionReference || body.orderId;
        const status = body.status;

        if (txRef && (status === "success" || status === "successful" || status === "Paid")) {
            await db.query(
                "UPDATE payments SET status = 'successful' WHERE transaction_reference = ?",
                [txRef]
            );
            await db.query(
                "UPDATE orders SET payment_status = 'Paid' WHERE payment_reference = ?",
                [txRef]
            );
        }

        res.json({ status: "webhook_received" });
    } catch (error) {
        console.error("Webhook processing error:", error);
        res.status(500).json({ message: "Webhook error" });
    }
});

/**
 * ------------------------------------------------------------------
 * ADMIN: GET ALL PAYMENT TRANSACTIONS
 * GET /api/admin/payments
 * ------------------------------------------------------------------
 */
router.get("/admin/transactions", requireAdmin, async (req, res) => {
    try {
        const { gateway, status, search } = req.query;

        let sql = `
            SELECT 
                p.id as payment_id,
                p.transaction_reference,
                p.gateway,
                p.amount,
                p.currency,
                p.status as payment_status,
                p.gateway_reference,
                p.payment_details,
                p.created_at as payment_date,
                o.id as order_id,
                o.order_number,
                o.customer_name,
                o.customer_email,
                o.customer_phone,
                o.order_status,
                o.payment_status as order_payment_status,
                o.delivery_method,
                o.shipping_address
            FROM payments p
            JOIN orders o ON p.order_id = o.id
            WHERE 1=1
        `;
        const params = [];

        if (gateway && gateway !== "All") {
            sql += " AND p.gateway = ?";
            params.push(gateway);
        }

        if (status && status !== "All") {
            sql += " AND p.status = ?";
            params.push(status.toLowerCase());
        }

        if (search) {
            sql += " AND (p.transaction_reference LIKE ? OR o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ?)";
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        sql += " ORDER BY p.id DESC";

        const [rows] = await db.query(sql, params);

        const formatted = rows.map(r => {
            let details = {};
            try {
                details = typeof r.payment_details === "string" ? JSON.parse(r.payment_details) : (r.payment_details || {});
            } catch {
                details = {};
            }

            return {
                paymentId: r.payment_id,
                transactionReference: r.transaction_reference,
                gateway: r.gateway,
                amount: Number(r.amount),
                currency: r.currency,
                status: r.payment_status,
                gatewayReference: r.gateway_reference,
                paymentDetails: details,
                paymentDate: r.payment_date,
                orderId: r.order_id,
                orderNumber: r.order_number,
                customerName: r.customer_name,
                customerEmail: r.customer_email,
                customerPhone: r.customer_phone,
                orderStatus: r.order_status,
                orderPaymentStatus: r.order_payment_status,
                deliveryMethod: r.delivery_method,
                shippingAddress: r.shipping_address
            };
        });

        res.json(formatted);

    } catch (error) {
        console.error("Admin fetch payments error:", error);
        res.status(500).json({ message: "Failed to load transactions." });
    }
});

/**
 * ------------------------------------------------------------------
 * ADMIN: VERIFY / APPROVE PAYMENT MANUALLY
 * PUT /api/admin/payments/:id/verify
 * ------------------------------------------------------------------
 */
router.put("/admin/verify/:id", requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status = "successful", notes = "" } = req.body;

        const [payments] = await db.query(
            "SELECT id, order_id, payment_details FROM payments WHERE id = ? LIMIT 1",
            [id]
        );

        if (!payments.length) {
            return res.status(404).json({ message: "Payment record not found." });
        }

        const p = payments[0];
        let details = {};
        try {
            details = typeof p.payment_details === "string" ? JSON.parse(p.payment_details) : (p.payment_details || {});
        } catch {
            details = {};
        }

        details.adminVerification = {
            verifiedBy: req.user?.email || "Admin",
            verifiedAt: new Date().toISOString(),
            status: status,
            notes: notes
        };

        const targetPaymentStatus = status === "successful" ? "successful" : (status === "failed" ? "failed" : "pending");
        const orderPaymentStatus = status === "successful" ? "Paid" : (status === "failed" ? "Failed" : "Pending");

        await db.query(
            "UPDATE payments SET status = ?, payment_details = ? WHERE id = ?",
            [targetPaymentStatus, JSON.stringify(details), id]
        );

        await db.query(
            "UPDATE orders SET payment_status = ? WHERE id = ?",
            [orderPaymentStatus, p.order_id]
        );

        res.json({
            success: true,
            message: `Payment updated to '${targetPaymentStatus}' and Order set to '${orderPaymentStatus}'.`
        });

    } catch (error) {
        console.error("Admin verify payment error:", error);
        res.status(500).json({ message: "Failed to verify transaction." });
    }
});

/**
 * ------------------------------------------------------------------
 * ADMIN: GET & UPDATE GATEWAY CONFIGURATIONS
 * GET & PUT /api/admin/payment-gateways
 * ------------------------------------------------------------------
 */
router.get("/admin/gateways", requireAdmin, async (req, res) => {
    try {
        const [gateways] = await db.query(
            "SELECT * FROM payment_gateways_config ORDER BY display_order ASC"
        );
        res.json(gateways.map(g => {
            let config = {};
            try {
                config = typeof g.config_data === "string" ? JSON.parse(g.config_data) : (g.config_data || {});
            } catch {
                config = {};
            }
            return {
                id: g.id,
                gatewayKey: g.gateway_key,
                name: g.name,
                description: g.description,
                badge: g.badge,
                isActive: Boolean(g.is_active),
                isTestMode: Boolean(g.is_test_mode),
                instructions: g.instructions,
                configData: config,
                displayOrder: g.display_order
            };
        }));
    } catch (error) {
        console.error("Admin get gateways error:", error);
        res.status(500).json({ message: "Failed to load gateways." });
    }
});

router.put("/admin/gateways/:key", requireAdmin, async (req, res) => {
    try {
        const { key } = req.params;
        const { isActive, isTestMode, instructions, configData } = req.body;

        const updates = [];
        const params = [];

        if (isActive !== undefined) {
            updates.push("is_active = ?");
            params.push(isActive ? 1 : 0);
        }
        if (isTestMode !== undefined) {
            updates.push("is_test_mode = ?");
            params.push(isTestMode ? 1 : 0);
        }
        if (instructions !== undefined) {
            updates.push("instructions = ?");
            params.push(instructions);
        }
        if (configData !== undefined) {
            updates.push("config_data = ?");
            params.push(JSON.stringify(configData));
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: "No settings provided to update." });
        }

        params.push(key);
        await db.query(
            `UPDATE payment_gateways_config SET ${updates.join(", ")} WHERE gateway_key = ?`,
            params
        );

        res.json({ success: true, message: `Gateway '${key}' settings updated successfully.` });
    } catch (error) {
        console.error("Admin update gateway error:", error);
        res.status(500).json({ message: "Failed to update gateway settings." });
    }
});

module.exports = router;

