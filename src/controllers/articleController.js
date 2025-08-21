// src/controllers/articleController.js
import Article from "../models/articleModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { title, content, slug, category, published } = req.body;
    const coverImage = req.file ? req.file.filename : null;

    // Validasi wajib
    if (!title || !slug) {
      return res.status(400).json({ message: "Title and slug are required" });
    }

    // Cek slug unik
    const exists = await Article.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Slug must be unique" });
    }

    // Simpan artikel
    const article = new Article({
      title,
      content: typeof content === "string" ? JSON.parse(content) : content,
      slug,
      coverImage,
      category,
      published: published === "true" || published === true,
    });

    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete an article by ID
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json({ message: "Article deleted" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateArticle = async (req, res) => {
  try {
    const { title, slug, category, published, content } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    // Update field
    if (title) article.title = title;
    if (slug) article.slug = slug;
    if (category) article.category = category;
    if (published !== undefined) {
      article.published = published === "true" || published === true;
    }
    if (content) {
      article.content = typeof content === "string" ? JSON.parse(content) : content;
    }

    // Update cover image
    if (req.file) {
      if (article.coverImage) {
        const oldImagePath = path.join(__dirname, "..", "uploads", article.coverImage);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      article.coverImage = req.file.filename;
    }

    const updated = await article.save();
    res.json(updated);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Gagal mengupdate artikel" });
  }
};

export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ slug });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error in getArticleBySlug:", error); // Tambahkan log ini
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mengunggah gambar dari Editor.js
export const uploadEditorImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: 0,
        message: "File tidak ditemukan.",
      });
    }

    const imageUrl = `/uploads/${file.filename}`;
    res.status(200).json({
      success: 1,
      file: {
        url: imageUrl,
      },
    });
  } catch (error) {
    console.error("Error mengunggah gambar editor:", error);
    res.status(500).json({
      success: 0,
      message: "Gagal mengunggah gambar.",
    });
  }
};

// Fungsi untuk mendapatkan artikel terkait berdasarkan kategori
// Endpoint ini akan menerima kategori dan ID artikel saat ini sebagai query parameter
export const getRelatedArticles = async (req, res) => {
  try {
    const { category, currentArticleId } = req.query; // Ambil kategori dan ID artikel saat ini

    // Cari artikel lain dengan kategori yang sama dan batasi jumlahnya
    const relatedArticles = await Article.find({
      category: category,
      _id: { $ne: currentArticleId }, // Pastikan ID artikel saat ini tidak termasuk
    })
      .limit(3) // Batasi hasilnya menjadi 3 artikel
      .select("title slug coverImage"); // Hanya ambil data yang diperlukan

    res.json(relatedArticles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
