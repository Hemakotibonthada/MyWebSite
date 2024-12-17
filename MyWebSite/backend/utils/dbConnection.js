// backend/config/dbConnection.js

const mongoose = require("mongoose");

// ====================== DATABASE CONNECTION ======================

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;