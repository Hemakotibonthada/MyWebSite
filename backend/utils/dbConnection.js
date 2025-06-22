// backend/config/dbConnection.js

const mongoose = require("mongoose");
const chalk = require("chalk");

// ====================== DATABASE CONNECTION ======================

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(chalk.cyan.bold(`MongoDB Connected: ${conn.connection.host}`));
    } catch (error) {
        console.error(chalk.red.bold(`Error: ${error.message}`));
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;