// backend/controllers/authController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// User Signup (registerUser)
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    try {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully.", token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error." });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful.", token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Logout User
exports.logoutUser = (req, res) => {
    res.status(200).json({ message: "Logout successful." });
};

// Refresh Token (Placeholder)
exports.refreshToken = (req, res) => {
    res.status(200).json({ message: "Token refreshed." });
};

// Forgot Password (Placeholder)
exports.forgotPassword = (req, res) => {
    res.status(200).json({ message: "Password reset link sent." });
};

// Reset Password (Placeholder)
exports.resetPassword = (req, res) => {
    res.status(200).json({ message: "Password reset successful." });
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found." });

        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error." });
    }
};