const mongoose = require('mongoose');

// Define the schema for conversation
const conversationSchema = new mongoose.Schema({
  userMessage: { type: String, required: true },
  botResponse: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the model and export it
module.exports = mongoose.model('Conversation', conversationSchema);
