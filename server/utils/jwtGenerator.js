const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const secret = process.env.JWT_SECRET_KEY;

function generateToken(userId) {
    const payload = { user:  userId  };
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}

module.exports = { generateToken };
