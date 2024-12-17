// backend/controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController = require('../controllers/authController');


// User Signup
exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {
        // Input Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check if User Already Exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create New User
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await user.save();

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(201).json({
            message: "User registered successfully.",
            userId: user._id,
            token,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Input Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Find User by Email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({
            message: "Login successful.",
            userId: user._id,
            token,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Fetch User Profile (Optional)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};