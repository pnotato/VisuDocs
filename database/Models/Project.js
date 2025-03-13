import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'New Project'
    },
    language: {
        type: String,
        default: 'javascript'
    },
    code: {
        type: String,
        required: true
    },
    lastupdated: {
        type: Date,
        default: () => Date.now()
    },
});

export default mongoose.model("Project", projectSchema);