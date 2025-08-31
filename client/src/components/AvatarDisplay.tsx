import React, { useState, useEffect } from 'react';
import './AvatarDisplay.css';

interface AvatarDisplayProps {
  agentId: string;
  agentName: string;
  message: string;
  isActive: boolean;
  isTyping: boolean;
  onTypingComplete: () => void;
}

// Avatar mapping based on agent IDs and avatar filenames
const AVATAR_MAPPING: { [key: string]: string } = {
  'realist': '/avatars/Cynic.png',
  'creative': '/avatars/Creative.png',
  'entrepreneur': '/avatars/Entrepreneurial.png',
  'tech': '/avatars/Coder.png',
  'lisa': '/avatars/Lisa.png',
  'user': '' // No avatar for user
};

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  agentId,
  agentName,
  message,
  isActive,
  isTyping,
  onTypingComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Typing speed (milliseconds per character)
  const TYPING_SPEED = 30; // Adjust for natural conversation speed

  // Reset when message changes
  useEffect(() => {
    if (isTyping && isActive) {
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, [message, isTyping, isActive]);

  // Live typing effect
  useEffect(() => {
    if (!isTyping || !isActive) return;

    if (currentIndex < message.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, TYPING_SPEED);

      return () => clearTimeout(timer);
    } else if (currentIndex === message.length && displayedText === message) {
      // Typing complete, add a small delay before notifying parent
      const completeTimer = setTimeout(() => {
        onTypingComplete();
      }, 500);

      return () => clearTimeout(completeTimer);
    }
  }, [currentIndex, message, isTyping, isActive, displayedText, onTypingComplete]);

  const avatarSrc = AVATAR_MAPPING[agentId];

  // Don't render if no avatar for this agent
  if (!avatarSrc || agentId === 'user') {
    return null;
  }

  return (
    <div className={`avatar-display ${isActive ? 'active' : ''}`}>
      <div className="avatar-container">
        <img 
          src={avatarSrc} 
          alt={agentName}
          className={`avatar-image ${isActive ? 'speaking' : ''}`}
          onError={(e) => {
            console.error(`Failed to load avatar for ${agentId}:`, avatarSrc);
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {isActive && (
          <div className="speech-bubble">
            <div className="speech-bubble-content">
              <div className="agent-name-bubble">{agentName}</div>
              <div className="message-text">
                {isTyping ? displayedText : message}
                {isTyping && <span className="typing-cursor">|</span>}
              </div>
            </div>
            <div className="speech-bubble-tail"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarDisplay;
