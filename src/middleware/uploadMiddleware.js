// src/middleware/uploadMiddleware.js

import multer from "multer";
import path from "path";

// Konfigurasi Multer untuk menyimpan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tentukan folder penyimpanan
    cb(null, "uploads/"); // Pastikan folder ini ada
  },
  // Tentukan nama file yang akan disimpan
  filename: function (req, file, cb) {
    // Tentukan nama file unik
    cb(null, Date.now() + "-" + file.originalname); // Menggunakan timestamp untuk menghindari duplikasi nama file
  },
});

// File filter untuk mengizinkan hanya tipe file tertentu (misalnya, gambar)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed")); // Mengembalikan error jika tipe file tidak sesuai
  }
};

// Middleware multer untuk mengunggah satu file dengan nama 'coverImage'
// Middleware ini diekspor sebagai default
const uploadSingleImage = multer({ storage, fileFilter }).single("coverImage");

export default uploadSingleImage;
