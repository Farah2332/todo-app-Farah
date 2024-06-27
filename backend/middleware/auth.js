// auth.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function auth(req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    console.log('Authorization Header:', token);

    // Check if not token
    if (!token) {
        console.error('No token found in headers');
        return res.status(401).json({ message: 'Authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

        // Add user from payload
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = auth;
