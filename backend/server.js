// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Define API Routes
app.use('/api/auth', require('./routes/auth')); // This will now work

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});