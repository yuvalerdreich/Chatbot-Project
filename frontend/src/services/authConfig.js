/**
 * Configuration for Backend API communication.
 */
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    API_KEY: process.env.REACT_APP_CHAT_API_KEY // Fetched from local env for development
};