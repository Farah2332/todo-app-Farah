const Todo = require('../models/Todo');

// Get all todos for a specific user
exports.getTodos = async (req, res) => {
    try {
        const userId = req.headers['user-id']; // Get user ID from headers
        const todos = await Todo.find({ user: userId });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new todo
exports.addTodo = async (req, res) => {
    const { text } = req.body;
    try {
        const userId = req.headers['user-id']; // Get user ID from headers
        const newTodo = new Todo({
            text,
            user: userId
        });
        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a todo
exports.updateTodo = async (req, res) => {
    try {
        const userId = req.headers['user-id']; // Get user ID from headers
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        if (todo.user.toString() !== userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        todo.text = req.body.text || todo.text;
        todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    try {
        const userId = req.headers['user-id']; // Get user ID from headers
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        if (todo.user.toString() !== userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await todo.remove();
        res.json({ message: 'Todo removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
