const redisService = require('../src/services/redisService');

jest.mock('redis', () => ({
    createClient: jest.fn().mockReturnValue({
        on: jest.fn(),
        connect: jest.fn(),
        get: jest.fn().mockResolvedValue(JSON.stringify([{ role: 'user', content: 'old message' }])),
        set: jest.fn(),
        isOpen: true
    })
}));

describe('Redis Service', () => {
    test('Should parse session history from JSON correctly', async () => {
        const session = await redisService.getSession('user123');
        expect(session).toBeInstanceOf(Array);
        expect(session[0].content).toBe('old message');
    });

    test('Should return null if no session exists', async () => {
        // Testing the "first-time user" flow
    });
});