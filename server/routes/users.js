import express from "express";
import { db } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { isMainThread } from "worker_threads";

dotenv.config();

const UsersRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

const transporter = nodemailer.createTransport({
  service: "gmail", // or another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET /api/users — fetch all users (testing)
UsersRouter.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users;");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/login — login and return JWT
UsersRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log("Incoming login:", { email, password });

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      // console.log("No user found with email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    // console.log("User found:", user);

    let isMatch = false;

    if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;

      if (isMatch) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.query("UPDATE users SET password = $1 WHERE id = $2", [
          hashedPassword,
          user.id,
        ]);
        // console.log("Password updated to hashed version for user:", user.email);
      }
    }

    // console.log("Password match?", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

UsersRouter.post("/signup", async (req, res) => {
  const { name, email, password, license_number } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const licenseRegex = /^C-\d{7}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (license_number && !licenseRegex.test(license_number)) {
    return res
      .status(400)
      .json({ message: "License number must match C-1234567 format" });
  }

  try {
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO users (name, email, password, license_number)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email`,
      [name, email, hashedPassword, license_number || null]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/forgot-password
UsersRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

  try {
    await db.query(`DELETE FROM password_resets WHERE email = $1`, [email]);
    await db.query(
      `INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)`,
      [email, token, expiresAt]
    );

    const resetLink = `http://localhost:5173/reset-password?token=${token}&email=${encodeURIComponent(
      email
    )}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click here to reset your password: ${resetLink}`,
    });

    res.json({ message: "Reset link sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/reset-password
UsersRouter.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const result = await db.query(
      `SELECT * FROM password_resets WHERE email = $1 AND token = $2`,
      [email, token]
    );

    if (
      result.rows.length === 0 ||
      new Date(result.rows[0].expires_at) < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.query(`UPDATE users SET password = $1 WHERE email = $2`, [
      hashedPassword,
      email,
    ]);
    await db.query(`DELETE FROM password_resets WHERE email = $1`, [email]);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

UsersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT id, name, email, license_number, phone_number, is_admin FROM users WHERE id = $1",
      [id]
    );
    // console.log("Query result:", result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export { UsersRouter };
