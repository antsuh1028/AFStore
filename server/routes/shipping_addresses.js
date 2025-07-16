import express from "express";
import { db } from "../db/index.js";

const AddressRouter = express.Router();

// Get all addresses
AddressRouter.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM addresses ORDER BY id ASC"
    );
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Get address by id
AddressRouter.get("/id/:id", async (req, res) => {
  try {
    const addrId = req.params.id;
    if (isNaN(addrId)) {
      return res.status(400).json({ error: "Invalid address ID. Must be a number." });
    }

    const result = await db.query("SELECT * FROM addresses WHERE id = $1", [addrId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

// Get addresses by user_id
AddressRouter.get("/user/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    const result = await db.query(
      "SELECT * FROM addresses WHERE user_id = $1 ORDER BY id ASC",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No addresses found for that user" });
    }

    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

// Add address
AddressRouter.post("/", async (req, res) => {
  try {
    const {
      user_id,
      address_type = 'company',
      address_line_1,
      address_line_2 = null,
      city,
      state,
      zip_code,
    } = req.body;

    if (!user_id || !address_line_1 || !city || !state || !zip_code) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["user_id", "address_line_1", "city", "state", "zip_code"],
      });
    }

    const result = await db.query(
      `INSERT INTO addresses (user_id, address_type, address_line_1, address_line_2, city, state, zip_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, address_type, address_line_1, address_line_2, city, state, zip_code]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Address created successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

// Update address
AddressRouter.put("/:id", async (req, res) => {
  try {
    const addrId = req.params.id;
    if (isNaN(addrId)) {
      return res.status(400).json({ error: "Invalid address ID. Must be a number." });
    }

    const {
      user_id,
      address_type,
      address_line_1,
      address_line_2,
      city,
      state,
      zip_code,
    } = req.body;

    if (!user_id || !address_line_1 || !city || !state || !zip_code) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["user_id", "address_line_1", "city", "state", "zip_code"],
      });
    }

    const result = await db.query(
      `UPDATE addresses SET user_id = $1, address_type = $2, address_line_1 = $3, 
       address_line_2 = $4, city = $5, state = $6, zip_code = $7
       WHERE id = $8 RETURNING *`,
      [user_id, address_type, address_line_1, address_line_2, city, state, zip_code, addrId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Address updated successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

// Delete address
AddressRouter.delete("/:id", async (req, res) => {
  try {
    const addrId = req.params.id;
    if (isNaN(addrId)) {
      return res.status(400).json({ error: "Invalid address ID. Must be a number." });
    }

    const result = await db.query("DELETE FROM addresses WHERE id = $1 RETURNING *", [addrId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Address deleted successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

export { AddressRouter };