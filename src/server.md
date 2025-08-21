// Mengimpor library yang dibutuhkan
import express from "express";
import mongoose from "mongoose";
// Mengimpor library untuk hashing password dan JWT
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
// Membuat aplikasi Express
const app = express();
// Middleware untuk memproses body JSON dan mengizinkan CORS
app.use(express.json());
app.use(cors());
// Menghubungkan ke MongoDB
mongoose
// Menggunakan dotenv untuk mengelola variabel lingkungan
.connect(process.env.MONGO_URI)
.then(() => console.log("Berhasil terhubung ke MongoDB Atlas"))
.catch((err) => console.error("Gagal terhubung ke MongoDB:", err));

// Menentukan 'port' server
const PORT = process.env.PORT || 5000;

// Definisi Model Artikel
// Membuat skema untuk artikel
const postSchema = new mongoose.Schema(
// Definisi struktur data untuk artikel
{
title: { type: String, required: true },
content: { type: String, required: true },
},
{ timestamps: true }
);

// Membuat model Post berdasarkan skema yang telah didefinisikan
// Model ini akan digunakan untuk berinteraksi dengan koleksi 'posts' di MongoDB
const Post = mongoose.model("Post", postSchema);
// --- Definisi Model Pengguna ---
const userSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// --- Endpoint Autentikasi ---
// Endpoint untuk registrasi pengguna baru
app.post("/api/register", async (req, res) => {
try {
const { username, password } = req.body;
// Cek apakah pengguna sudah ada
const existingUser = await User.findOne({ username });
if (existingUser) {
return res.status(409).send("Username sudah digunakan.");
}
// Hash password sebelum disimpan
const hashedPassword = await bcrypt.hash(password, 10);
const newUser = new User({ username, password: hashedPassword });
await newUser.save();

    res.status(201).send("Pengguna berhasil didaftarkan.");

} catch (error) {
// Jika terjadi kesalahan, kirimkan respons dengan status 500
res.status(500).send("Gagal mendaftarkan pengguna.");
}
});

// Endpoint untuk login
app.post("/api/login", async (req, res) => {
try {
const { username, password } = req.body;
// Cari pengguna
const user = await User.findOne({ username });
if (!user) {
return res.status(401).send("Username atau password salah.");
}
// Bandingkan password
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
return res.status(401).send("Username atau password salah.");
}
// Jika berhasil, buat token
const token = jwt.sign({ id: user.\_id }, "super_secret_key", { expiresIn: "1h" });
res.json({ token, username: user.username });
} catch (error) {
res.status(500).send("Gagal login.");
}
});
// Middleware untuk memverifikasi JWT
const verifyToken = (req, res, next) => {
// Ambil token dari header 'Authorization'
const token = req.header("Authorization");
if (!token) {
return res.status(401).send("Akses ditolak. Tidak ada token.");
}
try {
// Verifikasi token
const verified = jwt.verify(token, "super_secret_key");
req.user = verified;
next(); // Lanjutkan ke endpoint berikutnya
} catch (error) {
res.status(400).send("Token tidak valid.");
}
};

// --- Endpoint CRUD API ---
// Endpoint untuk mengambil semua artikel
app.get("/api/posts", async (req, res) => {
try {
// Mengambil semua artikel dari database
// Menggunakan metode find() dari model Post
const posts = await Post.find({});
res.json(posts);
} catch (error) {
res.status(500).send("Terjadi kesalahan server.");
}
});

// Endpoint untuk mengambil satu artikel berdasarkan ID
app.get("/api/posts/:id", async (req, res) => {
try {
// Mencari artikel berdasarkan ID yang diberikan dalam parameter URL
// Menggunakan metode findById() dari model Post
const post = await Post.findById(req.params.id);
if (!post) {
return res.status(404).send("Artikel tidak ditemukan.");
}
res.json(post);
} catch (error) {
res.status(500).send("Terjadi kesalahan server.");
}
});

// Endpoint untu// Endpoint untuk mendapatkan statistik dashboard (dilindungi)
app.get("/api/posts/stats", verifyToken, async (req, res) => {
try {
const postCount = await Post.countDocuments({});
res.json({ postCount });
} catch (error) {
res.status(500).send("Gagal mendapatkan statistik.");
}
});

app.post("/api/posts", verifyToken, async (req, res) => {
try {
// Membuat artikel baru dengan data yang diterima dari body request
// Menggunakan metode create() dari model Post
const newPost = await Post.create(req.body);
res.status(201).json(newPost);
} catch (error) {
res.status(400).send("Data artikel tidak valid.");
}
});

// Endpoint untuk mengupdate artikel
app.put("/api/posts/:id", verifyToken, async (req, res) => {
try {
// Mencari artikel berdasarkan ID dan mengupdate dengan data baru
// Menggunakan metode findByIdAndUpdate() dari model Post
const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!updatedPost) {
return res.status(404).send("Artikel tidak ditemukan.");
}
res.json(updatedPost);
} catch (error) {
res.status(400).send("Gagal mengupdate artikel.");
}
});

// Endpoint untuk menghapus artikel
app.delete("/api/posts/:id", verifyToken, async (req, res) => {
try {
// Mencari artikel berdasarkan ID dan menghapusnya
// Menggunakan metode findByIdAndDelete() dari model Post
const deletedPost = await Post.findByIdAndDelete(req.params.id);
if (!deletedPost) {
return res.status(404).send("Artikel tidak ditemukan.");
}
res.status(200).send("Artikel berhasil dihapus.");
} catch (error) {
res.status(500).send("Gagal menghapus artikel.");
}
});

// Menjalankan server
app.listen(PORT, () => {
console.log(`Server berjalan di port ${PORT}`);
});

app.use(
cors({
origin: "http://localhost:5173",
})
); // enable CORS untuk semua origin (bisa dikustomisasi)
// Export aplikasi untuk digunakan di file lain
