import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cryptoRoutes from "./routes/cryptoRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/crypto", cryptoRoutes);
app.use("/api/markets", marketRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/news", newsRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Crypto Terminal API is running 🚀"
  });
});


// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});