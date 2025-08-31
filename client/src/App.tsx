import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import ConversationPanel from './components/ConversationPanel';
import ControlPanel from './components/ControlPanel';
import LogsPanel from './components/LogsPanel';
import { ConversationMessage, ConversationLog } from './types';
import { AGENT_PERSONAS } from './data/personas';

function App() {
  const [currentConversation, setCurrentConversation] = useState<ConversationMessage[]>([]);
  const [conversationLogs, setConversationLogs] = useState<ConversationLog[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastSpeaker, setLastSpeaker] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ConversationLog | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('general');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInTeamSection, setIsInTeamSection] = useState(false);
  const [teamSectionAnimating, setTeamSectionAnimating] = useState(false);
  const [viewedPersonas, setViewedPersonas] = useState<Set<string>>(new Set());

  // Load conversation logs from localStorage on component mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('boardroom-conversation-logs');
    if (savedLogs) {
      try {
        setConversationLogs(JSON.parse(savedLogs));
      } catch (error) {
        console.error('Error loading conversation logs:', error);
      }
    }
  }, []);

  // Save conversation logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('boardroom-conversation-logs', JSON.stringify(conversationLogs));
  }, [conversationLogs]);

  // Typing animation effect for persona descriptions
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    let isActive = true;
    
    if (expandedPersona && AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS]) {
      const persona = AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS];
      const fullText = persona.description;
      
      // Check if this persona has been viewed before
      const hasBeenViewed = viewedPersonas.has(expandedPersona);
      
      if (hasBeenViewed) {
        // If already viewed, show full text immediately
        setTypingText(fullText);
        setIsTyping(false);
      } else {
        // If new persona, do typing animation
        setTypingText('');
        setIsTyping(true);
        
        let currentIndex = 0;
        const typingSpeed = 15; // milliseconds per character
        
        const typeText = () => {
          if (!isActive) return; // Stop if component unmounted or persona changed
          
          if (currentIndex < fullText.length) {
            setTypingText(fullText.substring(0, currentIndex + 1));
            currentIndex++;
            typingTimeout = setTimeout(typeText, typingSpeed);
          } else {
            setIsTyping(false);
            // Mark this persona as viewed when typing completes
            setViewedPersonas(prev => {
              const newSet = new Set(prev);
              newSet.add(expandedPersona);
              return newSet;
            });
          }
        };
        
        // Start typing after a brief delay
        typingTimeout = setTimeout(typeText, 500);
      }
    }
    
    // Cleanup function to prevent memory leaks and text glitching
    return () => {
      isActive = false;
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [expandedPersona, viewedPersonas]);

  const startNewConversation = () => {
    setCurrentConversation([]);
    setLastSpeaker(null);
    setIsPlaying(true);
    setIsPaused(false);
    setSelectedLog(null);
  };

  const pauseConversation = () => {
    setIsPaused(true);
  };

  const resumeConversation = () => {
    setIsPaused(false);
  };

  const stopConversation = () => {
    if (currentConversation.length > 0) {
      // Save the conversation as a log
      const newLog: ConversationLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        messages: [...currentConversation],
        title: `Conversation ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
      };
      setConversationLogs(prev => [newLog, ...prev]);
    }
    
    setCurrentConversation([]);
    setIsPlaying(false);
    setIsPaused(false);
    setLastSpeaker(null);
  };

  const addMessageToConversation = (message: ConversationMessage) => {
    setCurrentConversation(prev => [...prev, message]);
    setLastSpeaker(message.agentId);
  };

  const addUserInput = (userInput: string) => {
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      agentId: 'user',
      agentName: 'Startup Director',
      content: userInput,
      timestamp: new Date().toISOString()
    };
    addMessageToConversation(userMessage);
  };

  const viewLog = (log: ConversationLog) => {
    setSelectedLog(log);
    setCurrentConversation([]);
    setIsPlaying(false);
    setIsPaused(false);
  };

  const clearViewLog = () => {
    setSelectedLog(null);
  };

  const handleEnterBoardroom = () => {
    setShowLandingPage(false);
  };

  const handlePersonaClick = (personaId: string) => {
    setExpandedPersona(personaId);
  };

  const scrollToTeam = () => {
    // First show the team section
    setIsInTeamSection(true);
    
    // Then scroll to it after a brief delay to ensure it's rendered
    setTimeout(() => {
      const teamSection = document.getElementById('team-section');
      if (teamSection) {
        teamSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const scrollToHome = () => {
    // Start fade out animation immediately without closing persona first
    setTeamSectionAnimating(true);
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Hide team section and clean up state after animation completes
    setTimeout(() => {
      setIsInTeamSection(false);
      setTeamSectionAnimating(false);
      // Clean up persona state after transition is complete
      setExpandedPersona(null);
      setTypingText('');
      setIsTyping(false);
    }, 300);
  };

  const handleClosePersona = () => {
    setExpandedPersona(null);
    setTypingText('');
    setIsTyping(false);
  };

  return (
    <div className="App">
      {showLandingPage ? (
        <>
          <LandingPage onEnterBoardroom={handleEnterBoardroom} onMeetTeam={scrollToTeam} isInTeamSection={isInTeamSection} onBackToHome={scrollToHome} />
          
          {/* Team Section - only show when in team section */}
          {isInTeamSection && (
            <div id="team-section" className={`team-section ${teamSectionAnimating ? 'fade-out' : ''}`}>
            <div className="team-section-content">
              <h2 className="team-section-title">Your Advisory Team</h2>
              
              <div className={`team-cards-grid ${expandedPersona ? 'compressed' : ''}`}>
                {Object.values(AGENT_PERSONAS).map((persona) => (
                  <div 
                    key={persona.id} 
                    className={`team-member-card ${expandedPersona === persona.id ? 'active' : ''}`}
                    onClick={() => handlePersonaClick(persona.id)}
                  >
                    <img 
                      src={persona.avatar} 
                      alt={persona.name}
                      className="team-member-avatar"
                      draggable="false"
                    />
                    <h3 className="team-member-name">{persona.name}</h3>
                    <p className="team-member-title">{persona.title}</p>
                  </div>
                ))}
              </div>

              {/* Expanded Profile Section */}
              {expandedPersona && (
                <div className="expanded-profile">
                  <div className="profile-header">
                    <img 
                      src={AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].avatar} 
                      alt={AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].name}
                      className="profile-large-avatar"
                      draggable="false"
                    />
                    <div className="profile-info">
                      <h2 className="profile-name">
                        {AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].name}
                      </h2>
                      <h3 className="profile-title">
                        {AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].title}
                      </h3>
                    </div>
                    <button className="close-profile-btn" onClick={handleClosePersona}>
                      ✕
                    </button>
                  </div>

                  <div className="profile-description">
                    <div className="typing-text">
                      {typingText}
                      {isTyping && <span className="typing-cursor">|</span>}
                    </div>
                  </div>

                  <div className="profile-specialties">
                    <h4>Specialties:</h4>
                    <div className="specialties-grid">
                      {AGENT_PERSONAS[expandedPersona as keyof typeof AGENT_PERSONAS].specialties.map((specialty, index) => (
                        <span key={index} className="specialty-badge">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </>
      ) : (
        <div className="boardroom-app">
          {/* Boardroom Background - Left Side (65%) */}
          <div className="boardroom-background-app">
            <img 
              src="/Boardroom.png" 
              alt="Executive Boardroom" 
              className="boardroom-image-app"
            />
            <div className="boardroom-overlay-app"></div>
          </div>

          {/* Back Button */}
          <button 
            className="back-to-landing-btn-app"
            onClick={() => setShowLandingPage(true)}
          >
            ← Back to Landing
          </button>

          {/* Chat Section - Right Side (35%) */}
          <div className="chat-section">
            <div className="chat-header">
              <h2>🎙️ Live Discussion</h2>
            </div>

            <div className="chat-content">
              <ConversationPanel 
                messages={selectedLog ? selectedLog.messages : currentConversation}
                isPlaying={isPlaying}
                isPaused={isPaused}
                lastSpeaker={lastSpeaker}
                onNewMessage={addMessageToConversation}
                isViewingLog={!!selectedLog}
                selectedTopic={selectedTopic}
                customTopic={customTopic}
                layoutMode="boardroom"
              />
            </div>

            {/* Control Panel at Bottom */}
            <ControlPanel
              isPlaying={isPlaying}
              isPaused={isPaused}
              onStart={startNewConversation}
              onPause={pauseConversation}
              onResume={resumeConversation}
              onStop={stopConversation}
              onUserInput={addUserInput}
              disabled={!!selectedLog}
              selectedTopic={selectedTopic}
              onTopicChange={setSelectedTopic}
              customTopic={customTopic}
              onCustomTopicChange={setCustomTopic}
              layoutMode="boardroom"
            />

            {/* Logs Panel Integration */}
            {showLogs && (
              <div className="logs-overlay">
                <LogsPanel
                  logs={conversationLogs}
                  onViewLog={viewLog}
                  selectedLogId={selectedLog?.id || null}
                  onClearView={clearViewLog}
                />
                <button 
                  className="toggle-logs-btn-app"
                  onClick={() => setShowLogs(!showLogs)}
                >
                  Hide History
                </button>
              </div>
            )}

            {!showLogs && (
              <button 
                className="toggle-logs-btn-app"
                onClick={() => setShowLogs(!showLogs)}
              >
                Show History
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 