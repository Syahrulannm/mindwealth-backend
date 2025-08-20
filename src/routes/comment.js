// src/routes/comment.js
import express from "express";
import { getCommentsByArticle, addComment } from "../controllers/commentController.js";

const router = express.Router({ mergeParams: true });

// Ambil semua komentar
router.get("/", getCommentsByArticle);

router.post("/", addComment);

export default router;
