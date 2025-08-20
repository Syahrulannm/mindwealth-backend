// src/routes/articles.js

import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import { getArticles, createArticle, deleteArticle, getArticleById, updateArticle, getArticleBySlug, uploadEditorImage, getRelatedArticles } from "../controllers/articleController.js";
import commentRoutes from "./comment.js";

// Rute GET
// Rute untuk mendapatkan artikel terkait (tanpa parameter, spesifik)
router.get("/related", getRelatedArticles); // Mendapatkan artikel terkait berdasarkan kategori
// Letakkan rute yang lebih spesifik di atas
router.get("/slug/:slug", getArticleBySlug); // Mendapatkan artikel berdasarkan slug
router.get("/:id", getArticleById); // Mendapatkan artikel berdasarkan ID
router.get("/", getArticles); // Mendapatkan semua artikel

// Rute untuk unggahan gambar dari Editor.js
// Catatan: Endpoint ini tidak memerlukan otorisasi token jika digunakan oleh publik
router.post("/editor-image", uploadMiddleware, uploadEditorImage);

// Rute POST
// Menambahkan authMiddleware dan uploadMiddleware
router.post("/", authMiddleware, uploadMiddleware, createArticle);

// Rute PUT
// Menambahkan authMiddleware dan uploadMiddleware untuk pembaruan gambar
router.put("/:id", authMiddleware, uploadMiddleware, updateArticle);

// Rute DELETE
router.delete("/:id", authMiddleware, deleteArticle);

// Rute anak (sub-route) untuk komentar
router.use("/:articleId/comments", commentRoutes);

export default router;
