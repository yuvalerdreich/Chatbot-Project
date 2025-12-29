/**
 * Setting dummy environment variables before any service initialization
 * to prevent SDK validation errors (like "Invalid URL").
 */
process.env.COSMOS_DB_ENDPOINT = 'https://dummy.documents.azure.com:443/';
process.env.REDIS_HOST = 'localhost';

const chatController = require('../src/controllers/chatController');
const aiService = require('../src/services/aiService');
const redisService = require('../src/services/redisService');
const cosmosService = require('../src/services/cosmosService');

/**
 * Mocking internal services to isolate the controller logic.
 */
jest.mock('../src/services/aiService');
jest.mock('../src/services/redisService');
jest.mock('../src/services/cosmosService');

describe('Chat Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: { userId: 'user123', message: 'hello' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    test('Should return 400 if userId or message is missing', async () => {
        req.body = {};
        await chatController.handleMessage(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Should return 200 and AI response on success', async () => {
        redisService.getSession.mockResolvedValue([]);
        aiService.getChatCompletion.mockResolvedValue('AI Response');

        await chatController.handleMessage(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ answer: 'AI Response' });
    });
});