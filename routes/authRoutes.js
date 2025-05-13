const express = require('express'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role = 'student' } = req.body;
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role.toLowerCase() },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "1h" }
        );
        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Google OAuth Registration or Login
router.post('/google', async (req, res) => {
    const { token } = req.body;
    console.log("✅ Token received:", token);


    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log("✅ Payload:", payload);

        const { email, name, picture } = payload; // ✅ this line defines `email`



    // 2. Check if user already exists
    let user = await User.findOne({ email });
    console.log("👀 Existing user:", user);;

        if (!user) {
            user = new User({
                name: name,
                email: email,
                password: "", // password is optional for OAuth
                googleId: payload.sub,
                role: "student", // default role for Google users
                provider: "google",

            });
            await user.save();
            console.log("✅ New user created:", user);

        }

        const authToken = jwt.sign(
            { id: user._id, role: user.role.toLowerCase() },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "1h" }
        );
        console.log("✅ Token created:", authToken);


        res.status(200).json({
            token: authToken,
            user: { name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        console.error("Google Auth Error:", err);
        res.status(500).json({ message: "Google Authentication failed." });
    }
});

// Protected User Info Route
router.get('/me', async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id).select("-password");

        res.json(user);
    } catch (err) {
        console.error("Me Route Error:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;
