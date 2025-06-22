// backend/middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ====================== AUTH MIDDLEWARE ======================

// Protect Routes and Verify User Token
exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        // Attach user to request
        req.user = decoded;

        // Verify user exists
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Admin Middleware to Protect Admin Routes
exports.adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Optional Authentication Middleware
exports.optionalAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (token) {
            const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
            req.user = decoded;
        }
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};