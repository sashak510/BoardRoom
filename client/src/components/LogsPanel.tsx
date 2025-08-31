import React from 'react';
import { ConversationLog } from '../types';
import './LogsPanel.css';

interface LogsPanelProps {
  logs: ConversationLog[];
  onViewLog: (log: ConversationLog) => void;
  selectedLogId: string | null;
  onClearView: () => void;
}

const LogsPanel: React.FC<LogsPanelProps> = ({
  logs,
  onViewLog,
  selectedLogId,
  onClearView
}) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getLogPreview = (log: ConversationLog) => {
    if (log.messages.length === 0) return "Empty conversation";
    
    const firstMessage = log.messages[0];
    const preview = firstMessage.content.length > 80 
      ? firstMessage.content.substring(0, 80) + "..."
      : firstMessage.content;
    
    return preview;
  };

  return (
    <div className="logs-panel">
      <div className="logs-header">
        <h3>📚 Conversation Logs</h3>
        {selectedLogId && (
          <button className="clear-view-btn" onClick={onClearView}>
            ✕ Close Log
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="no-logs">
          <p>No conversation logs yet.</p>
          <p>Start a conversation to create your first log!</p>
        </div>
      ) : (
        <div className="logs-list">
          {logs.map((log) => {
            const { date, time } = formatDate(log.timestamp);
            const isSelected = log.id === selectedLogId;
            
            return (
              <div 
                key={log.id}
                className={`log-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onViewLog(log)}
              >
                <div className="log-header">
                  <span className="log-date">{date}</span>
                  <span className="log-time">{time}</span>
                </div>
                
                <div className="log-stats">
                  <span className="message-count">
                    💬 {log.messages.length} messages
                  </span>
                  <span className="duration">
                    📏 {Math.ceil(log.messages.length / 5)} min read
                  </span>
                </div>
                
                <div className="log-preview">
                  {getLogPreview(log)}
                </div>

                {isSelected && (
                  <div className="selected-indicator">
                    📖 Currently viewing
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="logs-footer">
        <p className="logs-info">
          💾 Logs are saved locally in your browser
        </p>
      </div>
    </div>
  );
};

export default LogsPanel;
