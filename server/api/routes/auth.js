const express = require('express');
const router = express.Router();
const xss = require('xss');
const User2 = require('../../models/user');
const { hashPassword } = require('../../utils/passwordHasher');
const { generateToken } = require('../../utils/jwtGenerator');

// POST /signup
router.post('/signup', async (req, res) => {
    try {
        const email = xss(req.body.email);
        const password = req.body.password;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check for existing user
        const existingUser = await User2.findOne({ email: { $eq: req.body.email } });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = new User2({ email, password: hashedPassword });
        const savedUser = await newUser.save();

        // Generate JWT token
        const token = generateToken(savedUser._id);

        res.json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
