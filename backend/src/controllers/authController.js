import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();


///Register USER
export const registerUser = async (req, res) => {
    const { username, real_name, email, password } = req.body;

    if(!username || !real_name || !email || !password) {
        return res.status(400).json({message:"Please fillup all fields"});
    }

    console.log("📩 Incoming Request Body:", req.body);

    try {
        const hashed = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (username, real_name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING id, username, real_name, email",
            [username,real_name,email, hashed]
        );

        res.status(201).json({
            success: true,
            user: result.rows[0],
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err.message });
    }
};

///Login
export const loginUser = async (req, res) => {
    try {

    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

    const userResult = await pool.query(
        `SELECT * FROM users WHERE email = $1 LIMIT 1`,
        [email]
    );

    if (userResult.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }


    const user = userResult.rows[0];

    ///Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid password",
        });
    }


    // Create JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                real_name: user.real_name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        error: "Server error",
        });
    }
};