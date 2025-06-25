// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false,
    },
});

// This pre-save hook for hashing the password is correct.
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// This line creates the "factory" (the Model) from the "blueprint" (the Schema)
const User = mongoose.model('User', UserSchema);

// --- THIS IS THE FIX ---
// We must export the Model, which has the .findOne() function.
module.exports = User;