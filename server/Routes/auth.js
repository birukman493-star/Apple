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
    { id: user.id, role: user.role, email: user.email },
    secret,
    { expiresIn: "1d" }
  );
}

// ==========================================
// SIGNUP
// POST /api/auth/signup
// ==========================================
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if user already exists
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO users (first_name, last_name, email, password, role)
       VALUES (?, ?, ?, ?, 'user')`,
      [firstName.trim(), lastName.trim(), normalizedEmail, hashedPassword]
    );

    const newUser = {
      id: result.insertId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      role: "user",
    };

    const token = createToken(newUser);

    return res.status(201).json({
      message: "Account created successfully.",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Unable to create account." });
  }
});

// Admin middleware for protected user management routes
const verifyAdmin = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }
  const token = authorization.slice(7).trim();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const tokenEmail = typeof decoded.email === "string" ? decoded.email.trim().toLowerCase() : "";
    if (decoded.role === "admin" || (configuredAdminEmail && tokenEmail === configuredAdminEmail)) {
      req.user = decoded;
      return next();
    }
    return res.status(403).json({ message: "Admin access required." });
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ==========================================
// GET ALL USERS (Dynamic Admin Endpoint)
// GET /api/auth/users
// ==========================================
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY id DESC"
    );
    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users from database." });
  }
});

// ==========================================
// DELETE USER
// DELETE /api/auth/users/:id
// ==========================================
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

// ==========================================
// SIGNIN (Unified Admin & User Login)
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

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check configured admin account first (if set in .env)
    if (
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH &&
      normalizedEmail === process.env.ADMIN_EMAIL.trim().toLowerCase()
    ) {
      const passwordMatches = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
      );

      if (passwordMatches) {
        const admin = {
          id: "env-admin",
          firstName: "Admin",
          lastName: "",
          email: normalizedEmail,
          role: "admin",
        };

        const token = createToken(admin);
        return res.status(200).json({
          message: "Admin sign-in successful.",
          user: admin,
          token,
        });
      }
    }

    // 2. Otherwise, authenticate regular or admin users from MySQL database table
    const [users] = await db.execute(
      `SELECT id, first_name, last_name, email, password, role, phone, birthday, country, language, two_factor_enabled, shipping_address, billing_address
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
    const passwordMatches = await bcrypt.compare(password, account.password);

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
      phone: account.phone || "",
      birthday: account.birthday || "",
      country: account.country || "United States",
      language: account.language || "English (US)",
      twoFactorEnabled: account.two_factor_enabled !== 0,
      shippingAddress: account.shipping_address || "",
      billingAddress: account.billing_address || "",
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

// Middleware for user authentication
const verifyAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }
  const token = authorization.slice(7).trim();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ==========================================
// GET USER PROFILE
// GET /api/auth/profile
// ==========================================
router.get("/profile", verifyAuth, async (req, res) => {
  try {
    if (req.user.id === "env-admin") {
      return res.json({
        id: "env-admin",
        firstName: "Admin",
        lastName: "Apple",
        email: req.user.email,
        role: "admin",
        phone: "+1 (800) 692-7753",
        birthday: "1976-04-01",
        country: "United States",
        language: "English (US)",
        twoFactorEnabled: true,
        shippingAddress: "1 Apple Park Way, Cupertino, CA 95014",
        billingAddress: "1 Apple Park Way, Cupertino, CA 95014",
      });
    }

    const [users] = await db.execute(
      `SELECT id, first_name, last_name, email, role, phone, birthday, country, language, two_factor_enabled, shipping_address, billing_address, created_at
       FROM users WHERE id = ? LIMIT 1`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const u = users[0];
    res.json({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      role: u.role,
      phone: u.phone || "",
      birthday: u.birthday || "",
      country: u.country || "United States",
      language: u.language || "English (US)",
      twoFactorEnabled: u.two_factor_enabled !== 0,
      shippingAddress: u.shipping_address || "",
      billingAddress: u.billing_address || "",
      createdAt: u.created_at,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
});

// ==========================================
// UPDATE USER PROFILE
// PUT /api/auth/profile
// ==========================================
router.put("/profile", verifyAuth, async (req, res) => {
  try {
    if (req.user.id === "env-admin") {
      return res.json({ message: "Profile updated successfully.", user: req.user });
    }

    const {
      firstName,
      lastName,
      phone,
      birthday,
      country,
      language,
      shippingAddress,
      billingAddress,
      twoFactorEnabled,
    } = req.body;

    await db.execute(
      `UPDATE users
       SET first_name = COALESCE(?, first_name),
           last_name = COALESCE(?, last_name),
           phone = COALESCE(?, phone),
           birthday = COALESCE(?, birthday),
           country = COALESCE(?, country),
           language = COALESCE(?, language),
           shipping_address = COALESCE(?, shipping_address),
           billing_address = COALESCE(?, billing_address),
           two_factor_enabled = COALESCE(?, two_factor_enabled)
       WHERE id = ?`,
      [
        firstName?.trim() || null,
        lastName?.trim() || null,
        phone !== undefined ? phone : null,
        birthday !== undefined ? birthday : null,
        country || null,
        language || null,
        shippingAddress !== undefined ? shippingAddress : null,
        billingAddress !== undefined ? billingAddress : null,
        twoFactorEnabled !== undefined ? (twoFactorEnabled ? 1 : 0) : null,
        req.user.id,
      ]
    );

    const [users] = await db.execute(
      `SELECT id, first_name, last_name, email, role, phone, birthday, country, language, two_factor_enabled, shipping_address, billing_address
       FROM users WHERE id = ? LIMIT 1`,
      [req.user.id]
    );

    const u = users[0];
    const updatedUser = {
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      role: u.role,
      phone: u.phone || "",
      birthday: u.birthday || "",
      country: u.country || "United States",
      language: u.language || "English (US)",
      twoFactorEnabled: u.two_factor_enabled !== 0,
      shippingAddress: u.shipping_address || "",
      billingAddress: u.billing_address || "",
    };

    res.json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile." });
  }
});

// ==========================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// ==========================================
router.put("/change-password", verifyAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    if (req.user.id === "env-admin") {
      return res.status(400).json({ message: "Configured environment admin password cannot be changed here." });
    }

    const [users] = await db.execute(
      `SELECT id, password FROM users WHERE id = ? LIMIT 1`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const account = users[0];
    const passwordMatches = await bcrypt.compare(currentPassword, account.password);

    if (!passwordMatches) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, req.user.id]);

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to update password." });
  }
});

module.exports = router;