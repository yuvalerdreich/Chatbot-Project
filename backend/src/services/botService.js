const { ActivityHandler, MessageFactory } = require('botbuilder');
const aiService = require('./aiService');
const redisService = require('./redisService');

/**
 * handles the interaction logic for the Azure Bot Service
 */
class BotService extends ActivityHandler {
    constructor() {
        super();

        /**
         * Message event handler
         * Triggered whenever a user sends a message to the bot
         */
        this.onMessage(async (context, next) => {
            const userId = context.activity.from.id;
            const userText = context.activity.text;

            try {
                const history = await this.getConversationContext(userId, userText);
                const response = await aiService.getChatCompletion(history);
                
                await this.updateConversationContext(userId, history, response);
                await context.sendActivity(MessageFactory.text(response));
            } catch (error) {
                console.error('Bot processing error:', error.message);
                await context.sendActivity('I encountered an error. Please try again later.');
            }

            await next();
        });

        /**
         * Member added event handler
         * Used to send a greeting message when a user starts a session
         */
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Welcome to the Platform Candidate screening bot. How can I help you today?';
            
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText));
                }
            }
            await next();
        });
    }

    /**
     * Internal helper to fetch and prepare conversation history
     */
    async getConversationContext(userId, newMessage) {
        const history = await redisService.getSession(userId) || [];
        history.push({ role: 'user', content: newMessage });
        return history;
    }

    /**
     * Internal helper to persist updated history to the cache
     */
    async updateConversationContext(userId, history, assistantMessage) {
        history.push({ role: 'assistant', content: assistantMessage });
        await redisService.saveSession(userId, history);
    }
}

module.exports = new BotService();