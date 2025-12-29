import { useState, useEffect } from 'react';
import { sendMessageToBot } from '../services/apiClient';

export const useChat = (userId) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const welcomeMessage = {
            role: 'assistant',
            content: "Hello! I am KPMG's digital recruitment assistant. I am here to conduct your initial screening interview for the Platform Engineer position. We will discuss your technical background, cloud expertise, and various infrastructure scenarios. Shall we begin?"
        };
        setMessages([welcomeMessage]);
    }, []);

    const sendMessage = async (text) => {
        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const data = await sendMessageToBot(userId, text);
            const botMsg = { role: 'assistant', content: data.answer };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Frontend communication error:', error);
            setMessages(prev => [...prev, { 
                role: 'system', 
                content: 'Error: Unable to reach the recruitment service. Please try again later.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, sendMessage, isLoading };
};