/**
 * Verifies that services can be initialized
 */
describe('Backend Service Initialization', () => {
  it('should load environment variables without crashing', () => {
    // Check if essential keys exist (even if empty during test)
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should successfully require the AI service', () => {
    const aiService = require('../src/services/aiService');
    expect(aiService).toBeDefined();
  });

  it('should successfully require the Redis service', () => {
    const redisService = require('../src/services/redisService');
    expect(redisService).toBeDefined();
  });
});