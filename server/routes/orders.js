import express from "express";
import { db } from "../db/index.js";
import { sendOrderConfirmationEmail } from "../utils/emailService.js";
const OrdersRouter = express.Router();

// Get all orders - SORTED BY MOST RECENT
OrdersRouter.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM orders 
      ORDER BY order_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get Orders by user_id - SORTED BY MOST RECENT
OrdersRouter.get("/user/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const result = await db.query(
      `
      SELECT * FROM orders 
      WHERE user_id = $1 
      ORDER BY order_date DESC
    `,
      [userId]
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

// Create a new order
OrdersRouter.post("/", async (req, res) => {
  try {
    const { user_id, total_amount, order_type } = req.body;

    // Get the next order number by finding the highest existing order ID
    const maxOrderResult = await db.query(
      "SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM orders"
    );
    const nextOrderId = maxOrderResult.rows[0].next_id;

    // Formula: (id * 13 + 2500) to spread out numbers
    const obfuscatedNumber = nextOrderId * 13 + 2500;

    const orderNumber = `AF${String(obfuscatedNumber).padStart(6, "0")}`;

    // Create order in database with the generated order number
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, order_date, total_amount, order_number, order_type, order_status, created_at) 
       VALUES ($1, NOW(), $2, $3, $4, 'pending', NOW()) RETURNING *`,
      [user_id, total_amount, orderNumber, order_type || "pickup"]
    );

    const order = orderResult.rows[0];

    // Get user info for email
    const userResult = await db.query("SELECT * FROM users WHERE id = $1", [
      user_id,
    ]);
    const user = userResult.rows[0];
    console.log(
      "User lookup result:",
      user ? "Found user" : "No user found",
      user_id
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    let customerAddress = "Address not provided";
    try {
      const addressResult = await db.query(
        "SELECT * FROM addresses WHERE user_id = $1 LIMIT 1",
        [user_id]
      );
      console.log(
        "Address lookup result:",
        addressResult.rows.length,
        "addresses found"
      );

      if (addressResult.rows.length > 0) {
        const address = addressResult.rows[0];
        const addressParts = [
          address.address_line_1,
          address.address_line_2,
          `${address.city}, ${address.state} ${address.zip_code}`,
        ].filter(Boolean);

        customerAddress = addressParts.join(", ");
        console.log("Formatted address:", customerAddress);
      }
    } catch (addressError) {
      console.warn("Address lookup failed:", addressError);
    }

    // Prepare email data
    // In OrdersRouter.post("/", async (req, res) => {
// After preparing emailData, add order type info:

const emailData = {
  customerName: user.name || "Customer",
  companyName: user.company || "Not specified", 
  email: user.email,
  customerAddress: customerAddress,
  orderNumber: order.order_number,
  orderDate: new Date(order.order_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric",
  }),
  estimatedTotal: total_amount,
  orderItems: req.body.cart_items || [],
  orderType: order_type, // Add this line
};

try {
  const emailResults = await Promise.allSettled([
    sendOrderConfirmationEmail(emailData, false), // Customer email
    sendOrderConfirmationEmail(emailData, true),  // Admin email
  ]);

  emailResults.forEach((result, index) => {
    const type = index === 0 ? "customer" : "admin";
    if (result.status === "fulfilled") {
      console.log(`${type} email sent successfully:`, result.value);
    } else {
      console.error(`${type} email failed:`, result.reason);
    }
  });
} catch (error) {
  console.error("Email promise error:", error);
}

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//Update order status by id
OrdersRouter.put("/:id/status", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const newStatus = req.body.status;

    const allowedStatuses = [
      "pending",
      "complete",
      "incomplete",
      "contacted",
      "quote sent",
      "order placed",
      "declined",
    ];

    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const result = await db.query(
      `UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *`,
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
       SET 
           total_amount = COALESCE($1, total_amount)
       WHERE id = $2
       RETURNING *`,
      [total_amount, orderId]
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
