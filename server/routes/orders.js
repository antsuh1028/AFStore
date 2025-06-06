import express from "express";
import { db } from "../db/index.js";

const OrdersRouter = express.Router();

OrdersRouter.get("/", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM orders;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get Orders by user_id
OrdersRouter.get("/user/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const result = await db.query(`SELECT * FROM orders WHERE user_id = $1`, [
      userId,
    ]);

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

//Add order
OrdersRouter.post("/", async (req, res) => {
  try {
    const {
      user_id,
      total_amount,
      shipping_address = null,
      billing_address = null,
    } = req.body;

    if (!user_id || !total_amount) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["user_id", "total_amount"],
      });
    }

    const orderNumber = "AF" + Date.now();

    const result = await db.query(
      `INSERT INTO orders (user_id, order_date, status, total_amount, shipping_address, billing_address, order_number)
  VALUES ($1, CURRENT_TIMESTAMP, 'pending', $2, $3, $4, $5)
  RETURNING *`,
      [user_id, total_amount, shipping_address, billing_address, orderNumber]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Order created successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

//Update order status by id
OrdersRouter.put("/:id/:status", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const newStatus = req.params.status.toLowerCase();

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const result = await db.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [newStatus, orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated",
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

//Update Order
OrdersRouter.put("/:id", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { shipping_address, billing_address, total_amount } = req.body;

    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const result = await db.query(
      `UPDATE orders
       SET shipping_address = COALESCE($1, shipping_address),
           billing_address = COALESCE($2, billing_address),
           total_amount = COALESCE($3, total_amount)
       WHERE id = $4
       RETURNING *`,
      [shipping_address, billing_address, total_amount, orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
});

//Delete order
OrdersRouter.delete("/:id", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const result = await db.query(
      `UPDATE orders SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
});

export { OrdersRouter };
