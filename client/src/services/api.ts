import { ConversationMessage, ApiResponse, AgentInfo, ConversationTopic } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const generateMessage = async (
  conversationHistory: ConversationMessage[],
  lastSpeaker: string | null,
  userInput?: string | null,
  topic?: string,
  customTopic?: string | null
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationHistory,
        lastSpeaker,
        userInput,
        topic,
        customTopic
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling generate-message API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const getAgents = async (): Promise<AgentInfo[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/agents`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.agents || [];
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
};

export const getTopics = async (): Promise<ConversationTopic[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/topics`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.topics || [];
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
};

export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};
