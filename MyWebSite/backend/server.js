// backend/server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const path = require("path");

// Import Utilities and Config
const connectDB = require("./utils/dbConnection"); // Correct import
const logger = require("./utils/logger");
const config = require("./config");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const courseRoutes = require("./routes/courseRoutes");
const chatRoutes = require("./routes/chatRoutes");
const jobRoutes = require("./routes/jobRoutes");

// Import Middlewares
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");
const { authMiddleware } = require("./middlewares/authMiddleware");



// Initialize Environment Variables
dotenv.config();

// Create Express App
const app = express();
const PORT = config.PORT || 5001;

// ==================== DATABASE CONNECTION ====================
connectDB();

// ==================== SECURITY MIDDLEWARES ====================
app.use(helmet()); // Adds security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
app.use(compression()); // Compress HTTP responses for better performance

// ==================== REQUEST RATE LIMITING ====================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// ==================== GENERAL MIDDLEWARES ====================
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
app.use(cors({ origin: config.CORS_ALLOWED_ORIGIN || "*" })); // Enable CORS
app.use(morgan("dev")); // HTTP Request Logging

// ==================== STATIC FILE SERVING ====================
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ==================== REQUEST LOGGING ====================
app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} request to ${req.url}`);
    next();
});

// ==================== ROUTES ====================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to MyWebSite Backend Server!",
        status: "Running",
        environment: process.env.NODE_ENV || "development",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/devices", authMiddleware, deviceRoutes);
app.use("/api/courses", authMiddleware, courseRoutes);
app.use("/api/chat", authMiddleware, chatRoutes);
app.use("/api/jobs", authMiddleware, jobRoutes);

// ==================== ERROR HANDLING ====================
// Handle Invalid Routes
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

// ==================== GRACEFUL ERROR HANDLING ====================
process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    console.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1); // Exit the process on unhandled promise rejection
});

process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1); // Exit the process on uncaught exception
});
// Unhandled Promise Rejection Handling
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1); // Exit process with failure
});

process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1); // Exit process with failure
});
// Serve React App for all non-API routes
app.use((req, res, next) => {
    if (!req.url.startsWith("/api")) {
        res.sendFile(path.resolve(__dirname, "../frontend/public", "index.html"));
    } else {
        next();
    }
});
app.get("/", (req, res) => {
    res.send("Hello from the server!");
  });
app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});
// ==================== START SERVER ====================
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    console.log(`Server is running on http://localhost:${PORT}`);
});