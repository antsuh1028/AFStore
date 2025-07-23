import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { apiRouter } from "./routes/index.js"; 

dotenv.config();

const app = express();
const PORT =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_SERVER_PORT
    : process.env.PROD_SERVER_PORT;

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
