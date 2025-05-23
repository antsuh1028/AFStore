import express from "express";
import { db } from "../db/index.js";

const CartItemsRouter = express.Router();

CartItemsRouter.get("/", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM cart_items;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item to cart
CartItemsRouter.post("/", async (req, res) => {
  try {
    const { cart_id, item_id, quantity } = req.body;

    if (!cart_id || !item_id || !quantity) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["cart_id", "item_id", "quantity"],
      });
    }

    // Check if item already exists in cart
    const existingItem = await db.query(
      `SELECT * FROM cart_items WHERE cart_id = $1 AND item_id = $2`,
      [cart_id, item_id]
    );

    let result;
    if (existingItem.rows.length > 0) {
      result = await db.query(
        `UPDATE cart_items 
         SET quantity = quantity + $1 
         WHERE cart_id = $2 AND item_id = $3 
         RETURNING *`,
        [quantity, cart_id, item_id]
      );
    } else {
      result = await db.query(
        `INSERT INTO cart_items (cart_id, item_id, quantity, date_added) 
   VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
   RETURNING *`,
        [cart_id, item_id, quantity]
      );
    }

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Item added to cart",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Get specific cart item
CartItemsRouter.get("/:id", async (req, res) => {
  try {
    const cartItemId = req.params.id;

    if (isNaN(cartItemId)) {
      return res.status(400).json({
        error: "Invalid cart item ID",
      });
    }

    const result = await db.query(
      `SELECT ci.*, i.name, i.price, i.brand 
       FROM cart_items ci
       JOIN items i ON ci.item_id = i.id
       WHERE ci.id = $1`,
      [cartItemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Cart item not found",
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

//Get Cart Items by Cart
CartItemsRouter.get("/cart/:cart_id", async (req, res) => {
  try {
    const cartId = req.params.cart_id;

    if (isNaN(cartId)) {
      return res.status(400).json({
        error: "Invalid cart ID",
      });
    }

    const result = await db.query(
      `SELECT * FROM cart_items WHERE cart_id = $1`,
      [cartId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Cart not found",
      });
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

// Update cart item quantity
CartItemsRouter.put("/:id", async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    if (isNaN(cartItemId)) {
      return res.status(400).json({
        error: "Invalid cart item ID",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        error: "Quantity must be a positive number",
      });
    }

    const result = await db.query(
      `UPDATE cart_items 
       SET quantity = $1 
       WHERE id = $2 
       RETURNING *`,
      [quantity, cartItemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Cart item not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Cart item updated",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Remove item from cart
CartItemsRouter.delete("/:id", async (req, res) => {
  try {
    const cartItemId = req.params.id;

    if (isNaN(cartItemId)) {
      return res.status(400).json({
        error: "Invalid cart item ID",
      });
    }

    const result = await db.query(
      `DELETE FROM cart_items WHERE id = $1 RETURNING *`,
      [cartItemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Cart item not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Item removed from cart",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

export { CartItemsRouter };
