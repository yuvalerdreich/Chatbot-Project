const aiService = require('../src/services/aiService');

// Mocking the Azure OpenAI client
jest.mock('@azure/openai', () => ({
    OpenAIClient: jest.fn().mockImplementation(() => ({
        getChatCompletions: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Test AI Response' } }]
        })
    })),
    AzureKeyCredential: jest.fn()
}));

describe('AI Service', () => {
    test('Should return a string response from OpenAI', async () => {
        const response = await aiService.getChatCompletion([{ role: 'user', content: 'hi' }]);
        expect(response).toBe('Test AI Response');
    });

    test('Should handle empty choices from AI', async () => {
        // Implementation logic for edge cases
    });
});