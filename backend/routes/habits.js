// backend/routes/habits.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Habit = require('../models/Habit');

// --- AUTHENTICATION LOGIC (This part is correct and stays the same) ---
const authFunction = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// --- GET HABITS HANDLER (This part is correct and stays the same) ---
const getHabitsHandler = async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user.id });
        res.json(habits);
    } catch (err) {
        console.error("Database error in GET habits route:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- NEW: CREATE HABIT HANDLER ---
// This is the new logic that handles the POST request.
const createHabitHandler = async (req, res) => {
    const { name, description } = req.body;

    // Basic validation
    if (!name) {
        return res.status(400).json({ msg: 'Please enter a name for the habit' });
    }

    try {
        const newHabit = new Habit({
            name,
            description,
            user: req.user.id // Assign to the logged-in user
        });

        const habit = await newHabit.save(); // Save to the database
        res.status(201).json(habit); // Respond with the created habit
    } catch (err) {
        console.error("Database error in POST habits route:", err.message);
        res.status(500).send('Server Error');
    }
};
const toggleHabitCompletionHandler = async (req, res) => {
    try {
        // Find the habit by its ID, ensuring it belongs to the logged-in user
        const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });

        if (!habit) {
            return res.status(404).json({ msg: 'Habit not found' });
        }

        // Get today's date at the start of the day (midnight) for consistent comparisons
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if a completion record for today already exists
        const completedIndex = habit.completedDates.findIndex(date => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });

        if (completedIndex > -1) {
            // If it exists, remove it (un-mark the habit)
            habit.completedDates.splice(completedIndex, 1);
        } else {
            // If it doesn't exist, add it (mark the habit as done)
            habit.completedDates.push(today);
        }

        // Save the updated habit back to the database
        await habit.save();
        res.json(habit); // Send the updated habit back

    } catch (err) {
        console.error("Error toggling habit:", err.message);
        res.status(500).send('Server Error');
    }
};
const deleteHabitHandler = async (req, res) => {
    try {
        // Find the habit by its ID to ensure it exists and belongs to the user.
        const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });

        if (!habit) {
            return res.status(404).json({ msg: 'Habit not found' });
        }

        // Mongoose 5+ findOneAndDelete is a great choice here.
        await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        res.json({ msg: 'Habit removed' });

    } catch (err) {
        console.error("Error deleting habit:", err.message);
        res.status(500).send('Server Error');
    }
};
const editHabitHandler = async (req, res) => {
    // Get the new name and description from the request body
    const { name, description } = req.body;

    // Basic validation
    if (!name) {
        return res.status(400).json({ msg: 'Habit name cannot be empty' });
    }

    try {
        // Find the habit by its ID and ensure it belongs to the logged-in user
        let habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });

        if (!habit) {
            return res.status(404).json({ msg: 'Habit not found' });
        }

        // Update the habit's fields with the new data
        habit.name = name;
        habit.description = description;

        // Save the updated habit back to the database
        const updatedHabit = await habit.save();

        res.json(updatedHabit); // Respond with the updated habit

    } catch (err) {
        console.error("Error editing habit:", err.message);
        res.status(500).send('Server Error');
    }
};

const getHabitProgressHandler = async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });

        if (!habit) {
            return res.status(404).json({ msg: 'Habit not found' });
        }

        // Calculate the date 7 days ago from today
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Filter the completedDates to find only the ones within the last 7 days
        const completionsLast7Days = habit.completedDates.filter(date => {
            return new Date(date) >= sevenDaysAgo;
        });

        // Respond with the count
        res.json({
            completionCount: completionsLast7Days.length
        });

    } catch (err) {
        console.error("Error getting habit progress:", err.message);
        res.status(500).send('Server Error');
    }
};


// --- DEFINE THE ROUTES ---
router.get('/', authFunction, getHabitsHandler);
router.post('/', authFunction, createHabitHandler);
router.put('/:id/mark', authFunction, toggleHabitCompletionHandler);
router.delete('/:id', authFunction, deleteHabitHandler);
router.put('/:id', authFunction, editHabitHandler);

// --- NEW: THE GET ROUTE for a habit's progress ---
router.get('/:id/progress', authFunction, getHabitProgressHandler);


module.exports = router;