import express from 'express';
import {db} from '../db/index.js';


const OrderItemsRouter = express.Router();

OrderItemsRouter.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM order_items;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { OrderItemsRouter };