import express from "express";
import { db } from "../db/index.js";

const PointRouter = express.Router();

//Get all points in the table
PointRouter.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM points ORDER BY created_on ASC");

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

//Get Item by Id
PointRouter.get("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    if (isNaN(itemId)) {
      return res.status(400).json({
        error: "Invalid points ID. ID must be a number.",
      });
    }

    const result = await db.query("SELECT * FROM points WHERE id = $1", [
      itemId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Points not found",
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

//Get Points by User ID (from 6 months prior to today)
PointRouter.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Calculate date 6 months ago from today
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await db.query(
      "SELECT * FROM points WHERE user_id = $1 AND created_on >= $2 ORDER BY created_on DESC",
      [userId, sixMonthsAgo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "No points found for this user in the last 6 months",
      });
    }

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      user_id: userId,
      date_filter: sixMonthsAgo.toISOString(),
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

//Add Points Record
PointRouter.post("/", async (req, res) => {
  try {
    const {
      user_id,
      amount,
      order_id
    } = req.body;

    if (user_id === undefined || amount === undefined) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["user_id", "amount"],
      });
    }

    const result = await db.query(
      `INSERT INTO points (user_id, amount, order_id, created_on)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [user_id, amount, order_id || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Points record created successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

//Update Points
PointRouter.put("/:id", async (req, res) => {
  try {
    const pointId = req.params.id;

    if (isNaN(pointId)) {
      return res.status(400).json({
        error: "Invalid points ID. ID must be a number.",
      });
    }
    const currentRecord = await db.query("SELECT * FROM points WHERE id = $1", [pointId]);
    
    if (currentRecord.rows.length === 0) {
      return res.status(404).json({
        error: "Points record not found",
      });
    }

    const current = currentRecord.rows[0];
    const updates = req.body;
    
    const {
      user_id = current.user_id,
      amount = current.amount,
      order_id = current.order_id,
    } = updates;

    const result = await db.query(
      `UPDATE points 
       SET user_id = $1, amount = $2, order_id = $3
       WHERE id = $4
       RETURNING *`,
      [user_id, amount, order_id, pointId]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: "Points record updated successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// PATCH route for simple field updates
PointRouter.patch("/:id", async (req, res) => {
  try {
    const pointId = req.params.id;

    if (isNaN(pointId)) {
      return res.status(400).json({
        error: "Invalid points ID. ID must be a number.",
      });
    }

    // Build dynamic update query based on provided fields
    const updates = req.body;
    const allowedFields = ['user_id', 'amount', 'order_id'];
    
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: "No valid fields to update",
        allowedFields,
      });
    }

    values.push(pointId);

    const query = `UPDATE points SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Points record not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Points record updated successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

//Delete Points Record by Id
PointRouter.delete("/:id", async (req, res) => {
  try {
    const pointId = req.params.id;

    if (isNaN(pointId)) {
      return res.status(400).json({
        error: "Invalid points ID. ID must be a number.",
      });
    }

    const result = await db.query(
      "DELETE FROM points WHERE id = $1 RETURNING *",
      [pointId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Points record not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Points record deleted successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// Get total points for a user (from last 6 months)
PointRouter.get("/user/:id/total", async (req, res) => {
  try {
    const userId = req.params.id;

    // Calculate date 6 months ago from today
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await db.query(
      "SELECT SUM(amount) as total_points FROM points WHERE user_id = $1 AND created_on >= $2",
      [userId, sixMonthsAgo]
    );

    const totalPoints = result.rows[0].total_points || 0;

    res.json({
      success: true,
      data: {
        user_id: userId,
        total_points: parseInt(totalPoints),
        date_filter: sixMonthsAgo.toISOString(),
      },
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

//Redeem points available


export { PointRouter };