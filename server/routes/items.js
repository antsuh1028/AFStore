import express from 'express';
import {db} from '../db/index.js';


const ItemsRouter = express.Router();

ItemsRouter.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM items;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { ItemsRouter };