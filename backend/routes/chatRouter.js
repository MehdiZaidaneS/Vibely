const express = require('express');
const router = express.Router();
const chatRoomControllers = require('../controllers/chatRoomControllers');

// Create a new chatroom
router.post('/', chatRoomControllers.createChatRoom);

// Get all participants in a chatroom
router.get('/:roomId/participants', chatRoomControllers.getParticipants);

// Get chat history (messages) for a room
router.get('/:roomId/messages', chatRoomControllers.getChatHistory);

// Post a message to a chatroom
router.post('/:roomId/messages', chatRoomControllers.postMessage);

// Edit a message
router.patch('/messages/:messageId', chatRoomControllers.editMessage);

module.exports = router;
