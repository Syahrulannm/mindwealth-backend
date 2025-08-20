// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Ambil token dari header "Authorization"
    // Token biasanya dikirim dalam format "Bearer <token>"
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Tidak ada token, otorisasi ditolak." });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Tambahkan payload token ke objek request
    next(); // Lanjutkan ke handler rute berikutnya
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid." });
  }
};

export default authMiddleware;
