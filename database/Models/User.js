import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    img: {
        type: String
    },
    google: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model("User", userSchema);