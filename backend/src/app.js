require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatController = require('./controllers/chatController');
const app = express();
const port = process.env.PORT || 3001;

/**
 * Standard middleware configuration
 */
app.use(cors());
app.use(express.json());

/**
 * Health check endpoint for Azure App Service monitoring
 * Used to verify the service status without triggering logic
 */
app.get('/health', (req, res) => {
    res.status(200).send('Service is healthy');
});

/**
 * Main messaging endpoint for the Bot Framework
 * Routes incoming requests to the chat controller
 */
app.post('/api/messages', chatController.handleMessage);

/**
 * Server initialization
 */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});