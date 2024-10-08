# Medical Consultation AI (HealthLLama)

Welcome to the **Medical Consultation AI (HealthLLama)** project! This project leverages a Large Language Model (LLM) to provide users with a conversational AI that simulates a doctor. Users can describe their symptoms, and the chatbot will offer a series of questions and advice based on their inputs. The app stores conversations and uses the context of previous interactions to help with follow-up questions.

## Features

- **Real-time Consultation**: Users can interact with the AI, asking questions or describing symptoms.
- **Contextual Awareness**: The AI retains context during the conversation to ask follow-up questions or provide better advice.
- **Backend with MongoDB**: All conversations are stored in a MongoDB database, allowing the app to fetch past conversations.
- **AI-Powered by Groq**: Utilizes Groq API for LLM-based responses.
  
## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **AI Integration**: Groq API

## Prerequisites

Before running this project, ensure that you have:

- **Node.js** (v16 or higher) installed.
- **MongoDB** (You can use MongoDB Atlas or a local instance).
- A **Groq API Key** (for the AI responses).

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/huynhloc/HealthBot.git
cd medical-consultation-chatbot

```
### 2. Backend Setup
```
cd backend
```
Install dependencies:
  
```
npm install
```
Create a .env file by copying from the .env.example file:

```
cp .env.example .env
```
Update the .env file with your MongoDB URI and Groq API Key:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
GROQ_API_KEY=your-groq-api-key-here
PORT=5000
```
### 3. Frontend Setup
Navigate to the frontend directory:
```
cd frontend
```
Install dependencise:
```
npm install
```

### 4. Run the App
From the backend directory, run:
```
npm start
```

From the frontend directory, run:
```
npm start
```
### 5. Access the App 
Once both the frontend and backend servers are running, open your browser and go to:
```
http://localhost:5000
```

## Testing
Once the app is running, you can:
- **Enter Symptons**: Type in the symptoms you're experiencing.
- **Interact with the AI**: The AI will respond, asking follow-up questions.
- **Clear Conversation**: Use the trash icon to clear the conversation.
## Contributing
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss the changes you'd like to make.



