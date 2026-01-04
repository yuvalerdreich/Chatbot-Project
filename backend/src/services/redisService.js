const { createClient } = require('redis');

/**
 * Manages transient session state and conversation history
 */
class RedisService {
    constructor() {
        const host = process.env.REDIS_HOST;
        const port = process.env.REDIS_PORT || 6380;
        const password = process.env.REDIS_PASSWORD;

        this.client = createClient({
            url: `rediss://:${password}@${host}:${port}`,
            socket: {
                tls: true,
                reconnectStrategy: (retries) => Math.min(retries * 50, 500)
            }
        });

        this.client.on('error', (err) => console.error('Redis Client Error:', err));
    }

    /**
     * Ensures a connection is established before performing operations
     */
    async ensureConnection() {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    /**
     * Retrieves stored session history for a specific user
     */
    async getSession(userId) {
        await this.ensureConnection();
        const data = await this.client.get(userId);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Persists conversation history with a 1-hour expiration (TTL)
     */
    async saveSession(userId, history) {
        await this.ensureConnection();
        await this.client.set(userId, JSON.stringify(history), {
            EX: 3600
        });
    }
}

module.exports = new RedisService();