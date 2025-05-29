import express from 'express';
import {db} from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const UsersRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// GET /api/users — fetch all users (testing)
UsersRouter.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/login — login and return JWT
UsersRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Incoming login:", { email, password });

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      console.log("No user found with email:", email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match?", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


export { UsersRouter };
