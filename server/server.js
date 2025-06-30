import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { apiRouter } from "./routes/index.js"; // Add this

dotenv.config();

const app = express();
const PORT =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_SERVER_PORT
    : process.env.PROD_SERVER_PORT;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Root route hit!");
  res.json({ message: "Server is working!" });
});

app.use("/api", apiRouter);

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error("Server failed to start:", err);
  } else {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`Test: http://localhost:${PORT}/api/items`);
  }
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
