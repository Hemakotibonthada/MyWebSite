// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ====================== AUTH ROUTES ======================

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post("/signup", authController.signup);

// @route   POST /api/auth/login
// @desc    Login an existing user
// @access  Public
router.post("/login", authController.login);

// ====================== PASSWORD RESET ROUTES ======================

// @route   POST /api/auth/forgot-password
// @desc    Send reset password link to email
// @access  Public
// router.post("/forgot-password", authController.forgotPassword);

// @route   POST /api/auth/reset-password/:resetToken
// @desc    Reset password using reset token
// @access  Public
// router.post("/reset-password/:resetToken", authController.resetPassword);

// ====================== USER PROFILE ROUTE ======================

// @route   GET /api/auth/profile
// @desc    Get logged-in user profile
// @access  Private
router.get("/profile", authMiddleware, authController.getProfile);

// ====================== EXPORT ROUTER ======================
module.exports = router;