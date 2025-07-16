import express from "express";
import { db } from "../db/index.js";

const InquiriesRouter = express.Router();

// GET /api/inquiries - Get all inquiries
InquiriesRouter.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM inquiries ORDER BY timestamp DESC");
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/inquiries/:id - Get single inquiry
InquiriesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM inquiries WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inquiries - Create new inquiry
InquiriesRouter.post("/", async (req, res) => {
 try {
   const { 
     name, 
     email, 
     phone, 
     license_number, 
     message, 
     cart_items, 
     cart_total,
     company_address_1,
     company_address_2,
     city,
     state,
     zip_code,
     business_license,
     california_resale
   } = req.body;
   
   const result = await db.query(
     `INSERT INTO inquiries (
       name, email, phone, license_number, message, cart_items, cart_total,
       company_address_1, company_address_2, city, state, zip_code,
       business_license, california_resale
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
     RETURNING *`,
     [
       name, email, phone, license_number, message, 
       JSON.stringify(cart_items), cart_total,
       company_address_1, company_address_2, city, state, zip_code,
       business_license, california_resale
     ]
   );
   
   res.status(201).json({ success: true, data: result.rows[0] });
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
});

// PUT /api/inquiries/:id/status - Update inquiry status
InquiriesRouter.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await db.query(
      "UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/inquiries/:id - Delete inquiry
InquiriesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM inquiries WHERE id = $1 RETURNING *", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    
    res.json({ success: true, message: "Inquiry deleted", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { InquiriesRouter };