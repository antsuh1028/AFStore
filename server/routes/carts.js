import express from 'express';
import {db} from '../db/index.js';


const CartsRouter = express.Router();

CartsRouter.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM carts;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { CartsRouter };