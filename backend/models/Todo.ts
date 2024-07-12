import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITodo extends Document {
    text: string;
    email: string;
    completed: boolean;
    createdAt: Date;
}

const todoSchema: Schema<ITodo> = new Schema({
    text: { type: String, required: true },
    email: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

// Indexes for Todo schema
todoSchema.index({ email: 1 });  // Index on email for faster user-specific queries
todoSchema.index({ completed: 1 });  // Index on completed status for filtering

const Todo: Model<ITodo> = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo;
