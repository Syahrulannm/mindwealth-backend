// src/controllers/commentController.js
import Comment from "../models/commentModel.js";

export const getCommentsByArticle = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { author, content } = req.body;
    if (!author || !content) {
      return res.status(400).json({ message: "Author and content are required" });
    }

    const comment = new Comment({
      article: req.params.articleId,
      author,
      content,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
