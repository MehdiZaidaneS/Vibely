const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/messageController');

router.get('/:user1/:user2', getChatHistory);

module.exports = router;
