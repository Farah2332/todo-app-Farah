import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
}

const userSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email uniqueness
    },
    password: {
        type: String,
        required: true,
    },
});

// Indexes for User schema
userSchema.index({ email: 1 });  // Index on email for faster user lookup

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
