import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import { AGENT_PERSONAS } from '../data/personas';

interface LandingPageProps {
  onEnterBoardroom: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterBoardroom }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Add a small delay for dramatic effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (expandedPersona && AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS]) {
      const persona = AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS];
      const fullText = persona.description;
      setTypingText('');
      setIsTyping(true);
      
      let currentIndex = 0;
      const typingSpeed = 15; // milliseconds per character - faster typing
      
      const typeText = () => {
        if (currentIndex < fullText.length) {
          setTypingText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeText, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };
      
      // Start typing after a brief delay
      setTimeout(typeText, 500);
    }
  }, [expandedPersona]);

  const handlePersonaClick = (personaId: string) => {
    setExpandedPersona(personaId);
    // Smooth scroll to expanded view
    setTimeout(() => {
      const expandedElement = document.querySelector('.persona-expanded');
      if (expandedElement) {
        expandedElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleClosePersona = () => {
    setExpandedPersona(null);
    setTypingText('');
    setIsTyping(false);
  };

  return (
    <div className={`landing-page ${isLoaded ? 'loaded' : ''}`}>
      <div className="boardroom-background">
        <img 
          src="/Boardroom.png" 
          alt="Executive Boardroom" 
          className="boardroom-image"
          onLoad={() => {
            console.log('Boardroom image loaded successfully');
            console.log('Image dimensions:', document.querySelector('.boardroom-image')?.getBoundingClientRect());
          }}
          onError={(e) => {
            console.error('Failed to load boardroom image:', e);
            console.error('Image src:', e.currentTarget.src);
          }}
        />
        <div className="boardroom-overlay"></div>
      </div>

      <div className="landing-content">
        <div className="top-content">
        </div>

        <div className="bottom-content">
          <div className="bottom-section">
            <div className="title-section">
              <div className="logo-card">
                              <img 
                src="/boardroom_logo.png" 
                alt="BoardRoom Startup Advisory Board" 
                className="logo-image"
                draggable="false"
                onLoad={() => console.log('PNG title loaded successfully')}
                onError={(e) => console.error('Failed to load PNG title:', e)}
              />
              </div>
            </div>

            <div className="buttons-container">
              <button 
                className="enter-boardroom-btn"
                onClick={onEnterBoardroom}
              >
                <span className="btn-text">Enter the Boardroom</span>
                <div className="btn-glow"></div>
                <div className="btn-particles">
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                </div>
              </button>

              <button 
                className="speak-colleague-btn"
                onClick={() => {/* Add handler for colleague feature */}}
              >
                <span className="btn-text">Speak to a Colleague</span>
                <div className="btn-glow"></div>
                <div className="btn-particles">
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                </div>
              </button>
            </div>

            <div className="features-list">
              <div className="feature">
                <span className="feature-icon">🎙️</span>
                <span>Live AI Conversations</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>Custom Topics</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💬</span>
                <span>Interactive Discussions</span>
              </div>
            </div>

            <div className="advisors-preview">
              <div className="advisor-card" onClick={() => handlePersonaClick('realist')}>
                <img src="/avatars/Cynic.png" alt="Realist Agent" className="advisor-avatar" draggable="false" />
                <span>Realist</span>
              </div>
              <div className="advisor-card" onClick={() => handlePersonaClick('creative')}>
                <img src="/avatars/Creative.png" alt="Creative Agent" className="advisor-avatar" draggable="false" />
                <span>Creative</span>
              </div>
              <div className="advisor-card" onClick={() => handlePersonaClick('entrepreneur')}>
                <img src="/avatars/Entrepreneurial.png" alt="Entrepreneurial Agent" className="advisor-avatar" draggable="false" />
                <span>Entrepreneur</span>
              </div>

              <div className="advisor-card" onClick={() => handlePersonaClick('tech')}>
                <img src="/avatars/Coder.png" alt="Tech Expert Agent" className="advisor-avatar" draggable="false" />
                <span>Tech Expert</span>
              </div>
              <div className="advisor-card" onClick={() => handlePersonaClick('lisa')}>
                <img src="/avatars/Lisa.png" alt="Marketing Expert" className="advisor-avatar" draggable="false" />
                <span>Marketing Expert</span>
              </div>
              <div className="advisor-card" onClick={() => handlePersonaClick('finance')}>
                <img src="/avatars/Finance Expert.png" alt="Finance Expert" className="advisor-avatar" draggable="false" />
                <span>Finance Expert</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ambient-lights">
        <div className="light light-1"></div>
        <div className="light light-2"></div>
        <div className="light light-3"></div>
      </div>

      {/* Floating Help Button */}
      <button className="floating-help-btn" onClick={() => {/* Add help handler */}}>
        <span className="help-icon">?</span>
      </button>

      {/* Expanded Persona View */}
      {expandedPersona && (
        <div className="persona-expanded">
          <div className="persona-content">
            <button className="close-persona-btn" onClick={handleClosePersona}>
              ✕
            </button>
            
            <div className="persona-header">
              <img 
                src={AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].avatar} 
                alt={AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].name}
                className="persona-large-avatar"
                draggable="false"
              />
              <div className="persona-info">
                <h2 className="persona-name">
                  {AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].name}
                </h2>
                <h3 className="persona-title">
                  {AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].title}
                </h3>
              </div>
            </div>

            <div className="persona-description">
              <div className="typing-text">
                {typingText}
                {isTyping && <span className="typing-cursor">|</span>}
              </div>
            </div>

            <div className="persona-specialties">
              <h4>Specialties:</h4>
              <div className="specialties-list">
                {AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
