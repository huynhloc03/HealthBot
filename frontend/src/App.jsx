import React, { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);  
  const [botTypingMessage, setBotTypingMessage] = useState(''); // Store the progressively typed message

  // Reference for the conversation end to scroll to the bottom
  const conversationEndRef = useRef(null);

  // Fetch saved conversations from the backend
  const fetchConversations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/conversation');
      const data = await response.json();
      setConversation(data);  // Update the conversation state with the fetched data
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);  // Stop the loading state after the fetch is complete
    }
  };

  // Scroll to the bottom of the conversation when a new message is added
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, botTypingMessage]);

  // Fetch the conversations once when the component mounts
  useEffect(() => {
    fetchConversations();  // Fetch saved conversations from backend
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Function to progressively type out the bot's message
  const typeBotMessage = (botMessage) => {
    let typedMessage = '';
    let index = 0;
  
    const typingInterval = setInterval(() => {
      typedMessage += botMessage[index];
      setConversation((prevConversation) => {
        const lastMessage = prevConversation[prevConversation.length - 1];
        // Check if the last message is from the bot, and update it
        if (lastMessage && lastMessage.sender === 'bot') {
          const updatedConversation = [...prevConversation];
          updatedConversation[updatedConversation.length - 1].botResponse = typedMessage;
          return updatedConversation;
        } else {
          return [...prevConversation, { sender: 'bot', botResponse: typedMessage }];
        }
      });
  
      index++;
      if (index >= botMessage.length) {
        clearInterval(typingInterval);
        setIsTyping(false); // Finish typing
      }
    }, 25); // Adjust the typing speed here (25ms per character)
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
        const userMessage = input;

        // Update conversation immediately in a variable instead of relying on state
        const updatedConversation = [
            ...conversation,
            { sender: 'user', userMessage },  // Add the user's message to the conversation array
        ];

        // Update the state for the UI to reflect the new user message
        setConversation(updatedConversation);

        // Debug: Log the conversation before sending it to the backend
        console.log("Sending conversation to backend:", updatedConversation);

        setInput('');
        setIsTyping(true);

        try {
            // Send the updated conversation array to the backend, along with the user's new message
            const response = await fetch('http://localhost:5000/api/conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userMessage, conversation: updatedConversation }),  // Pass conversation and userMessage
            });

            const data = await response.json();

            // Start typing the bot's response progressively (without adding it twice)
            await typeBotMessage(data.botResponse);

            setIsTyping(false);
        } catch (error) {
            console.error('Error getting AI response:', error);
            setIsTyping(false);
        }
    }
};



  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Clear the conversation when the trash icon is clicked
  const clearConversation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/conversation', {
        method: 'DELETE',
      });
      if (response.ok) {
        setConversation([]);  // Reset conversation on frontend
      } else {
        console.error('Failed to clear conversations');
      }
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 space-y-4 bg-gray-800 rounded-lg shadow-lg">
        {/* Form for handling submission */}
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="w-full p-4 text-lg rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your symptoms..."
          />
        </form>

        {/* Conditionally render conversation log */}
        {conversation.length > 0 && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg w-full max-h-80 overflow-y-auto space-y-3">
            {conversation.map((message, index) => (
              <div key={index}>
                {/* Display User Message */}
                {message.userMessage && (
                  <div className="message p-3 rounded-lg w-fit max-w-xs ml-auto mb-2 bg-blue-500 text-white text-right">
                    {message.userMessage}
                  </div>
                )}

                {/* Display Bot Response */}
                {message.botResponse && (
                  <div className="message p-3 rounded-lg w-fit max-w-xs mr-auto mb-2 bg-gray-300 text-black">
                    {message.botResponse}
                  </div>
                )}
              </div>
            ))}

            {/* Display the progressive bot typing message */}
            {botTypingMessage && (
              <div className="message p-3 rounded-lg w-fit max-w-xs mr-auto mb-2 bg-gray-300 text-black">
                {botTypingMessage}
              </div>
            )}

            {isTyping && (
              <div className="mr-auto text-gray-400">Bot is typing...</div>
            )}

            <div ref={conversationEndRef} />
          </div>
        )}

        {/* Conditionally render the trash icon if there's a conversation */}
        {conversation.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              className="text-red-500 hover:text-red-700 focus:outline-none"
              onClick={clearConversation}
            >
              <span className="material-icons" style={{ fontSize: '24px' }}>
                delete
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
