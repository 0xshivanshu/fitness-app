// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth')); 

// --- ADD THIS ONE LINE ---
app.use('/api/habits', require('./routes/habits'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});