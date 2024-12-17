// backend/utils/dbConnection.js

const mongoose = require('mongoose');
const logger = require('./logger'); // Import the logger for better debugging
const dotenv = require('dotenv');

dotenv.config();

// MongoDB Connection Function
const connectDB = async () => {
    try {
        const dbURI = process.env.DB_URI;

        if (!dbURI) {
            throw new Error("Database URI is not defined in environment variables (DB_URI).");
        }

        // Connect to MongoDB
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        console.log("MongoDB Connected Successfully!");
        logger.info("MongoDB Connected Successfully!");
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        logger.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

// Event Listeners for Mongoose
mongoose.connection.on('connected', () => {
    console.log("Mongoose connected to the database.");
    logger.info("Mongoose connected to the database.");
});

mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err.message}`);
    logger.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.warn("Mongoose disconnected from the database.");
    logger.warn("Mongoose disconnected from the database.");
});

// Handle shutdown gracefully
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed due to application termination.");
    console.log("MongoDB connection closed due to application termination.");
    process.exit(0);
});

// Handle SIGTERM (for containerized environments like Docker/Kubernetes)
process.on('SIGTERM', async () => {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed due to application SIGTERM.");
    console.log("MongoDB connection closed due to application SIGTERM.");
    process.exit(0);
});

module.exports = connectDB;