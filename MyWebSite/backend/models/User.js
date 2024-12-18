const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Schema
const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
        },
        password: { type: String, required: true, minlength: 6 },
        phoneNumber: { type: String, match: [/^\d{10}$/, "Invalid phone number"] },
        dateOfBirth: { type: Date },
        address: { type: String },
        gender: { type: String, enum: ["Male", "Female", "Other"] },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Password hashing
// backend/models/User.js
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email, isAdmin: this.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

module.exports = mongoose.model('User', userSchema);