// src/models/Article.js
import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String },
    // Menggunakan tipe data Mixed untuk konten artikel
    // Ini memungkinkan fleksibilitas dalam struktur konten
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {}, // Memberikan nilai default objek kosong
    },
    category: {
      type: String,
      default: "General",
    },
    tags: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    coverImage: { type: String, default: null },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    published: { type: Boolean, default: false }, //
    publishedAt: { type: Date, default: Date.now }, // Tanggal publikasi artikel
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
