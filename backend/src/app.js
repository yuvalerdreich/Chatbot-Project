const express = require('express');
const chatRoutes = require('./routes/chatRoutes');
const botService = require('./services/botService');
const { CloudAdapter, ConfigurationBotFrameworkAuthentication } = require('botbuilder');

const app = express();
app.use(express.json());

/**
 * REST API Routes
 * Standard API endpoints protected by custom x-api-key authentication.
 */
app.use('/api/chat', chatRoutes);

/**
 * Azure Bot Service Integration
 * Using the official CloudAdapter to process activities from the Bot Framework.
 */
const authConfig = new ConfigurationBotFrameworkAuthentication(process.env);
const adapter = new CloudAdapter(authConfig);

app.post('/api/messages', async (req, res) => {
    await adapter.process(req, res, (context) => botService.run(context));
});

/**
 * Health Check Endpoint
 * Used by Azure App Service to monitor the deployment status.
 */
app.get('/health', (req, res) => {
    res.status(200).send('Service is healthy');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});