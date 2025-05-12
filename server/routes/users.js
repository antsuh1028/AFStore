import express from 'express';
import {db} from '../db/index.js';


const UsersRouter = express.Router();

UsersRouter.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM users;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { UsersRouter };