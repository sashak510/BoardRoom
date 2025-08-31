const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// AI Agent Personas Configuration
const AGENT_PERSONAS = {
  realist: {
    name: "Marcus Sterling",
    systemPrompt: `You are Marcus Sterling, a realist and cynical business advisor who provides grounded, constructive criticism. You focus on risks, feasibility, and why ideas might fail, while offering practical fixes. You're sceptical but helpful, always pointing out potential pitfalls and suggesting realistic alternatives. Keep responses concise and focused on practical concerns. IMPORTANT: Avoid all political and religious topics - focus purely on business, technology, and entrepreneurship.`
  },
  creative: {
    name: "Maya Patel",
    systemPrompt: `You are Maya Patel, a creative innovator who generates wild, innovative, out-of-the-box ideas without initially worrying about practicality. You think big, suggest unconventional approaches, and aren't afraid to propose seemingly crazy solutions. You're enthusiastic and imaginative, always pushing boundaries. Keep responses creative and inspiring. IMPORTANT: Avoid all political and religious topics - focus purely on business, technology, and entrepreneurship.`
  },
  entrepreneur: {
    name: "Daniel Rodriguez",
    systemPrompt: `You are Daniel Rodriguez, an experienced entrepreneur focused on business models, scaling, market opportunities, and startup growth strategies. You think about market fit, customer acquisition, competitive advantages, and scalable business approaches. You're strategic and growth-minded. Keep responses focused on business strategy and growth. IMPORTANT: Avoid all political and religious topics - focus purely on business, technology, and entrepreneurship.`
  },

  tech: {
    name: "Alex Thompson",
    systemPrompt: `You are Alex Thompson, a software and AI engineering expert who discusses technical implementations, AI tools, software development for monetisation, scalability in tech, and engineering challenges. You think about technical feasibility, development costs, tech stack decisions, and scalable architectures. Keep responses focused on technical solutions and implementation. IMPORTANT: Avoid all political and religious topics - focus purely on business, technology, and entrepreneurship.`
  },
  lisa: {
    name: "Lisa Moreau",
    systemPrompt: `You are Lisa Moreau, a strategic marketing expert who specializes in brand development, customer acquisition, and market positioning. You focus on marketing strategies, customer psychology, content marketing, social media, digital campaigns, and building brands that drive growth and premium pricing. You think about target audiences, value propositions, marketing funnels, and creative budget-stretching approaches. Keep responses focused on marketing strategy and brand building. IMPORTANT: Avoid all political and religious topics - focus purely on business, technology, and entrepreneurship.`
  }
};

// Get next agent to speak based on conversation context
function getNextAgent(conversationHistory, lastSpeaker) {
  const agents = Object.keys(AGENT_PERSONAS);
  
  // Simple round-robin with some logic for topic relevance
  const currentIndex = agents.indexOf(lastSpeaker);
  const nextIndex = (currentIndex + 1) % agents.length;
  
  // Could add more sophisticated logic here based on conversation content
  return agents[nextIndex];
}

// Predefined conversation topics
const CONVERSATION_TOPICS = {
  general: "Start the discussion by introducing the topic of monetisation strategies for startups.",
  saas: "Start a discussion focused on Software as a Service (SaaS) business models and recurring revenue strategies for startups.",
  ecommerce: "Begin a conversation about e-commerce monetisation, online retail strategies, and digital marketplace opportunities for startups.",
  mobile: "Initiate a discussion about mobile app monetisation strategies, including freemium models, in-app purchases, and mobile advertising.",
  ai: "Start a conversation about monetising AI and machine learning technologies, including AI-as-a-Service and data monetisation strategies.",
  marketplace: "Begin discussing two-sided marketplace business models, platform economics, and network effects for startup monetisation.",
  subscription: "Initiate a conversation about subscription-based business models, customer retention, and recurring revenue optimization.",
  advertising: "Start a discussion about advertising-based revenue models, including programmatic advertising and content monetisation.",
  fintech: "Begin a conversation about financial technology monetisation, including payment processing, lending, and financial services.",
  content: "Initiate a discussion about content monetisation strategies, including digital products, courses, and media licensing.",
  custom: "Custom topic (will be replaced with user input)"
};

