import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { apiRouter } from "./routes/index.js"; 

const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";

const PORT = parseInt(
  process.env.PORT
  || (NODE_ENV === "development" ? process.env.DEV_SERVER_PORT : process.env.PROD_SERVER_PORT)
  || "3000",
  10
);
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    /vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.use("/api", apiRouter);

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error("Server failed to start:", err);
  } else {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  }
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
