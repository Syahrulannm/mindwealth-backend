// src/routes/auth.js
import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/login", loginUser); // Login user route
router.post("/auth/register", registerUser); // Register user route

export default router;
