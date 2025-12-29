import { API_CONFIG } from './authConfig';

export const sendMessageToBot = async (userId, message) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/chat/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ userId, message })
    });

    if (!response.ok) {
        throw new Error('Failed to connect to the chatbot service');
    }

    return response.json();
};
