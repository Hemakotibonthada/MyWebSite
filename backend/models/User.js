// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Schema
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        phoneNumber: {
            type: String,
            required: false,
            match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
        },
        dateOfBirth: {
            type: Date,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: false,
        },
        blockedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

// Hash password before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare entered password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token for authentication
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email, isAdmin: this.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
};

// Virtual Full Name Field
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// User Model
module.exports = mongoose.model("User", userSchema);