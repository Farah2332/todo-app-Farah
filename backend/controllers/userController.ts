import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import ApiResponse from '../utils/ApiResponse';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json(ApiResponse.getBuilder<void>().withCode(400).withMessage('User already exists').build());
            return;
        }

        const newUser = new User({ email, password });
        const user = await newUser.save();

        res.status(201).json(ApiResponse.getBuilder<IUser>().withData(user).withCode(201).build());
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).json(ApiResponse.getBuilder<void>().withCode(500).withMessage('Server error').build());
    }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            res.status(400).json(ApiResponse.getBuilder<void>().withCode(400).withMessage('Invalid credentials').build());
            return;
        }

        // Mock token generation
        const token = 'mocked-jwt-token';
        res.json(ApiResponse.getBuilder<string>().withData(token).build());
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).json(ApiResponse.getBuilder<void>().withCode(500).withMessage('Server error').build());
    }
};

