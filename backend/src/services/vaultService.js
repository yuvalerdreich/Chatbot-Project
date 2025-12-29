const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

/**
 * Handles secure retrieval of secrets from Azure Key Vault.
 */
class VaultService {
    constructor() {
        const vaultName = process.env.KEY_VAULT_NAME;
        const url = `https://${vaultName}.vault.azure.net`;
        
        /**
         * Authentication using DefaultAzureCredential.
         * This allows seamless integration with Managed Identity in Azure.
         */
        this.client = new SecretClient(url, new DefaultAzureCredential());
    }

    /**
     * Fetches a secret by name from the configured Key Vault.
     */
    async getSecret(secretName) {
        const secret = await this.client.getSecret(secretName);
        return secret.value;
    }
}

module.exports = new VaultService();