const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;



// User Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into database
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.rows[0].id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token, user: user.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
