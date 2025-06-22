// backend/middlewares/errorHandler.js

const chalk = require('chalk');

// ====================== ERROR HANDLER MIDDLEWARE ======================

// Custom Error Response
const errorHandler = (err, req, res, next) => {
    console.error(chalk.red.bold(`Error: ${err.message}`));

    // Set Status Code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
};

// Not Found Middleware
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// ====================== EXPORT HANDLERS ======================
module.exports = { errorHandler, notFoundHandler };