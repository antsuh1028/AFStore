import express from 'express';
import {db} from '../db/index.js';


const ShippingAddrsRouter = express.Router();

ShippingAddrsRouter.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM shipping_addresses;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { ShippingAddrsRouter };