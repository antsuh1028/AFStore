import express from "express";
import { db } from "../db/index.js";

const CartsRouter = express.Router();

CartsRouter.get("/", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM carts;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's cart
CartsRouter.get("/user/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const result = await db.query(`SELECT * FROM carts WHERE user_id = $1`, [
      userId,
    ]);
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Create new cart
CartsRouter.post("/", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        error: "Missing required field: user_id",
      });
    }

    const result = await db.query(
      `INSERT INTO carts (user_id, created_at) 
       VALUES ($1, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [user_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Cart created successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Get specific cart
CartsRouter.get("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;

    if (isNaN(cartId)) {
      return res.status(400).json({
        error: "Invalid cart ID",
      });
    }

    const result = await db.query(`SELECT * FROM carts WHERE id = $1`, [
      cartId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Cart not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Delete cart
CartsRouter.delete("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;

    if (isNaN(cartId)) {
      return res.status(400).json({
        error: "Invalid cart ID",
      });
    }

    const result = await db.query(
      `DELETE FROM carts WHERE id = $1 RETURNING *`,
      [cartId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Cart not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Cart deleted successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Get cart items with item details
CartsRouter.get("/:id/items", async (req, res) => {
  try {
    const cartId = req.params.id;

    if (isNaN(cartId)) {
      return res.status(400).json({
        error: "Invalid cart ID",
      });
    }

    const result = await db.query(
      `
      SELECT ci.*, i.name, i.price, i.brand, i.images 
      FROM cart_items ci
      JOIN items i ON ci.item_id = i.id
      WHERE ci.cart_id = $1
    `,
      [cartId]
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

// Get cart total
CartsRouter.get("/:id/total", async (req, res) => {
  // try {
  //   const cartId = req.params.id;
  //   if (isNaN(cartId)) {
  //     return res.status(400).json({
  //       error: "Invalid cart ID"
  //     });
  //   }
  //   const result = await db.query(`
  //     SELECT
  //       SUM(ci.quantity * i.price) as total,
  //       COUNT(ci.id) as item_count,
  //       SUM(ci.quantity) as total_quantity
  //     FROM cart_items ci
  //     JOIN items i ON ci.item_id = i.id
  //     WHERE ci.cart_id = $1
  //   `, [cartId]);
  //   res.json({
  //     success: true,
  //     data: {
  //       total: result.rows[0].total || 0,
  //       item_count: parseInt(result.rows[0].item_count) || 0,
  //       total_quantity: parseInt(result.rows[0].total_quantity) || 0
  //     }
  //   });
  // } catch (err) {
  //   console.error("Database error:", err);
  //   res.status(500).json({
  //     error: "Internal server error",
  //     message: err.message
  //   });
  // }
});

export { CartsRouter };
