import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import ConversationPanel from './components/ConversationPanel';
import ControlPanel from './components/ControlPanel';
import LogsPanel from './components/LogsPanel';
import { ConversationMessage, ConversationLog } from './types';

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

  return (
    <div className="App">
      {showLandingPage ? (
        <LandingPage onEnterBoardroom={handleEnterBoardroom} />
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