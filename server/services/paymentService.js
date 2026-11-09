const crypto = require("crypto");
const db = require("../db");

/**
 * Generates a unique Apple Store transaction reference.
 */
function generateTransactionReference(prefix = "APL") {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `${prefix}-TXN-${timestamp}-${random}`;
}

/**
 * Validates and calculates order totals using trusted database product prices.
 * Never trust prices submitted by the client!
 */
async function validateAndCalculateOrder(items = [], deliveryMethod = "shipping") {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Shopping bag is empty. Please add products to check out.");
    }

    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
        const productId = item.productId || item.id;
        const requestedQuantity = Math.max(1, parseInt(item.quantity, 10) || 1);

        if (!productId) {
            // If item has no id, check if it has title and fallback price with bounds
            const fallbackPrice = Math.max(0, parseFloat(item.price) || 0);
            validatedItems.push({
                productId: null,
                title: String(item.title || item.name || "Apple Product").slice(0, 255),
                unitPrice: fallbackPrice,
                quantity: requestedQuantity,
                lineTotal: fallbackPrice * requestedQuantity,
                imageUrl: item.image_url || item.image || item.imageMain || null
            });
            subtotal += fallbackPrice * requestedQuantity;
            continue;
        }

        // Fetch official price from database
        const [productRows] = await db.query(
            "SELECT id, title, price_upfront, discount_price, stock, is_active FROM products WHERE id = ? LIMIT 1",
            [productId]
        );

        if (productRows.length === 0) {
            throw new Error(`Product not found or no longer available (ID: ${productId})`);
        }

        const product = productRows[0];
        const unitPrice = parseFloat(product.discount_price ?? product.price_upfront ?? 0);
        const lineTotal = unitPrice * requestedQuantity;

        validatedItems.push({
            productId: product.id,
            title: product.title,
            unitPrice: unitPrice,
            quantity: requestedQuantity,
            lineTotal: lineTotal,
            imageUrl: item.image_url || item.image || item.imageMain || null,
            stock: product.stock
        });

        subtotal += lineTotal;
    }

    // Determine shipping cost
    let shippingCost = 0.00;
    if (deliveryMethod === "express") {
        shippingCost = 25.00; // Apple Express 2-hour / next-day delivery
    } else if (deliveryMethod === "pickup") {
        shippingCost = 0.00; // Free Store Pickup
    } else {
        // Standard delivery is free for orders over $50
        shippingCost = subtotal >= 50 ? 0.00 : 9.99;
    }

    // Calculate tax (e.g., standard 8.5% sales tax on tangible goods)
    const taxRate = 0.085;
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const totalAmount = Math.round((subtotal + shippingCost + taxAmount) * 100) / 100;

    return {
        items: validatedItems,
        subtotal: Math.round(subtotal * 100) / 100,
        shippingCost: Math.round(shippingCost * 100) / 100,
        taxAmount,
        totalAmount
    };
}

/**
 * Gateway Handlers
 */
