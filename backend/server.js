const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const conversationRoutes = require('./routes/conversationRoutes'); // Import your conversation routes

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use conversation routes
app.use('/api/conversation', conversationRoutes); // Ensure the route is correctly registered

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
