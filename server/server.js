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

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://af-store-git-main-antsuh1028s-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  // console.log("Root route hit!");
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
