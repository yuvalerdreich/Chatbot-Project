const aiService = require('../services/aiService');
const redisService = require('../services/redisService');
const cosmosService = require('../services/cosmosService');

/**
 * Retrieves existing conversation history from the cache and appends the new message
 */
async function prepareConversationContext(userId, userMessage) {
    const history = await redisService.getSession(userId) || [];
    history.push({ role: 'user', content: userMessage });
    return history;
}

/**
 * Persists the updated conversation history back to the transient cache
 */
async function persistContext(userId, history, assistantResponse) {
    history.push({ role: 'assistant', content: assistantResponse });
    await redisService.saveSession(userId, history);
    return history;
}

/**
 * Entry point for bot message processing
 * Orchestrates the flow between transient cache, AI inference, and persistent logs
 */
const handleMessage = async (req, res) => {
    const { userId, message } = req.body;

    if (!userId || !message) {
        return res.status(400).json({ error: 'Missing required userId or message' });
    }

    try {
        const history = await prepareConversationContext(userId, message);
        const aiResponse = await aiService.getChatCompletion(history);
        const updatedHistory = await persistContext(userId, history, aiResponse);

        /**
         * Asynchronous archive to Cosmos DB
         */
        cosmosService.logConversation(userId, updatedHistory);

        return res.status(200).json({ answer: aiResponse });

    } catch (error) {
        /**
         * Error is caught to prevent server crash during individual request failure
         * ensuring the service remains available for other users
         */
        console.error('Chat processing error:', error.message);
        return res.status(500).json({ error: 'Failed to process message' });
    }
};

module.exports = {
    handleMessage
};