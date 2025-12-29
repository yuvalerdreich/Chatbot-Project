const vaultService = require('../services/vaultService');

let cachedKey = null;

/**
 * Authorize incoming HTTP requests
 * Validates the API key against the secret stored in Azure Key Vault
 */
const authorize = async (req, res, next) => {
    const providedKey = req.headers['x-api-key'];

    if (!providedKey) {
        return res.status(401).json({ error: 'Access denied: No API key provided' });
    }

    /**
     * Lazy loading and caching the secret to minimize Key Vault latency
     * Ensure high performance for sequential requests
     */
    if (!cachedKey) {
        cachedKey = await vaultService.getSecret('BOT-API-AUTH-KEY');
    }

    if (providedKey !== cachedKey) {
        return res.status(403).json({ error: 'Access denied: Invalid API key' });
    }

    next();
};

module.exports = authorize;