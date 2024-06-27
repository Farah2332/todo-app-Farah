const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors'); // Import CORS middleware

dotenv.config();

const app = express();
app.use(express.json());

// Allow all origins for testing purposes; tighten this in production
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specified methods
    allowedHeaders: ['Content-Type', 'Authorization', 'user-id'], // Add 'user-id' to allowed headers
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure
    });

// Routes without auth middleware
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
