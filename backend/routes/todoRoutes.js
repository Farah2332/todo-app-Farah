// routes/todoRoutes.js

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const User = require('../models/User');


// Get all todos for a specific user based on email
router.get('/', async (req, res) => {
    const userEmail = req.query.email;

    try {
        // Find the user by email to get their todos
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find all todos associated with the user
        const todos = await Todo.find({ email: userEmail });

        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new todo
/*router.post('/', async (req, res) => {
    const { text, userEmail } = req.body; // Destructure userEmail from request body
    try {
        const newTodo = new Todo({
            text,
            userEmail, // Include userEmail in the Todo creation
        });
        const todo = await newTodo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});*/
router.post('/', async (req, res) => {
    const { email, text } = req.body;

    try {
        // Check if the user exists based on the provided email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new Todo instance associated with the found user
        const newTodo = new Todo({
            email, // Store the email associated with the Todo
            text,  // The actual text/content of the Todo
            // Assuming 'completed' and 'createdAt' are optional fields
        });

        // Save the Todo to the database
        const savedTodo = await newTodo.save();

        res.status(201).json(savedTodo); // Respond with the saved Todo
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});



router.delete('/:id', async (req, res) => {
    const todoId = req.params.id;

    try {
        // Find the todo by ID
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check if the user is authorized to delete this todo
        const userEmail = req.body.email; // Assuming the email is sent in the request body

        if (todo.email !== userEmail) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Remove the todo
        await todo.remove();

        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


// PUT (Update) a todo
router.put('/:id', async (req, res) => {
    const todoId = req.params.id;
    const { text, completed } = req.body;

    try {
        // Find the todo by ID
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check if the user is authorized to update this todo
        const userEmail = req.body.email; // Assuming the email is sent in the request body

        if (todo.email !== userEmail) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Update the todo fields
        if (text !== undefined) {
            todo.text = text;
        }
        if (completed !== undefined) {
            todo.completed = completed;
        }

        // Save the updated todo
        const updatedTodo = await todo.save();

        res.json(updatedTodo);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
