import express from 'express';
import {db} from '../db/index.js';


const ShippingAddrsRouter = express.Router();

// Get all shipping addresses
ShippingAddrsRouter.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM shipping_addresses ORDER BY id ASC"
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

// Get a specific shipping address by id
ShippingAddrsRouter.get("/id/:id", async (req, res) => {
  try {
    const addrId = req.params.id;
    if (isNaN(addrId)) {
      return res.status(400).json({ error: "Invalid address ID. Must be a number." });
    }

    const result = await db.query(
      "SELECT * FROM shipping_addresses WHERE id = $1",
      [addrId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Get a specific shipping address by user_id
ShippingAddrsRouter.get("/user/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    const result = await db.query(
      "SELECT * FROM shipping_addresses WHERE user_id = $1 ORDER BY id ASC",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No addresses found for that user" });
    }

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

// Add a shipping address
ShippingAddrsRouter.post("/", async (req, res) => {
  try {
    const {
      user_id,
      address_line1,
      address_line2 = null,
      city,
      state,
      postal_code,
      country,
      is_default = false,
      address_type = null,
    } = req.body;

    // required fields
    if (!user_id || !address_line1 || !city || !state || !postal_code || !country) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "user_id",
          "address_line1",
          "city",
          "state",
          "postal_code",
          "country",
        ],
      });
    }

    const result = await db.query(
      `INSERT INTO shipping_addresses
        (user_id, address_line1, address_line2, city, state, postal_code, country, is_default, address_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        user_id,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_default,
        address_type,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Address created successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Change a shipping address
ShippingAddrsRouter.put("/:id", async (req, res) => {
  try {
    const addrId = req.params.id;
    if (isNaN(addrId)) {
      return res.status(400).json({ error: "Invalid address ID. Must be a number." });
    }

    const {
      user_id,
      address_line1,
      address_line2 = null,
      city,
      state,
      postal_code,
      country,
      is_default = false,
      address_type = null,
    } = req.body;

    if (!user_id || !address_line1 || !city || !state || !postal_code || !country) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "user_id",
          "address_line1",
          "city",
          "state",
          "postal_code",
          "country",
        ],
      });
    }

    const result = await db.query(
      `UPDATE shipping_addresses
         SET user_id = $1,
             address_line1 = $2,
             address_line2 = $3,
             city = $4,
             state = $5,
             postal_code = $6,
             country = $7,
             is_default = $8,
             address_type = $9
       WHERE id = $10
       RETURNING *`,
      [
        user_id,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_default,
        address_type,
        addrId,
      ]
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
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Delete a shipping address
ShippingAddrsRouter.delete("/:id", async (req, res) => {
  try {
    const addrId = req.params.id;
    if (isNaN(addrId)) {
      return res.status(400).json({ error: "Invalid address ID. Must be a number." });
    }

    const result = await db.query(
      "DELETE FROM shipping_addresses WHERE id = $1 RETURNING *",
      [addrId]
    );

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
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

export { ShippingAddrsRouter };