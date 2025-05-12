import express from 'express';
import {db} from '../db/index.js';


const CartItemsRouter = express.Router();

CartItemsRouter.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM cart_items;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { CartItemsRouter };