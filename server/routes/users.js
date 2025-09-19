import express from "express";
import { db } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../utils/logger.js";
import { sendSignupRequestEmail, sendSignupApprovalEmail, sendSignupRejectionEmail, sendForgotPasswordEmail } from "../utils/emailService.js";
import { API_CONFIG } from "../../client/src/constants/index.js";

dotenv.config();

const UsersRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Initialize S3 client for document downloads
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
      "SELECT is_admin FROM users WHERE email = $1",
      [req.user.email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!result.rows[0].is_admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (err) {
    logger.error("Admin check failed", {
      userEmail: req.user?.email,
      error: err.message,
    });
    return res
      .status(500)
      .json({ error: "Server error during admin verification" });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail", // or another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
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
UsersRouter.get(
  "/signup-requests",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await db.query(
        "SELECT * FROM signup_requests ORDER BY timestamp DESC"
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

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

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.disabled) {
      return res.status(403).json({ message: "Your signup request is still pending" });
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
    californiaResale,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !companyName ||
    !email ||
    !password ||
    !licenseNumber
  ) {
    return res.status(400).json({
      message:
        "Required fields: firstName, lastName, companyName, email, password, licenseNumber",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user account immediately but disabled (pending approval)
    const userResult = await db.query(
      `INSERT INTO users (
        name, email, password, license_number, phone_number, company, 
        california_resale, disabled, is_admin
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id, name, email, company`,
      [
        `${firstName} ${lastName}`,
        email,
        hashedPassword,
        licenseNumber,
        phone,
        companyName,
        californiaResale,
        true,
        false,
      ]
    );

    const userId = userResult.rows[0].id;

    // Create address entry for the user
    if (companyAddress1 && city && state && zipCode) {
      await db.query(
        `INSERT INTO addresses (user_id, address_type, address_line_1, address_line_2, city, state, zip_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          userId,
          'company',
          companyAddress1,
          companyAddress2 || null,
          city,
          state,
          zipCode,
        ]
      );
      console.log("Created address for user ID:", userId);
    }

    // Also create entry in signup_requests for admin dashboard
    const signupResult = await db.query(
      `INSERT INTO signup_requests (
        first_name, last_name, email, password, license_number, company, 
        company_address_1, company_address_2, zip_code, city, state, phone, 
        california_resale, timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
      RETURNING id, first_name, last_name, email, company`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        licenseNumber,
        companyName,
        companyAddress1,
        companyAddress2,
        zipCode,
        city,
        state,
        phone,
        californiaResale,
        new Date(),
      ]
    );

    // Send signup notification email to sales
    await sendSignupRequestEmail({
      firstName,
      lastName,
      email,
      companyName,
      licenseNumber,
      companyAddress1,
      companyAddress2,
      zipCode,
      city,
      state,
      phone,
      californiaResale,
    });

    res.status(201).json({
      message:
        "Account created successfully. Please wait for admin approval before you can login.",
      user: userResult.rows[0],
      request: signupResult.rows[0],
      signupRequestId: signupResult.rows[0].id, // For backward compatibility
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
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  try {
    // Check if user exists first
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.json({ message: "If that email is registered, you'll receive a reset link shortly." });
    }

    const user = userResult.rows[0];

    // Store reset token in database
    await db.query(`DELETE FROM password_resets WHERE email = $1`, [email]);
    await db.query(
      `INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)`,
      [email, token, expiresAt]
    );

    // IMPORTANT: Pass the req object here
    const emailResult = await sendForgotPasswordEmail(user, token, req);
    
    if (emailResult.success) {
      res.json({ message: "Password reset email sent! Check your inbox for instructions." });
    } else {
      res.status(500).json({ message: "Failed to send reset email. Please try again." });
    }

  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
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

// POST /api/users/:id/approve - approve user signup (enable account)
UsersRouter.post(
  "/:id/approve",
  authenticate,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      // First get the signup request to find the user email
      const signupResult = await db.query(
        "SELECT email FROM signup_requests WHERE id = $1",
        [id]
      );

      if (signupResult.rows.length === 0) {
        return res.status(404).json({ message: "Signup request not found" });
      }

      const userEmail = signupResult.rows[0].email;

      // Enable the user account
      const userResult = await db.query(
        `UPDATE users 
       SET disabled = false 
       WHERE email = $1 AND disabled = true
       RETURNING id, name, email, company`,
        [userEmail]
      );

      if (userResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found or already approved" });
      }

      // Remove from signup_requests table
      await db.query("DELETE FROM signup_requests WHERE id = $1", [id]);

      const user = userResult.rows[0];

      res.json({
        success: true,
        message: "User approved successfully",
        user,
      });
    } catch (err) {
      console.error("Approval error:", err);
      res.status(500).json({ message: "Server error during approval" });
    }
  }
);

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
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/:userEmail/documents - List user documents (admin only)
UsersRouter.get(
  "/:userEmail/documents",
  authenticate,
  requireAdmin,
  async (req, res) => {
    const start = Date.now();
    const { userEmail } = req.params;

    try {
      // Decode the email parameter (in case it's URL encoded)
      const decodedEmail = decodeURIComponent(userEmail);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(decodedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Check if the user exists
      const userResult = await db.query(
        "SELECT id, name, email FROM users WHERE email = $1",
        [decodedEmail]
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
      WHERE user_email = $1 
      ORDER BY upload_date DESC`,
        [decodedEmail]
      );

      const documents = documentsResult.rows.map((doc) => ({
        id: doc.id,
        documentType: doc.document_type,
        originalFilename: doc.original_filename,
        fileSize: doc.file_size,
        uploadedAt: doc.upload_date,
        s3Key: doc.s3_key,
      }));

      const durationMs = Date.now() - start;
      logger.info("User documents fetched", {
        adminUserEmail: req.user.email,
        targetUserEmail: decodedEmail,
        documentCount: documents.length,
        durationMs,
        ip: req.ip,
      });

      res.json({
        user: userResult.rows[0],
        documents,
        total: documents.length,
      });
    } catch (err) {
      const durationMs = Date.now() - start;
      logger.error("Failed to fetch user documents", {
        adminUserEmail: req.user?.email,
        targetUserEmail: userEmail,
        error: err.message,
        durationMs,
        ip: req.ip,
      });
      console.error("Error fetching user documents:", err);
      res.status(500).json({ error: "Failed to fetch user documents" });
    }
  }
);

// GET /api/users/:userEmail/documents/:documentId/download - Download user document (admin only)
UsersRouter.get(
  "/:userEmail/documents/:documentId/download",
  authenticate,
  requireAdmin,
  async (req, res) => {
    const start = Date.now();
    const { userEmail, documentId } = req.params;

    try {
      // Validate parameters
      const decodedEmail = decodeURIComponent(userEmail);
      const documentIdNum = parseInt(documentId);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(decodedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      if (isNaN(documentIdNum)) {
        return res.status(400).json({ error: "Invalid document ID" });
      }

      // Check if the user exists
      const userResult = await db.query(
        "SELECT email FROM users WHERE email = $1",
        [decodedEmail]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
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
      JOIN users u ON ud.user_email = u.email
      WHERE ud.id = $1 AND ud.user_email = $2`,
        [documentIdNum, decodedEmail]
      );

      if (documentResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Document not found for this user" });
      }

      const document = documentResult.rows[0];

      // Generate signed URL for S3 download
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: document.s3_key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      const durationMs = Date.now() - start;
      logger.info("Document download initiated", {
        adminUserEmail: req.user.email,
        targetUserEmail: decodedEmail,
        documentId: documentIdNum,
        documentType: document.document_type,
        fileName: document.original_filename,
        userEmail: document.user_email,
        durationMs,
        ip: req.ip,
      });

      res.json({
        downloadUrl: signedUrl,
        document: {
          id: document.id,
          originalFilename: document.original_filename,
          documentType: document.document_type,
        },
        user: {
          name: document.user_name,
          email: document.user_email,
        },
        expiresIn: 3600, // seconds
      });
    } catch (err) {
      const durationMs = Date.now() - start;
      logger.error("Document download failed", {
        adminUserEmail: req.user?.email,
        targetUserEmail: userEmail,
        documentId: documentId,
        error: err.message,
        code: err.code || err.Code,
        durationMs,
        ip: req.ip,
      });
      console.error("Error generating download URL:", err);
      res.status(500).json({
        error: "Failed to generate download URL",
        message: err.message,
      });
    }
  }
);

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

    // Get the signup request
    const requestResult = await db.query(
      "SELECT * FROM signup_requests WHERE id = $1",
      [request_id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ error: "Signup request not found" });
    }

    const request = requestResult.rows[0];
    console.log("Processing approval for:", request.email);

    // Find the DISABLED user account
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1 AND disabled = true",
      [request.email]
    );

    if (existingUser.rows.length === 0) {
      return res.status(400).json({ 
        error: "No disabled user account found for this email" 
      });
    }

    const userId = existingUser.rows[0].id;
    console.log("Found disabled user with ID:", userId);

    // ENABLE the user account
    const userResult = await db.query(
      `UPDATE users 
       SET disabled = false 
       WHERE id = $1 
       RETURNING id, name, email, license_number, phone_number, is_admin, company`,
      [userId]
    );

    console.log("Enabled user account:", userResult.rows[0]);

    // Send approval email
    await sendSignupApprovalEmail(request);

    // Delete the signup request
    await db.query("DELETE FROM signup_requests WHERE id = $1", [request_id]);

    res.json({
      success: true,
      message: "User account approved and enabled successfully",
      user: userResult.rows[0],
    });

  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ 
      error: "Internal server error", 
      message: err.message 
    });
  }
});

// PUT /api/users/reject-signup/:request_id - reject signup request
UsersRouter.put("/reject-signup/:request_id", async (req, res) => {
  try {
    const request_id = parseInt(req.params.request_id);
    const { reason } = req.body; 

    if (isNaN(request_id)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const existingRequest = await db.query(
      "SELECT * FROM signup_requests WHERE id = $1",
      [request_id]
    );

    if (existingRequest.rows.length === 0) {
      return res.status(404).json({ error: "Signup request not found" });
    }

    const request = existingRequest.rows[0];

    const result = await db.query(
      "UPDATE signup_requests SET show = FALSE WHERE id = $1 RETURNING *",
      [request_id]
    );

    // Send rejection email
    try {
      await sendSignupRejectionEmail(request, reason);
      console.log(`Rejection email sent to ${request.email}`);
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
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

// PUT /api/users/signup-requests/revert/:request_id - revert rejection of signup request
UsersRouter.put("/signup-requests/revert/:request_id", async (req, res) => {
  try {
    const request_id = parseInt(req.params.request_id);

    if (isNaN(request_id)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    // First, check if the request exists
    const existingRequest = await db.query(
      "SELECT * FROM signup_requests WHERE id = $1",
      [request_id]
    );

    if (existingRequest.rows.length === 0) {
      return res.status(404).json({ error: "Signup request not found" });
    }

    // If found, update the request
    const result = await db.query(
      "UPDATE signup_requests SET show = TRUE WHERE id = $1 RETURNING *",
      [request_id]
    );

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
