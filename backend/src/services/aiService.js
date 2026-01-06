const { OpenAIClient } = require("@azure/openai");
const { ManagedIdentityCredential } = require("@azure/identity");

/**
 * AI Service Handles communication with Azure OpenAI Service.
 * Uses Managed Identity for secure, keyless authentication.
 */
class AIService {
    constructor() {
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const credential = new ManagedIdentityCredential();
        this.client = new OpenAIClient(endpoint, credential);
        this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    }

    /**
     * Sends a prompt to gpt-5-mini and returns the generated response
     * @param {Array} messages - The conversation history including the new user prompt
     */
    async getChatCompletion(messages) {
        try {
            const result = await this.client.getChatCompletions(this.deploymentName, messages, {
                maxCompletionTokens: 800,
                
            });
            return result.choices[0].message.content;
        } catch (error) {
            console.error("AI Service Error:", error.error || error);
            throw new Error(`AI completion failed: ${error.message || 'Unknown error'}`);
        }
    }
}

module.exports = new AIService();