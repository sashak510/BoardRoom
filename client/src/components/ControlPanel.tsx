import React, { useState, useEffect } from 'react';
import { getTopics } from '../services/api';
import { ConversationTopic } from '../types';
import './ControlPanel.css';

interface ControlPanelProps {
  isPlaying: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onUserInput: (input: string) => void;
  disabled: boolean;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  customTopic: string;
  onCustomTopicChange: (topic: string) => void;
  layoutMode?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
  onUserInput,
  disabled,
  selectedTopic,
  onTopicChange,
  customTopic,
  onCustomTopicChange,
  layoutMode
}) => {
  const [userInputText, setUserInputText] = useState('');
  const [showUserInput, setShowUserInput] = useState(false);
  const [availableTopics, setAvailableTopics] = useState<ConversationTopic[]>([]);

  // Load available topics on component mount
  useEffect(() => {
    const loadTopics = async () => {
      const topics = await getTopics();
      setAvailableTopics(topics);
    };
    loadTopics();
  }, []);

  const handleUserInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInputText.trim()) {
      onUserInput(userInputText.trim());
      setUserInputText('');
      setShowUserInput(false);
      onResume(); // Resume conversation after user input
    }
  };

  const handlePause = () => {
    onPause();
    setShowUserInput(true);
  };

  const handleResume = () => {
    setShowUserInput(false);
    onResume();
  };

  return (
    <div className={`control-panel ${layoutMode === 'boardroom' ? 'floating' : ''}`}>
      {!isPlaying && (
        <div className="topic-selection">
          <h3>💬 Choose a Topic</h3>
          <div className="topic-options">
            <select 
              value={selectedTopic} 
              onChange={(e) => onTopicChange(e.target.value)}
              disabled={disabled}
              className="topic-select"
            >
              {availableTopics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
            
            {selectedTopic === 'custom' && (
              <div className="custom-topic-input">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => onCustomTopicChange(e.target.value)}
                  placeholder="Enter your topic (e.g., 'blockchain gaming', 'sustainable fashion')"
                  disabled={disabled}
                  className="custom-topic-field"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="control-buttons">
        {!isPlaying && (
          <button 
            className="control-btn start-btn" 
            onClick={onStart}
            disabled={disabled}
          >
            ▶️ Start Conversation
          </button>
        )}

        {isPlaying && !isPaused && (
          <button 
            className="control-btn pause-btn" 
            onClick={handlePause}
            disabled={disabled}
          >
            ⏸️ Pause & Add Input
          </button>
        )}

        {isPlaying && isPaused && (
          <button 
            className="control-btn resume-btn" 
            onClick={handleResume}
            disabled={disabled}
          >
            ▶️ Resume
          </button>
        )}

        {isPlaying && (
          <button 
            className="control-btn stop-btn" 
            onClick={onStop}
            disabled={disabled}
          >
            ⏹️ Stop & Save
          </button>
        )}
      </div>

      {showUserInput && isPaused && (
        <div className="user-input-section">
          <h3>💬 Add Your Input</h3>
          <p>Share something for the AI agents to discuss or consider:</p>
          <form onSubmit={handleUserInputSubmit}>
            <textarea
              value={userInputText}
              onChange={(e) => setUserInputText(e.target.value)}
              placeholder="e.g., 'I'm particularly interested in SaaS models' or 'What about mobile app monetisation?'"
              rows={3}
              className="user-input-textarea"
            />
            <div className="input-buttons">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!userInputText.trim()}
              >
                💬 Add to Discussion
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleResume}
              >
                Skip & Resume
              </button>
            </div>
          </form>
        </div>
      )}

      {disabled && (
        <div className="disabled-notice">
          <p>⚠️ Controls disabled while viewing conversation log</p>
        </div>
      )}

      <div className="status-info">
        {isPlaying && !isPaused && (
          <div className="status active">
            🎙️ Conversation in progress...
          </div>
        )}
        {isPaused && (
          <div className="status paused">
            ⏸️ Paused - Add your input or resume
          </div>
        )}
        {!isPlaying && (
          <div className="status stopped">
            ⏹️ Ready to start new conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
