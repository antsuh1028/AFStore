import express from "express";
import { db } from "../db/index.js";

const OrderItemsRouter = express.Router();

//Get all orders
OrderItemsRouter.get("/", async (req, res) => {
  try {
    const { order_id } = req.query;

    const result = order_id
      ? await db.query("SELECT * FROM order_items WHERE order_id = $1", [
          order_id,
        ])
      : await db.query("SELECT * FROM order_items");

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

OrderItemsRouter.get("/orders/:orderId", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);

    const result = await db.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [orderId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

OrderItemsRouter.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await db.query("SELECT * FROM order_items WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order item not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

OrderItemsRouter.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { quantity, unit_price } = req.body;

    const subtotal = quantity && unit_price ? quantity * unit_price : undefined;

    const result = await db.query(
      `UPDATE order_items
       SET quantity = COALESCE($1, quantity),
           unit_price = COALESCE($2, unit_price),
           subtotal = COALESCE($3, subtotal)
       WHERE id = $4
       RETURNING *`,
      [quantity, unit_price, subtotal, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order item not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

OrderItemsRouter.post("/", async (req, res) => {
  try {
    const { order_id, item_id, quantity, unit_price } = req.body;

    if (!order_id || !item_id || !quantity ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const subtotal = quantity * unit_price;

    const result = await db.query(
      `INSERT INTO order_items (order_id, item_id, quantity, unit_price, subtotal)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [order_id, item_id, quantity, unit_price, subtotal]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

OrderItemsRouter.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await db.query(
      "DELETE FROM order_items WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order item not found" });
    }

    res.json({
      success: true,
      message: "Order item deleted",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { OrderItemsRouter };