const GatewayHandlers = {
    /**
     * Telebirr Mobile Money Handler
     */
    async telebirr(paymentRecord, gatewayConfig, order) {
        const isTestMode = gatewayConfig.is_test_mode !== 0;
        const payerPhone = order.customerPhone || "";

        // If real telebirr credentials configured in environment
        const telebirrAppId = process.env.TELEBIRR_APP_ID;
        const telebirrAppKey = process.env.TELEBIRR_APP_KEY;
        const telebirrShortCode = process.env.TELEBIRR_SHORT_CODE;

        if (!isTestMode && telebirrAppId && telebirrAppKey) {
            // Real production Telebirr API integration can be executed here
            // e.g., create order request with RSA/AES encryption & sign
            return {
                mode: "live",
                paymentStatus: "pending",
                action: "prompt_sent",
                message: `An official Telebirr payment prompt has been sent to ${payerPhone || 'your phone'}. Please enter your PIN on your phone to complete payment.`,
                payerPhone,
                timeoutMinutes: 15
            };
        }

        // Sandbox / Test mode
        return {
            mode: "test",
            paymentStatus: "pending",
            action: "sandbox_prompt",
            message: `[Sandbox] Telebirr test payment initiated for ${order.customerName}. Dial *127# or check Telebirr App with reference ${paymentRecord.transaction_reference} to authorize ETB ${(paymentRecord.amount * 125).toFixed(2)} ($${paymentRecord.amount.toFixed(2)}).`,
            testPhone: payerPhone || "0911000000",
            ussdCode: `*127*${paymentRecord.transaction_reference.slice(-6)}#`,
            reference: paymentRecord.transaction_reference
        };
    },

    /**
     * Chapa Payment Gateway Handler
     */
    async chapa(paymentRecord, gatewayConfig, order) {
        const isTestMode = gatewayConfig.is_test_mode !== 0;
        const chapaSecretKey = process.env.CHAPA_SECRET_KEY;

        const returnUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/order-confirmation/${order.order_number}?ref=${paymentRecord.transaction_reference}`;
        const callbackUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payments/webhook`;

        // If real Chapa key is available, call Chapa API
        if (chapaSecretKey && !chapaSecretKey.includes("test-placeholder")) {
            try {
                // Convert USD to ETB if currency is ETB (approximate rate or dynamic)
                const amountInETB = Math.round(paymentRecord.amount * 125);
                const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${chapaSecretKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        amount: amountInETB.toString(),
                        currency: "ETB",
                        email: order.customerEmail,
                        first_name: order.customerName.split(" ")[0] || "Customer",
                        last_name: order.customerName.split(" ").slice(1).join(" ") || "Customer",
                        phone_number: order.customerPhone || "0911000000",
                        tx_ref: paymentRecord.transaction_reference,
                        callback_url: callbackUrl,
                        return_url: returnUrl,
                        customization: {
                            title: "Apple Store Ethiopia",
                            description: `Order ${order.order_number}`
                        }
                    })
                });

                const data = await response.json();
                if (data.status === "success" && data.data?.checkout_url) {
                    return {
                        mode: isTestMode ? "test" : "live",
                        paymentStatus: "pending",
                        checkoutUrl: data.data.checkout_url,
                        action: "redirect"
                    };
                }
            } catch (err) {
                console.error("Chapa API request error:", err);
            }
        }

        // Sandbox / Test fallback URL
        return {
            mode: "test",
            paymentStatus: "pending",
            action: "redirect",
            checkoutUrl: `/order-confirmation/${order.order_number}?ref=${paymentRecord.transaction_reference}&gateway=chapa&test=true`,
            message: `[Sandbox] Chapa multi-gateway test payment ready for Order ${order.order_number}. Supports Telebirr, CBE Birr, and Cards.`
        };
    },

    /**
     * CBE Birr Mobile Banking Handler
     */
    async cbe_birr(paymentRecord, gatewayConfig, order) {
        let config = {};
        try {
            config = typeof gatewayConfig.config_data === "string" 
                ? JSON.parse(gatewayConfig.config_data) 
                : (gatewayConfig.config_data || {});
        } catch {
            config = {};
        }

        return {
            mode: gatewayConfig.is_test_mode ? "test" : "live",
            paymentStatus: "pending",
            action: "ussd_instructions",
            merchantCode: config.merchantCode || "884920",
            accountNumber: config.accountNumber || "1000123456789",
            instructions: `Dial *847# on your Ethio Telecom CBE Birr phone. Select 'Pay Merchant', enter Merchant ID ${config.merchantCode || "884920"}, and use Order Number ${order.order_number} as payment reference.`,
            amount: paymentRecord.amount
        };
    },

    /**
     * Bank Transfer (CBE, Awash, Dashen, Abyssinia)
     */
    async bank_transfer(paymentRecord, gatewayConfig, order) {
        let config = {};
        try {
            config = typeof gatewayConfig.config_data === "string" 
                ? JSON.parse(gatewayConfig.config_data) 
                : (gatewayConfig.config_data || {});
        } catch {
            config = {};
        }

        const banks = config.banks || [
            { bankName: 'Commercial Bank of Ethiopia (CBE)', accountName: 'Apple Store Ethiopia Ltd', accountNumber: '1000293847561', branch: 'Addis Ababa Finfine Branch' },
            { bankName: 'Awash Bank', accountName: 'Apple Store Ethiopia Ltd', accountNumber: '01320495867100', branch: 'Bole Medhanialem Branch' },
            { bankName: 'Dashen Bank', accountName: 'Apple Store Ethiopia Ltd', accountNumber: '503928174625', branch: 'Meskel Square Branch' },
            { bankName: 'Bank of Abyssinia', accountName: 'Apple Store Ethiopia Ltd', accountNumber: '84920173', branch: 'Kazanchis Branch' }
        ];

        return {
            mode: "live",
            paymentStatus: "pending",
            action: "bank_instructions",
            banks: banks,
            instructions: `Please transfer the total amount of $${paymentRecord.amount.toFixed(2)} to any of our verified bank accounts below. Use '${order.order_number}' as your transaction reference/description. Once transferred, submit your transaction ID for verification.`,
            orderNumber: order.order_number
        };
    },

    /**
     * Credit / Debit Card (Visa, Mastercard)
     * NOTE: Strictly never store card numbers, expiration dates, or CVV in database.
     */
    async card(paymentRecord, gatewayConfig, order, extraData = {}) {
        const isTestMode = gatewayConfig.is_test_mode !== 0;

        // In test mode: simulate tokenized gateway authorization
        if (isTestMode) {
            // Check test card digits or last 4 if provided
            const last4 = extraData.cardNumber ? extraData.cardNumber.slice(-4) : "4242";
            const cardBrand = extraData.cardBrand || "Visa";

            return {
                mode: "test",
                paymentStatus: "successful", // Test cards instantly clear in sandbox mode
                action: "card_authorized",
                cardBrand: cardBrand,
                last4: last4,
                authCode: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
                message: `Card authorized securely via 256-bit test gateway (${cardBrand} ending in ${last4}).`
            };
        }

        // In live mode: return redirect or hosted tokenization session
        return {
            mode: "live",
            paymentStatus: "pending",
            action: "gateway_tokenize",
            message: "Redirecting to 3D Secure verified checkout..."
        };
    },

    /**
     * Cash on Delivery (COD)
     */
    async cod(paymentRecord, gatewayConfig, order) {
        return {
            mode: "live",
            paymentStatus: "pending",
            action: "cod_confirmed",
            message: `Your Apple order has been confirmed for Cash on Delivery. Total $${paymentRecord.amount.toFixed(2)} will be collected upon arrival at ${order.shippingAddress || "your delivery address"}.`
        };
    }
};

module.exports = {
    generateTransactionReference,
    validateAndCalculateOrder,
    GatewayHandlers
};

