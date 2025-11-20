import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route (no token needed)
router.get("/public", (req, res) => {
    res.json({ message: "Anyone can access this" });
});

// Protected route (token required)
router.get("/dashboard", authenticateToken, (req, res) => {
    res.json({ message: `Hello ${req.user.username}, this is your dashboard!` });
});

export default router;