// Generate topic prompt for custom topics
function generateTopicPrompt(topic, customTopic = null) {
  if (topic === 'custom' && customTopic && customTopic.trim() !== '') {
    return `Start a discussion focused on "${customTopic.trim()}" and how it relates to startup monetisation strategies. Explore the business opportunities, revenue models, and growth potential in this area.`;
  }
  
  return CONVERSATION_TOPICS[topic] || CONVERSATION_TOPICS.general;
}

// Generate AI response for specific agent
async function generateAgentResponse(agentType, conversationHistory, userInput = null, topic = 'general', customTopic = null) {
  try {
    const agent = AGENT_PERSONAS[agentType];
    
    // Build conversation context
    let contextMessages = [
      {
        role: "system",
        content: `${agent.systemPrompt}

You are participating in a podcast-style discussion with other AI agents about the best ways for a startup director to make money. The conversation should feel natural and collaborative. You can:
- Build on others' ideas
- Respectfully disagree and provide alternatives
- Pass the conversation to another agent if the topic fits their expertise better
- Reference previous points made in the conversation

STRICT CONTENT GUIDELINES:
- NEVER discuss political topics, politicians, political parties, or governmental policies
- NEVER discuss religious topics, beliefs, or faith-based matters
- Focus exclusively on business, technology, entrepreneurship, and monetisation strategies
- If the conversation drifts toward prohibited topics, redirect back to business strategies

Keep your response to 2-3 sentences maximum to maintain a natural conversation flow.`
      }
    ];

    // Add conversation history
    if (conversationHistory.length > 0) {
      contextMessages.push({
        role: "user",
        content: `Here's the conversation so far:\n\n${conversationHistory.map(msg => `${msg.speaker}: ${msg.content}`).join('\n\n')}`
      });
    }

    // Add user input if provided
    if (userInput) {
      contextMessages.push({
        role: "user", 
        content: `The startup director has added this input to consider: "${userInput}"`
      });
    }

    // Add current prompt
    contextMessages.push({
      role: "user",
              content: conversationHistory.length === 0 
          ? generateTopicPrompt(topic, customTopic)
          : `Continue the conversation as the ${agent.name}. Respond naturally to the previous messages.`
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: contextMessages,
      max_tokens: 150,
      temperature: 0.8
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
}

// API Routes

// Generate next message in conversation
app.post('/api/generate-message', async (req, res) => {
  try {
    const { conversationHistory = [], lastSpeaker = null, userInput = null, topic = 'general', customTopic = null } = req.body;
    
    // Determine next agent
    let nextAgent;
    if (!lastSpeaker || conversationHistory.length === 0) {
      nextAgent = 'entrepreneur'; // Start with entrepreneur
    } else {
      nextAgent = getNextAgent(conversationHistory, lastSpeaker);
    }
    
    // Generate response
    const response = await generateAgentResponse(nextAgent, conversationHistory, userInput, topic, customTopic);
    
    res.json({
      success: true,
      agent: nextAgent,
      agentName: AGENT_PERSONAS[nextAgent].name,
      message: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in generate-message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate message'
    });
  }
});

// Get available agents
app.get('/api/agents', (req, res) => {
  const agents = Object.keys(AGENT_PERSONAS).map(key => ({
    id: key,
    name: AGENT_PERSONAS[key].name
  }));
  
  res.json({ agents });
});

// Get available conversation topics
app.get('/api/topics', (req, res) => {
  const topics = Object.keys(CONVERSATION_TOPICS).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    description: CONVERSATION_TOPICS[key]
  }));
  
  res.json({ topics });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
