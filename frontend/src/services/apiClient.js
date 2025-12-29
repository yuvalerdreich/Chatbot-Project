import { API_CONFIG } from './authConfig';

/**
 * Service to handle HTTP requests to the Chatbot Backend.
 */
export const sendMessageToBot = async (userId, message) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/chat/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_CONFIG.API_KEY // Matches the Backend middleware requirement
        },
        body: JSON.stringify({ userId, message })
    });

    if (!response.ok) {
        throw new Error('Failed to connect to the chatbot service');
    }

    return response.json();
};