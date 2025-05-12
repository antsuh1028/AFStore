import express from 'express';
import {db} from '../db/index.js';


const OrdersRouter = express.Router();

OrdersRouter.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM orders;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { OrdersRouter };