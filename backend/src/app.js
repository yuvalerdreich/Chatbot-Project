const express = require('express');
const path = require('path');
const chatRoutes = require('./routes/chatRoutes');
const botService = require('./services/botService');
const { CloudAdapter, ConfigurationBotFrameworkAuthentication } = require('botbuilder');

const app = express();

/**
 * Middleware for parsing JSON bodies.
 */
app.use(express.json());

/**
 * Serve static files from the React frontend build folder
 */
app.use(express.static(path.join(__dirname, '..', 'public')));

/**
 * REST API Routes
 * Standard API endpoints protected by custom x-api-key authentication.
 */
app.use('/api/chat', chatRoutes);

/**
 * Azure Bot Service Integration
 */
const authConfig = new ConfigurationBotFrameworkAuthentication(process.env);
const adapter = new CloudAdapter(authConfig);

app.post('/api/messages', async (req, res) => {
    await adapter.process(req, res, (context) => botService.run(context));
});

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
    res.status(200).send('Service is healthy');
});

/**
 * Catch-all route to serve the React frontend index.html
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});