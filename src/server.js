// src/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articles.js";
import path from "path";
import { fileURLToPath } from "url";

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    // opsi koneksi
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

const app = express();
const PORT = process.env.PORT || 8080;
app.use(
  cors({
    origin: ["https://mindwealth.netlify.app"],
    //http://localhost:5173"untuk ke local,
    credentials: true,
  })
); // enable CORS untuk semua origin (bisa dikustomisasi)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json()); // agar bisa baca body JSON
app.use("/api", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // agar bisa akses gambar
app.use("/api/articles", articleRoutes);

// Route untuk menguji server
// Bisa dihapus jika tidak diperlukan
app.get("/", (req, res) => {
  res.send("Backend MindWealth jalan 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
