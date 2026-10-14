
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

function createToken(user) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing from server/.env");
  }

  return jwt.sign(
    { id: user.id, role: user.role },
    secret,
    { expiresIn: "1d" }
  );
}

// ==========================================
// SIGNUP
// POST /api/auth/signup
// ==========================================


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
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check the configured admin account first.
    if (
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH &&
      normalizedEmail === process.env.ADMIN_EMAIL.trim().toLowerCase()
    ) {
      const passwordMatches = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
      );

      if (!passwordMatches) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      const admin = {
        id: "env-admin",
        firstName: "Admin",
        lastName: "",
        email: normalizedEmail,
        role: "admin",
      };

      const token = createToken(admin);

      // Supports existing middleware that checks adminToken cookies.
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
        path: "/",
      });

      return res.status(200).json({
        message: "Admin sign-in successful.",
        user: admin,
        token,
      });
    }

    // 2. Otherwise, authenticate a regular user from MySQL.
    const [users] = await db.execute(
      `SELECT id, first_name, last_name, email, password, role
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const account = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      account.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = {
      id: account.id,
      firstName: account.first_name,
      lastName: account.last_name,
      email: account.email,
      role: account.role,
    };

    const token = createToken(user);

    return res.status(200).json({
      message: "Signed in successfully.",
      user,
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);

    return res.status(500).json({
      message: "Unable to sign in. Please try again.",
    });
  }
});


// ==========================================
// SIGNIN
// POST /api/auth/signin
// ==========================================

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
        message: "Email and password are required.",
      });
    }

    const [users] = await db.execute(
      `SELECT id, first_name, last_name, email, password, role
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const account = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      account.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = {
      id: account.id,
      firstName: account.first_name,
      lastName: account.last_name,
      email: account.email,
      role: account.role,
    };

    const token = createToken(user);

    return res.status(200).json({
      message: "Signed in successfully.",
      user,
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);

    return res.status(500).json({
      message: "Unable to sign in. Please try again.",
    });
  }
});

module.exports = router;
