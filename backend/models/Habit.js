// backend/models/Habit.js

const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Please add a habit name'],
        trim: true,
    },
    description: {
        type: String,
        required: false, 
    },
    completedDates: {
        type: [Date],
        default: [],
    },
}, {
    timestamps: true,
});

const Habit = mongoose.model('Habit', HabitSchema);
module.exports = Habit;