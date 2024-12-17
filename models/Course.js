import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: String,
    category: String,
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor' },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }]
});

export const Course = mongoose.model('Course', courseSchema);