const { CosmosClient } = require('@azure/cosmos');
const { DefaultAzureCredential } = require('@azure/identity');

/**
 * Handles persistent archiving of chat logs for auditing and analysis
 */
class CosmosService {
    constructor() {
        this.endpoint = process.env.COSMOS_DB_ENDPOINT;
        this.databaseId = process.env.COSMOS_DB_DATABASE_ID;
        this.containerId = process.env.COSMOS_DB_CONTAINER_ID;

        /**
         * Authentication via Managed Identity
         */
        this.client = new CosmosClient({
            endpoint: this.endpoint,
            credential: new DefaultAzureCredential()
        });
    }

    /**
     * Creates a log entry in the ChatHistory container
     */
    async logConversation(userId, conversation) {
        const container = this.client.database(this.databaseId).container(this.containerId);
        
        const document = {
            id: `${userId}-${Date.now()}`,
            userId: userId,
            timestamp: new Date().toISOString(),
            messages: conversation
        };

        await container.items.create(document);
    }
}

module.exports = new CosmosService();