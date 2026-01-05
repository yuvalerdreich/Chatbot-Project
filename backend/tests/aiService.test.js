process.env.AZURE_OPENAI_ENDPOINT = 'https://dummy.openai.azure.com/';
process.env.AZURE_OPENAI_DEPLOYMENT_NAME = 'dummy-deployment';

jest.mock('@azure/identity', () => ({
    ManagedIdentityCredential: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('@azure/openai', () => ({
    OpenAIClient: jest.fn().mockImplementation(() => ({
        getChatCompletions: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Test AI Response' } }]
        })
    }))
}));

const aiService = require('../src/services/aiService');

describe('AI Service', () => {
    test('Should return a string response from Azure OpenAI', async () => {
        const response = await aiService.getChatCompletion([{ role: 'user', content: 'hi' }]);
        expect(response).toBe('Test AI Response');
    });
});
