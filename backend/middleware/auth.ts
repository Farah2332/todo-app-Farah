import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthenticatedRequest extends Request {
    user?: any;
}

function auth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    // Get token from header
    const token = req.header('Authorization');

    console.log('Authorization Header:', token);

    // Check if no token
    if (!token) {
        console.error('No token found in headers');
        res.status(401).json({ message: 'Authorization denied' });
        return; // Ensure to return after sending response
    }

    try {
        // Verify token
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as string);

        // Add user from payload
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
}

export default auth;
