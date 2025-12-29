const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

class VaultService {
    constructor() {
        const vaultName = process.env.AZURE_KEYVAULT_NAME || process.env.KEY_VAULT_NAME;
        const url = `https://${vaultName}.vault.azure.net`;
        this.client = new SecretClient(url, new DefaultAzureCredential());
    }

    async getSecret(secretName) {
        const secret = await this.client.getSecret(secretName);
        return secret.value;
    }
}

module.exports = new VaultService();
