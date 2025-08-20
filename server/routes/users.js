import express from "express";
import { db } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { isMainThread } from "worker_threads";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../utils/logger.js";

dotenv.config();

const UsersRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Initialize S3 client for document downloads
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
  maxAttempts: 3,
  retryMode: "adaptive",
});

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: "Missing authorization token" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Admin authentication middleware
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const result = await db.query(
      "SELECT is_admin FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!result.rows[0].is_admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (err) {
    logger.error("Admin check failed", { userId: req.user?.id, error: err.message });
    return res.status(500).json({ error: "Server error during admin verification" });
  }
};

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

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    let isMatch = false;

    if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;

      if (isMatch && !user.disabled) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.query("UPDATE users SET password = $1 WHERE id = $2", [
          hashedPassword,
          user.id,
        ]);
      }
    }

    if (user.disabled) {
      return res.status(401).json({ message: "Account has been suspended" });
    }
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

// GET /api/users/:userId/documents - List user documents (admin only)
UsersRouter.get("/:userId/documents", authenticate, requireAdmin, async (req, res) => {
  const start = Date.now();
  const { userId } = req.params;
  
  try {
    // Validate userId parameter
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if the user exists
    const userResult = await db.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userIdNum]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch user documents
    const documentsResult = await db.query(
      `SELECT 
        id,
        document_type,
        s3_key,
        original_filename,
        file_size,
        upload_date
      FROM user_documents 
      WHERE user_id = $1 
      ORDER BY upload_date DESC`,
      [userIdNum]
    );

    const documents = documentsResult.rows.map(doc => ({
      id: doc.id,
      documentType: doc.document_type,
      originalFilename: doc.original_filename,
      fileSize: doc.file_size,
      uploadedAt: doc.upload_date,
      s3Key: doc.s3_key
    }));

    const durationMs = Date.now() - start;
    logger.info("User documents fetched", {
      adminUserId: req.user.id,
      targetUserId: userIdNum,
      documentCount: documents.length,
      durationMs,
      ip: req.ip
    });

    res.json({
      user: userResult.rows[0],
      documents,
      total: documents.length
    });

  } catch (err) {
    const durationMs = Date.now() - start;
    logger.error("Failed to fetch user documents", {
      adminUserId: req.user?.id,
      targetUserId: userId,
      error: err.message,
      durationMs,
      ip: req.ip
    });
    console.error("Error fetching user documents:", err);
    res.status(500).json({ error: "Failed to fetch user documents" });
  }
});

// GET /api/users/:userId/documents/:documentId/download - Download user document (admin only)
UsersRouter.get("/:userId/documents/:documentId/download", authenticate, requireAdmin, async (req, res) => {
  const start = Date.now();
  const { userId, documentId } = req.params;
  
  try {
    // Validate parameters
    const userIdNum = parseInt(userId);
    const documentIdNum = parseInt(documentId);
    
    if (isNaN(userIdNum) || isNaN(documentIdNum)) {
      return res.status(400).json({ error: "Invalid user ID or document ID" });
    }

    // Fetch document information with user validation
    const documentResult = await db.query(
      `SELECT 
        ud.id,
        ud.s3_key,
        ud.original_filename,
        ud.document_type,
        u.name as user_name,
        u.email as user_email
      FROM user_documents ud
      JOIN users u ON ud.user_id = u.id
      WHERE ud.id = $1 AND ud.user_id = $2`,
      [documentIdNum, userIdNum]
    );

    if (documentResult.rows.length === 0) {
      return res.status(404).json({ error: "Document not found for this user" });
    }

    const document = documentResult.rows[0];

    // Generate signed URL for S3 download
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: document.s3_key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600 // 1 hour
    });

    const durationMs = Date.now() - start;
    logger.info("Document download initiated", {
      adminUserId: req.user.id,
      targetUserId: userIdNum,
      documentId: documentIdNum,
      documentType: document.document_type,
      fileName: document.original_filename,
      userEmail: document.user_email,
      durationMs,
      ip: req.ip
    });

    res.json({
      downloadUrl: signedUrl,
      document: {
        id: document.id,
        originalFilename: document.original_filename,
        documentType: document.document_type
      },
      user: {
        name: document.user_name,
        email: document.user_email
      },
      expiresIn: 3600 // seconds
    });

  } catch (err) {
    const durationMs = Date.now() - start;
    logger.error("Document download failed", {
      adminUserId: req.user?.id,
      targetUserId: userId,
      documentId: documentId,
      error: err.message,
      code: err.code || err.Code,
      durationMs,
      ip: req.ip
    });
    console.error("Error generating download URL:", err);
    res.status(500).json({ 
      error: "Failed to generate download URL",
      message: err.message 
    });
  }
});

UsersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT id, name, email, license_number, phone_number, company, california_resale, is_admin, disabled FROM users WHERE id = $1",
      [id]
    );
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
