// backend/routes/auth.js

const express = require('express');
const router = express.Router();

// Import the controller functions
const { signup, login } = require('../controllers/authController');

// Define the routes
router.post('/signup', signup);
router.post('/login', login);

// Export the router
module.exports = router;