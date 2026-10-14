
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        if (
            !process.env.ADMIN_EMAIL ||
            !process.env.ADMIN_PASSWORD_HASH ||
            !process.env.JWT_SECRET
        ) {
            return res.status(500).json({
                message: "Admin authentication is not configured."
            });
        }

        const emailMatches =
            email.trim().toLowerCase() ===
            process.env.ADMIN_EMAIL.trim().toLowerCase();

        const passwordMatches = await bcrypt.compare(
            password,
            process.env.ADMIN_PASSWORD_HASH
        );

        if (!emailMatches || !passwordMatches) {
            return res.status(401).json({
                message: "Invalid admin email or password."
            });
        }

        const token = jwt.sign(
            {
                email: process.env.ADMIN_EMAIL,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                expiresIn: "1h"
            }
        );

        return res.json({
            message: "Admin login successful.",
            token,
            user: {
                email: process.env.ADMIN_EMAIL,
                role: "admin"
            }
        });
    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            message: "Admin login failed."
        });
    }
});

module.exports = router;
