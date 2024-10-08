const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const Groq = require('groq-sdk');
const Conversation = require('../models/conversationModel');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getAIResponse = async (conversation, userMessage) => {
    try {
      // Add system message to define the AI's role as a medical assistant
      const systemMessage = {
        role: 'system',
        content: "You are a doctor name Dr. HealthLLama providing medical consultation. Remember the full conversation context and ask detailed questions based on previous responses. Make sure the paitent don't talk about random stuff not related to either their symptons or medical. If the patient don't talk about their symptoms within 3 to 4 time of asking then you can offer them a good bye.  Also, try to ask one or two questions at a time. Also, when you come to a conclusion, try your best to provide solution or remedy but if you can't just tell the paitent to seek professional assitance related to their sympton, then make sure to ask the patient if they have any questions or concerns. If they don't, you can end the conversation. If they do, you can continue the conversation.",
      };
  
      // Map conversation into the required format for the AI
      const messages = conversation.length > 0
        ? [
            systemMessage,  // Add system role
            ...conversation.map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.sender === 'user' ? msg.userMessage : msg.botResponse,
            })),
            { role: 'user', content: userMessage }  // Add the current user's message
          ]
        : [systemMessage, { role: 'user', content: userMessage }];  // If it's the first message, start conversation with system and user message
  
      // Debug: Log the messages being sent to the AI
      console.log("Messages being sent to Groq AI:", JSON.stringify(messages, null, 2));
  
      const response = await groq.chat.completions.create({
        messages,  // Pass conversation and userMessage
        model: "llama3-8b-8192",
      });
  
  
      const botResponse = response.choices[0]?.message?.content || '';
      if (!botResponse) {
        console.error("Invalid or empty botResponse");
      }
  
      return botResponse;
    } catch (error) {
      console.error('Error fetching AI response from Groq:', error);
      return null;
    }
  };
  
  


// Fetch all conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ createdAt: 1 });
    res.status(200).json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Save a new conversation and interact with Groq AI
const saveConversation = async (req, res) => {
    const { userMessage, conversation } = req.body;
  
    console.log(`Received userMessage: ${userMessage}`);
    console.log(`Received conversation:`, conversation);
  
    // Make sure conversation is an array (in case of an empty or undefined conversation)
    const convoHistory = Array.isArray(conversation) ? conversation : [];
  
    // Get AI response from Groq
    const botResponse = await getAIResponse(convoHistory, userMessage);  // Pass both conversation and userMessage
  
    if (!botResponse) {
      console.error('Error: botResponse is empty or undefined');
      return res.status(500).json({ error: 'Failed to generate a response from the AI' });
    }
  
    console.log(`Generated botResponse: ${botResponse}`);
  
    try {
      const newConversation = new Conversation({ userMessage, botResponse });
      const savedConversation = await newConversation.save();
      res.status(201).json(savedConversation);
    } catch (error) {
      console.error('Error saving conversation:', error);
      res.status(500).json({ error: 'Failed to save conversation' });
    }
  };
  

// Delete all conversations
const deleteConversations = async (req, res) => {
  try {
    await Conversation.deleteMany({});
    res.status(200).json({ message: 'All conversations cleared' });
  } catch (err) {
    console.error('Error clearing conversations:', err);
    res.status(500).json({ error: 'Failed to clear conversations' });
  }
};

module.exports = { getConversations, saveConversation, deleteConversations };
