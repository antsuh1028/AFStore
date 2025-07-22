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

// GET /api/users/signup-requests — fetch all signup requests
UsersRouter.get("/signup-requests", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM signup_requests ORDER BY timestamp DESC"
    );
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
  const { 
    firstName, 
    lastName, 
    companyName, 
    email, 
    password, 
    licenseNumber,
    companyAddress1,
    companyAddress2,
    zipCode,
    city,
    state,
    phone,
    californiaResale
  } = req.body;
  // console.log(req.body)

  if (!firstName || !lastName || !companyName || !email || !password || !licenseNumber) {
    return res.status(400).json({
      message: "Required fields: firstName, lastName, companyName, email, password, licenseNumber",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await db.query(
      `INSERT INTO signup_requests (
        first_name, last_name, email, password, license_number, company, 
        company_address_1, company_address_2, zip_code, city, state, phone, 
        california_resale, timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
      RETURNING id, first_name, last_name, email, company`,
      [
        firstName, lastName, email, hashedPassword, licenseNumber, companyName,
        companyAddress1, companyAddress2, zipCode, city, state, phone,
        californiaResale, new Date()
      ]
    );

    res.status(201).json({
      message: "Signup request submitted successfully. Please wait for admin approval.",
      request: result.rows[0],
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
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

// PUT /api/users/:id - update user information
UsersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_number } = req.body;

  try {
    const result = await db.query(
      `UPDATE users 
       SET name = $1, email = $2, phone_number = $3 
       WHERE id = $4 
       RETURNING id, name, email, phone_number, license_number, company, california_resale, is_admin`,
      [name, email, phone_number, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      success: true, 
      message: "User updated successfully",
      user: result.rows[0] 
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

UsersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT id, name, email, license_number, phone_number, company, california_resale, is_admin FROM users WHERE id = $1",
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

// POST /api/users/approve-signup/:request_id - approve signup and create user
UsersRouter.post("/approve-signup/:request_id", async (req, res) => {
 try {
   const request_id = parseInt(req.params.request_id);

   if (isNaN(request_id)) {
     return res.status(400).json({ error: "Invalid request ID" });
   }

   const requestResult = await db.query(
     "SELECT * FROM signup_requests WHERE id = $1",
     [request_id]
   );

   if (requestResult.rows.length === 0) {
     return res.status(404).json({ error: "Signup request not found" });
   }

   const request = requestResult.rows[0];

   const existingUser = await db.query(
     "SELECT * FROM users WHERE email = $1",
     [request.email]
   );

   if (existingUser.rows.length > 0) {
     return res.status(400).json({ error: "Email already exists in users" });
   }

   // Create user
   const userResult = await db.query(
     `INSERT INTO users (name, email, password, license_number, phone_number, is_admin, company) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, license_number, phone_number, is_admin, company`,
     [
       `${request.first_name} ${request.last_name}`,
       request.email,
       request.password,
       request.license_number,
       request.phone,
       false,
       request.company,
     ]
   );
   const userId = userResult.rows[0].id;

   // Create address entry
   await db.query(
     `INSERT INTO addresses (user_id, address_type, address_line_1, address_line_2, city, state, zip_code) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
     [
       userId,
       'company',
       request.company_address_1,
       request.company_address_2,
       request.city,
       request.state,
       request.zip_code
     ]
   );

   await db.query("DELETE FROM signup_requests WHERE id = $1", [request_id]);

   res.json({
     success: true,
     message: "User approved and created successfully",
     user: userResult.rows[0],
   });
 } catch (err) {
   console.error("Database error:", err);
   res.status(500).json({ error: "Internal server error", message: err.message });
 }
});

// DELETE /api/users/signup-requests/:request_id - reject signup request
UsersRouter.delete("/signup-requests/:request_id", async (req, res) => {
  try {
    const request_id = parseInt(req.params.request_id);

    if (isNaN(request_id)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const result = await db.query(
      "DELETE FROM signup_requests WHERE id = $1 RETURNING *",
      [request_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Signup request not found" });
    }

    res.json({
      success: true,
      message: "Signup request rejected successfully",
      deletedRequest: result.rows[0],
    });
  } catch (err) {
    console.error("Error rejecting signup request:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

export { UsersRouter };
