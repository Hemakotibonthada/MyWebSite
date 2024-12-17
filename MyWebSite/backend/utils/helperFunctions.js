// backend/utils/helperFunctions.js

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ====================== TOKEN GENERATION ======================

// Generate JWT Token
exports.generateToken = (userId, expiresIn = "1h") => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

// Generate Random Token (for password reset, verification, etc.)
exports.generateRandomToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

// ====================== PASSWORD HASHING ======================

// Hash Password
exports.hashPassword = (password) => {
    return crypto.createHash("sha256").update(password).digest("hex");
};

// Compare Password Hashes
exports.comparePassword = (password, hashedPassword) => {
    const inputHash = crypto.createHash("sha256").update(password).digest("hex");
    return inputHash === hashedPassword;
};

// ====================== EMAIL UTILS ======================

// Send Email (General Purpose)
exports.sendEmail = async (to, subject, text, html = null) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully." };
    } catch (error) {
        console.error(`Email Error: ${error.message}`);
        throw new Error("Failed to send email.");
    }
};

// ====================== DATE UTILS ======================

// Format Date to Readable String
exports.formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

// Add Days to Current Date
exports.addDaysToDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

// ====================== VALIDATION HELPERS ======================

// Validate Email Format
exports.validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Validate Password Strength
exports.validatePassword = (password) => {
    return password.length >= 8;
};

// ====================== PAGINATION ======================

// Paginate Results
exports.paginate = (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return { offset, limit };
};