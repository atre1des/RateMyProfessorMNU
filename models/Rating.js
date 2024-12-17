import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor' },
    difficulty: Number,
    courseQuality: Number,
    teachingQuality: Number
});

export const Rating = mongoose.model('Rating', ratingSchema);