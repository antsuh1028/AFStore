import express from "express";
import { db } from "../db/index.js";

const ItemsRouter = express.Router();

//Get all items in the table
ItemsRouter.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY name ASC");

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
ItemsRouter.get("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    if (isNaN(itemId)) {
      return res.status(400).json({
        error: "Invalid item ID. ID must be a number.",
      });
    }

    const result = await db.query("SELECT * FROM items WHERE id = $1", [
      itemId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Item not found",
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

//Get Item(s) by Name
ItemsRouter.get("/name/:name", async (req, res) => {
  try {
    const itemName = req.params.name;

    const result = await db.query(
      "SELECT * FROM items WHERE LOWER(name) = LOWER($1)",
      [itemName]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Item not found",
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

//Get Item by Species
ItemsRouter.get("/species/:species", async (req, res) => {
  try {
    const species = req.params.species;

    const result = await db.query(
      "SELECT * FROM items WHERE LOWER(species) = LOWER($1) ORDER BY name ASC",
      [species]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      species: species,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

//Get Item by Style
ItemsRouter.get("/style/:style", async (req, res) => {
  try {
    const style = req.params.style;
    const result = await db.query(
      "SELECT * FROM items WHERE style::text = $1 ORDER BY name ASC",
      [style]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      style: style,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

//Add Item
ItemsRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      species,
      description,
      images,
      price,
      brand,
      grade,
      origin,
      spec,
      avg_weight,
      style,
      show = true, // Default to true
      allergens,
      ingredients,
    } = req.body;

    if (
      !name ||
      !species ||
      !description ||
      price === undefined ||
      !brand ||
      !grade ||
      !origin ||
      !spec ||
      !avg_weight ||
      !style
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "name",
          "species",
          "description",
          "price",
          "brand",
          "grade",
          "origin",
          "spec",
          "avg_weight",
          "style",
        ],
      });
    }

    const upperSpecies = species.toUpperCase();

    const result = await db.query(
      `INSERT INTO items (name, species, description, images, price, brand, grade, origin, spec, avg_weight, style, show, allergens, ingredients)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        name,
        upperSpecies,
        description,
        images || null,
        price,
        brand,
        grade,
        origin,
        spec,
        avg_weight,
        style,
        show,
        allergens || null,
        ingredients || null,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Item created successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

//Update Item - Support partial updates
ItemsRouter.put("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    if (isNaN(itemId)) {
      return res.status(400).json({
        error: "Invalid item ID. ID must be a number.",
      });
    }

    // First, get the current item
    const currentItem = await db.query("SELECT * FROM items WHERE id = $1", [itemId]);
    
    if (currentItem.rows.length === 0) {
      return res.status(404).json({
        error: "Item not found",
      });
    }

    // Merge current data with updates (partial update support)
    const current = currentItem.rows[0];
    const updates = req.body;
    
    const {
      name = current.name,
      species = current.species,
      description = current.description,
      images = current.images,
      price = current.price,
      brand = current.brand,
      grade = current.grade,
      origin = current.origin,
      spec = current.spec,
      avg_weight = current.avg_weight,
      style = current.style,
      show = current.show,
      allergens = current.allergens,
      ingredients = current.ingredients,
    } = updates;

    const upperSpecies = species.toUpperCase();

    const result = await db.query(
      `UPDATE items 
       SET name = $1, species = $2, description = $3, images = $4, price = $5, 
           brand = $6, grade = $7, origin = $8, spec = $9, avg_weight = $10, 
           style = $11, show = $12, allergens = $13, ingredients = $14
       WHERE id = $15
       RETURNING *`,
      [
        name,
        upperSpecies,
        description,
        images,
        price,
        brand,
        grade,
        origin,
        spec,
        avg_weight,
        style,
        show,
        allergens,
        ingredients,
        itemId,
      ]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: "Item updated successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// PATCH route for simple field updates (like toggling show status)
ItemsRouter.patch("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    if (isNaN(itemId)) {
      return res.status(400).json({
        error: "Invalid item ID. ID must be a number.",
      });
    }

    // Build dynamic update query based on provided fields
    const updates = req.body;
    const allowedFields = [
      'name', 'species', 'description', 'images', 'price', 'brand', 
      'grade', 'origin', 'spec', 'avg_weight', 'style', 'show', 
      'allergens', 'ingredients'
    ];
    
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        if (key === 'species') {
          updateFields.push(`${key} = $${paramCount}`);
          values.push(value.toLowerCase());
        } else {
          updateFields.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: "No valid fields to update",
        allowedFields,
      });
    }

    values.push(itemId);

    const query = `UPDATE items SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Item not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Item updated successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

//Delete Item by Id
ItemsRouter.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    if (isNaN(itemId)) {
      return res.status(400).json({
        error: "Invalid item ID. ID must be a number.",
      });
    }

    const result = await db.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Item not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Item deleted successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

export { ItemsRouter };