const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// User registration (Sign Up)
router.post('/api/auth/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Create new user
        const user = new User({ firstName, lastName, email, password });
        await user.save();

        // Generate JWT
        const token = user.generateAuthToken();

        res.status(201).json({
            message: 'User registered successfully',
            user: { email: user.email, fullName: `${user.firstName} ${user.lastName}` },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// User login
router.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT
        const token = user.generateAuthToken();

        res.status(200).json({
            message: 'Login successful',
            user: { email: user.email, fullName: `${user.firstName} ${user.lastName}` },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

module.exports = router;