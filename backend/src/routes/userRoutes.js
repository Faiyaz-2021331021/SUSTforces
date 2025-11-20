import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import pool from "../config/db.js";

const router = express.Router();

// GET /user/me
router.get("/me", authenticateToken, async (req, res) => {
    try {
        // req.user is set by authenticateToken middleware
        const userResult = await pool.query(
            "SELECT id, username, real_name, email FROM users WHERE id = $1",
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Could not find user with ID " + req.user.id + ".Make sure your ID is correct" });
        }

        res.json({ success: true, user: userResult.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
