export interface ConversationMessage {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  timestamp: string;
}

export interface ConversationLog {
  id: string;
  timestamp: string;
  messages: ConversationMessage[];
  title: string;
}

export interface AgentInfo {
  id: string;
  name: string;
}

export interface ApiResponse {
  success: boolean;
  agent?: string;
  agentName?: string;
  message?: string;
  timestamp?: string;
  error?: string;
}

export interface ConversationTopic {
  id: string;
  name: string;
  description: string;
}
