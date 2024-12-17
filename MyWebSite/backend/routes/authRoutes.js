// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, refreshToken, forgotPassword, resetPassword, getUserProfile } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ====================== AUTH ROUTES ======================

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login an existing user
// @access  Public
router.post("/login", loginUser);
router.post('/signup', authController.signup);


// @route   POST /api/auth/logout
// @desc    Logout user and clear token
// @access  Private
router.post("/logout", authMiddleware, logoutUser);

// @route   POST /api/auth/refresh
// @desc    Generate new access token using refresh token
// @access  Public
router.post("/refresh", refreshToken);

// ====================== PASSWORD RESET ROUTES ======================

// @route   POST /api/auth/forgot-password
// @desc    Send reset password link to email
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password/:resetToken
// @desc    Reset password using reset token
// @access  Public
router.post("/reset-password/:resetToken", resetPassword);

// ====================== USER PROFILE ROUTE ======================

// @route   GET /api/auth/profile
// @desc    Get logged-in user profile
// @access  Private
router.get("/profile", authMiddleware, getUserProfile);

// ====================== EXPORT ROUTER ======================
module.exports = router;