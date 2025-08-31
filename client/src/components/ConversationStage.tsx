import React, { useState, useEffect } from 'react';
import AvatarDisplay from './AvatarDisplay';
import { ConversationMessage } from '../types';
import './ConversationStage.css';

interface ConversationStageProps {
  currentMessage: ConversationMessage | null;
  isGenerating: boolean;
  onTypingComplete: () => void;
}

// All available agents for display
const ALL_AGENTS = [
  { id: 'realist', name: 'Realist/Cynical Agent' },
  { id: 'creative', name: 'Creative Agent' },
  { id: 'entrepreneur', name: 'Entrepreneurial Agent' },
  { id: 'finance', name: 'Finance Expert Agent' },
  { id: 'tech', name: 'Software/AI Engineering Expert Agent' }
];

const ConversationStage: React.FC<ConversationStageProps> = ({
  currentMessage,
  isGenerating,
  onTypingComplete
}) => {
  const [isTyping, setIsTyping] = useState(false);

  // Start typing when new message arrives
  useEffect(() => {
    if (currentMessage && !isGenerating) {
      setIsTyping(true);
    }
  }, [currentMessage, isGenerating]);

  const handleTypingComplete = () => {
    setIsTyping(false);
    onTypingComplete();
  };

  return (
    <div className="conversation-stage">
      <div className="stage-background">
        <div className="stage-lights"></div>
      </div>
      
      <div className="avatars-container">
        {ALL_AGENTS.map((agent) => {
          const isActive = currentMessage?.agentId === agent.id && !isGenerating;
          
          return (
            <AvatarDisplay
              key={agent.id}
              agentId={agent.id}
              agentName={agent.name}
              message={currentMessage?.content || ''}
              isActive={isActive}
              isTyping={isTyping && isActive}
              onTypingComplete={handleTypingComplete}
            />
          );
        })}
      </div>

      {isGenerating && (
        <div className="generating-indicator">
          <div className="thinking-bubble">
            <div className="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="thinking-text">AI agents are thinking...</div>
          </div>
        </div>
      )}

      {!currentMessage && !isGenerating && (
        <div className="stage-welcome">
          <h3>🏛️ Welcome to the AI Startup Advisory Boardroom!</h3>
          <p>Choose a topic and start the meeting to see the advisors come to life</p>
        </div>
      )}
    </div>
  );
};

export default ConversationStage;
