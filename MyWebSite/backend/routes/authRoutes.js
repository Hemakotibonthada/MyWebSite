const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 



const {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    getUserProfile,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// User Registration Route
router.post("/register", registerUser);

// Alias for Register (Optional for flexibility)
router.post("/signup", registerUser);

// User Login Route
router.post("/login", loginUser);


// User Logout Route (Protected)
router.post("/logout", authMiddleware, logoutUser);

// Token Refresh Route
router.post("/refresh", refreshToken);

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Password Reset Route (With Token)
router.post("/reset-password/:resetToken", resetPassword);

// Get User Profile Route (Protected)
router.get("/profile", authMiddleware, getUserProfile);





// Register Route
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword, // Store the hashed password
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;