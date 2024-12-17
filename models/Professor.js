import mongoose from 'mongoose';

const professorSchema = new mongoose.Schema({
    name: String,
    department: String,
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

export const Professor = mongoose.model('Professor', professorSchema); 