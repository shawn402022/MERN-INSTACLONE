import mongoose from 'mongoose';

const userSchema = newmongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }]

    },
    { timeStamps: true }
)


export const User = mongoose.model('User', userSchema)
