import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.set('strictQuery', false);


// CORS Configuration
const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:5173', // Change to your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization', 'user-id'], // Add allowed headers
};

app.use(cors(corsOptions));

// MongoDB Connection
// MongoDB Connection
const mongoURI = process.env.MONGO_URI as string;

mongoose.connect(mongoURI)
.then(() => {
    console.log('MongoDB connected');
    // Routes
    app.use('/api/todos', todoRoutes);
    app.use('/api/users', userRoutes);

    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit with failure
});
