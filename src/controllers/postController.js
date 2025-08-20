// src/controllers/postController.js
// Controller for handling post-related operations
import path from "path";
import fs from "fs";
import Post from "../models/postModel.js";

const createPost = async (req, res) => {
  try {
    // `req.file` sudah tersedia karena middleware upload sudah dijalankan
    const { title, content } = req.body;
    const coverImage = req.file ? req.file.filename : null;

    const newPost = new Post({ title, content, coverImage });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(400).send("Data artikel tidak valid atau gagal mengunggah gambar.");
  }
};

module.exports = {
  createPost,
};
export const uploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  // multer saved file to public/uploads
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
};
