const express = require('express');
const router = express.Router();
const Post = require('../../models/post');
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' }); 
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = { userId: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// GET /posts
router.get('/posts', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const results = {};

        // Pagination
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        results.posts = await Post.find()
            .limit(limit)
            .skip(startIndex)
            .sort({ createdAt: -1 })
            .exec();

        if (results.posts.length >= limit) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 
