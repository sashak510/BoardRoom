import React, { useEffect, useRef, useState } from 'react';
import { ConversationMessage } from '../types';
import { generateMessage } from '../services/api';
import './ConversationPanel.css';

interface ConversationPanelProps {
  messages: ConversationMessage[];
  isPlaying: boolean;
  isPaused: boolean;
  lastSpeaker: string | null;
  onNewMessage: (message: ConversationMessage) => void;
  isViewingLog: boolean;
  selectedTopic: string;
  customTopic: string;
  layoutMode?: string;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  isPlaying,
  isPaused,
  lastSpeaker,
  onNewMessage,
  isViewingLog,
  selectedTopic,
  customTopic,
  layoutMode
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle conversation generation with proper timing
  useEffect(() => {
    if (!isPlaying || isPaused || isViewingLog || isGenerating) return;

    const generateNextMessage = async () => {
      setIsGenerating(true);
      setError(null);

      try {
        // Get user input if the last message was from user
        const lastMessage = messages[messages.length - 1];
        const userInput = lastMessage?.agentId === 'user' ? lastMessage.content : null;

        const response = await generateMessage(messages, lastSpeaker, userInput, selectedTopic, selectedTopic === 'custom' ? customTopic : null);

        if (response.success && response.agent && response.agentName && response.message) {
          const newMessage: ConversationMessage = {
            id: Date.now().toString(),
            agentId: response.agent,
            agentName: response.agentName,
            content: response.message,
            timestamp: response.timestamp || new Date().toISOString()
          };

          onNewMessage(newMessage);
        } else {
          setError('Failed to generate message');
        }
      } catch (err) {
        console.error('Error generating message:', err);
        setError('Error generating message. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    generateNextMessage();
  }, [isPlaying, isPaused, isViewingLog, messages, lastSpeaker, onNewMessage, isGenerating, selectedTopic, customTopic]);



  const getAgentColor = (agentId: string): string => {
    const colors: { [key: string]: string } = {
      'realist': '#e74c3c',
      'creative': '#9b59b6',
      'entrepreneur': '#3498db',
      'finance': '#f39c12',
      'tech': '#2ecc71',
      'user': '#34495e'
    };
    return colors[agentId] || '#95a5a6';
  };

  const getAgentIcon = (agentId: string): string => {
    const icons: { [key: string]: string } = {
      'realist': '🤔',
      'creative': '💡',
      'entrepreneur': '🚀',
      'finance': '💰',
      'tech': '⚙️',
      'user': '👤'
    };
    return icons[agentId] || '🤖';
  };

  return (
    <div className="conversation-panel">
      <div className="conversation-header">
        <h2>
          {isViewingLog ? '📖 Conversation Log' : '🏛️ Live Boardroom Meeting'}
        </h2>
        {isPlaying && !isPaused && !isViewingLog && (
          <div className="live-indicator">
            <span className="live-dot"></span>
            LIVE
          </div>
        )}
      </div>



      <div className="messages-container">
        {messages.length === 0 && !isViewingLog && (
          <div className="conversation-history-placeholder">
            <p>💬 Start a conversation to see the discussion history...</p>
          </div>
        )}

        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.agentId === 'user' ? 'user-message' : 'agent-message'}`}
          >
            <div className="message-header">
              <span 
                className="agent-icon"
                style={{ color: getAgentColor(message.agentId) }}
              >
                {getAgentIcon(message.agentId)}
              </span>
              <span className="agent-name" style={{ color: getAgentColor(message.agentId) }}>
                {message.agentName}
              </span>
              <span className="timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="message agent-message generating">
            <div className="message-header">
              <span className="agent-icon">🤖</span>
              <span className="agent-name">AI Agent</span>
              <span className="timestamp">Thinking...</span>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConversationPanel;
