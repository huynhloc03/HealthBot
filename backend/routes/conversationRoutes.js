const express = require('express');
const router = express.Router();
const { getConversations, saveConversation, deleteConversations } = require('../controllers/conversationController');

// Define routes
router.get('/', getConversations);  // Fetch all conversations
router.post('/', saveConversation); // Save a conversation
router.delete('/', deleteConversations); // Delete all conversations

module.exports = router;
