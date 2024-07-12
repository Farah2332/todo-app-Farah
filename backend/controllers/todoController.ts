import { Request, Response } from 'express';
import Todo, {ITodo } from '../models/Todo';
import User from '../models/User';
import ApiResponse from '../utils/ApiResponse'; // Import ApiResponse
// Get all todos for a specific user based on email
export const getTodos = async (req: Request, res: Response): Promise<void> => {
    const userEmail: string = req.query.email as string;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            res.status(404).json(ApiResponse.getBuilder<void>().withCode(404).withMessage('User not found').build());
            return; // Ensure to return after sending response
        }

        const todos = await Todo.find({ email: userEmail });
        res.json(ApiResponse.getBuilder<ITodo[]>().withData(todos).build());
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).json(ApiResponse.getBuilder<void>().withCode(500).withMessage('Server error').build());
    }
};

// Add a new todo
export const addTodo = async (req: Request, res: Response): Promise<void> => {
    const { email, text }: { email: string; text: string } = req.body;

    try {
        // Validate email and text fields if necessary
        if (!email || !text) {
            res.status(400).json(ApiResponse.getBuilder<void>().withCode(400).withMessage('Email and text are required').build());
            return;
        }

        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            res.status(404).json(ApiResponse.getBuilder<void>().withCode(404).withMessage('User not found').build());
            return;
        }

        // Create a new Todo object
        const newTodo = new Todo({
            email,
            text,
        });

        // Save the new todo to the database
        const savedTodo = await newTodo.save();
        res.status(201).json(ApiResponse.getBuilder<ITodo>().withData(savedTodo).withCode(201).build());
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).json(ApiResponse.getBuilder<void>().withCode(500).withMessage('Server error').build());
    }
};

// Delete a todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    const todoId: string = req.params.id;
 

    try {
        const todo = await Todo.findById(todoId);
        if (!todo) {
            res.status(404).json(ApiResponse.getBuilder<void>().withCode(404).withMessage('Todo not found').build());
            return; // Ensure to return after sending response
        }

       /* if (todo.email !== userEmail) {
            res.status(401).json(ApiResponse.getBuilder<void>().withCode(401).withMessage('Unauthorized').build());
            return; // Ensure to return after sending response
        }*/

        await todo.remove();
        res.json(ApiResponse.getBuilder<void>().withMessage('Todo deleted successfully').build());
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).json(ApiResponse.getBuilder<void>().withCode(500).withMessage('Server error').build());
    }
};

// Update a todo
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
    const todoId: string = req.params.id;
    const { text, completed, email }: { text?: string; completed?: boolean; email: string } = req.body;

    try {
        const todo = await Todo.findById(todoId);
        if (!todo) {
            res.status(404).json(ApiResponse.getBuilder<void>().withCode(404).withMessage('Todo not found').build());
            return; // Ensure to return after sending response
        }

        if (todo.email !== email) {
            res.status(401).json(ApiResponse.getBuilder<void>().withCode(401).withMessage('Unauthorized').build());
            return; // Ensure to return after sending response
        }

        if (text !== undefined) {
            todo.text = text;
        }
        if (completed !== undefined) {
            todo.completed = completed;
        }

        const updatedTodo = await todo.save();
        res.json(ApiResponse.getBuilder<ITodo>().withData(updatedTodo).build());
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).json(ApiResponse.getBuilder<void>().withCode(500).withMessage('Server error').build());
    }
};
