const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authorize = require('../middleware/auth');

/**
 * Route configuration for chat-related interactions.
 */

/**
 * Endpoint for processing incoming chat messages.
 * Protected by API key authorization.
 */
router.post('/messages', authorize, chatController.handleMessage);

module.exports = router;