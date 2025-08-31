# 🏛️ AI Startup Advisory BoardRoom

A web application that simulates a live boardroom meeting between AI advisor personas, discussing monetisation strategies for startup directors. The advisors provide diverse perspectives while maintaining focus on business, technology, and entrepreneurship.

## ✨ Features

### AI Agent Personas
- **🤔 Realist/Cynical Agent**: Provides grounded, constructive criticism and risk assessment
- **💡 Creative Agent**: Generates innovative, out-of-the-box ideas and unconventional approaches  
- **🚀 Entrepreneurial Agent**: Focuses on business strategy, scaling, and market opportunities
- **💰 Finance Expert Agent**: Analyses funding, revenue streams, and financial projections
- **⚙️ Software/AI Engineering Expert**: Discusses technical implementation and scalability

### Core Functionality
- **Boardroom Landing Page**: Immersive entry experience with animated boardroom background
- **Live Conversation Simulation**: AI agents take turns speaking with natural conversation flow
- **Animated Avatars**: Each agent has a unique avatar that appears when speaking with live typing effects
- **Topic Selection**: Choose from predefined topics or enter your own custom topic to focus the discussion
- **Speech Bubbles**: Real-time typing animation in speech bubbles for a natural conversation feel
- **Pause & Input**: Pause conversations to add user input that gets integrated into the discussion
- **Conversation Logging**: Automatic saving of conversations with browseable history
- **Content Filtering**: Strict avoidance of political and religious topics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd "/Users/sashakarniyuk/Project 2025/BoardRoom"
   ```

2. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```
   
   **Note**: The application includes the API key in the code for demonstration purposes, but you should use environment variables in production.

4. **Start the application**:
   ```bash
   npm run dev
   ```

   This starts both the backend server (port 5000) and React frontend (port 3000).

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
BoardRoom/
├── server/
│   └── index.js              # Express.js backend with OpenAI integration
├── client/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API communication
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── App.tsx           # Main application component
│   └── public/
├── package.json              # Root package.json with scripts
└── README.md
```

## 🎮 How to Use

1. **Enter the Boardroom**: Click the animated "Enter the Boardroom" button on the landing page
2. **Choose a Topic**: Select from predefined topics (SaaS, E-commerce, Mobile, AI, etc.) or choose "Custom" to enter your own topic
3. **Start a Conversation**: Click "Start Conversation" to begin a new discussion on your chosen topic
4. **Watch the Live Discussion**: AI agents will take turns discussing monetisation strategies with animated avatars and speech bubbles
5. **Add Your Input**: Click "Pause & Add Input" to contribute to the conversation
6. **Save Conversations**: Click "Stop & Save" to save the conversation to your logs
7. **View History**: Use "Show Logs" to browse previous conversations
8. **Return to Boardroom**: Use "← Back to Boardroom" to return to the landing page

### Available Topics
- **General**: General startup monetisation strategies
- **SaaS**: Software as a Service business models
- **E-commerce**: Online retail and marketplace strategies
- **Mobile**: Mobile app monetisation (freemium, in-app purchases)
- **AI**: AI and machine learning monetisation
- **Marketplace**: Two-sided marketplace business models
- **Subscription**: Subscription-based revenue models
- **Advertising**: Ad-based revenue strategies
- **Fintech**: Financial technology monetisation
- **Content**: Digital content and media monetisation
- **Custom**: Enter your own topic (e.g., "sustainable fashion", "blockchain gaming")

## 🔧 Technical Details

### Backend (Node.js/Express)
- OpenAI GPT-4 integration for AI agent responses
- RESTful API for message generation
- Content filtering to avoid political/religious topics
- Persona-based prompting system

### Frontend (React/TypeScript)
- Real-time conversation display with typing indicators
- Animated avatars with speech bubbles and live typing effects
- Local storage for conversation persistence
- Responsive UI with modern design
- Component-based architecture

### Key API Endpoints
- `POST /api/generate-message` - Generate next AI agent response
- `GET /api/agents` - List available agents
- `GET /api/health` - Health check

## 🎯 Content Guidelines

The application enforces strict content guidelines:
- ❌ **No Political Topics**: No discussions about politicians, political parties, or governmental policies
- ❌ **No Religious Topics**: No discussions about religious beliefs or faith-based matters
- ✅ **Business Focus**: Exclusively focuses on business, technology, entrepreneurship, and monetisation strategies

## 🛠️ Development Scripts

```bash
npm run dev          # Start both backend and frontend in development mode
npm run server       # Start only the backend server
npm run client       # Start only the React frontend
npm run build        # Build the React app for production
npm run install-all  # Install dependencies for both backend and frontend
```

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🔐 Security Notes

- API keys should be stored in environment variables in production
- Conversations are stored locally in browser storage
- No sensitive data is transmitted to external services beyond OpenAI

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your OpenAI API key is correctly set in the environment variables
2. **Port Conflicts**: If port 5000 or 3000 are in use, update the PORT in `.env` or stop conflicting services
3. **Network Errors**: Check that both backend and frontend are running

### Error Messages
- "Failed to generate message": Check OpenAI API key and internet connection
- "Server health check failed": Ensure backend server is running on port 5000

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using React, Node.js, and OpenAI GPT-4**
