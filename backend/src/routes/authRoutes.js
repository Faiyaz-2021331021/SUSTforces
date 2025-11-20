import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Example protected route
router.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

export default router;
