const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authorize = require('../middleware/auth');

router.post('/messages', authorize, chatController.handleMessage);

module.exports = router;
