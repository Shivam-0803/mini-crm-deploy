import api from './api';

export const generateSegmentRules = async (prompt) => {
  try {
    const response = await api.post('/api/ai/segment-rules', { prompt });
    return response.data;
  } catch (error) {
    console.error('Error generating segment rules:', error);
    throw error;
  }
};

export const generateMessageSuggestions = async (objective, audience) => {
  try {
    const response = await api.post('/api/ai/message-suggestions', { 
      objective,
      audience
    });
    return response.data;
  } catch (error) {
    console.error('Error generating message suggestions:', error);
    throw error;
  }
}; 