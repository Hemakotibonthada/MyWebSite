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
const mongoose = require("mongoose");

// Import Utilities and Config
const connectDB = require("./utils/dbConnection");
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

dotenv.config();

// Initialize Express App
const app = express();
const PORT = config.PORT || 5001;

// Connect to MongoDB
connectDB();

// ==================== MIDDLEWARES ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

// ==================== ROUTES ====================
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to MyWebSite Backend Server!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/devices", authMiddleware, deviceRoutes);
app.use("/api/courses", authMiddleware, courseRoutes);
app.use("/api/chat", authMiddleware, chatRoutes);
app.use("/api/jobs", authMiddleware, jobRoutes);

// ==================== STATIC FILE SERVING ====================
app.use(express.static(path.resolve(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

// ==================== ERROR HANDLING ====================
app.use(notFoundHandler);
app.use(errorHandler);

// ==================== START SERVER ====================
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});