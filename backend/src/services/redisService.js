const { createClient } = require('redis');

let redisClient = null;

/**
 * Creates and returns a singleton Redis client instance
 */
const getRedisClient = async () => {
    if (redisClient && redisClient.isOpen) {
        return redisClient;
    }

    const config = {
        socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || 6380),
            tls: process.env.REDIS_TLS === 'true',
            reconnectStrategy: (retries) => {
                if (retries > 10) {
                    console.error('Redis reconnection attempts exhausted');
                    return new Error('Redis reconnection failed');
                }
                return Math.min(retries * 50, 500);
            },
            connectTimeout: 10000,
            keepAlive: 5000,
        },
        password: process.env.REDIS_PASSWORD,
    };

    redisClient = createClient(config);

    redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
        console.log('Redis Client Connected');
    });

    redisClient.on('ready', () => {
        console.log('Redis Client Ready');
    });

    redisClient.on('end', () => {
        console.log('Redis Client Disconnected');
    });

    redisClient.on('reconnecting', () => {
        console.log('Redis Client Reconnecting...');
    });

    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        throw error;
    }

    return redisClient;
};

/**
 * Closes the Redis connection gracefully
 */
const closeRedisConnection = async () => {
    if (redisClient && redisClient.isOpen) {
        await redisClient.quit();
        redisClient = null;
    }
};

/**
 * Retrieves stored session history for a specific user
 */
const getSession = async (userId) => {
    try {
        const client = await getRedisClient();
        const data = await client.get(userId);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting session from Redis:', error);
        return null;
    }
};

/**
 * Persists conversation history with a 1-hour expiration (TTL)
 */
const saveSession = async (userId, history) => {
    try {
        const client = await getRedisClient();
        await client.set(userId, JSON.stringify(history), {
            EX: 3600
        });
    } catch (error) {
        console.error('Error saving session to Redis:', error);
        throw error;
    }
};

module.exports = {
    getRedisClient,
    closeRedisConnection,
    getSession,
    saveSession,
};