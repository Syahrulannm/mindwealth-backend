// src/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articles.js";

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
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mindwealth.netlify.app"],
    credentials: true,
  })
); // enable CORS untuk semua origin (bisa dikustomisasi)

app.use(express.json()); // agar bisa baca body JSON
app.use("/api", authRoutes);
app.use("/uploads", express.static("uploads")); // agar bisa akses gambar
app.use("/api/articles", articleRoutes);

// Route untuk menguji server
// Bisa dihapus jika tidak diperlukan
app.get("/", (req, res) => {
  res.send("Backend MindWealth jalan 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
