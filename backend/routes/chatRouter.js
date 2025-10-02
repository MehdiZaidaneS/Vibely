const express = require('express');
const router = express.Router();
const chatRoomControllers = require('../controllers/chatRoomControllers');

// Create a new chatroom
router.post('/', chatRoomControllers.createChatRoom);

// Edit a message
router.patch('/edit/:messageId', chatRoomControllers.editMessage);

router.get('/searchPri/:userId', chatRoomControllers.getPrivateChat);

router.get('/searchPub/:userId', chatRoomControllers.getPublicChat);

// Get all participants in a chatroom
router.get('/participants/:roomId', chatRoomControllers.getParticipants);

// Get chat history (messages) for a room
router.get('/history/:roomId', chatRoomControllers.getChatHistory);

// Post a message to a chatroom
router.post('/messages/:roomId', chatRoomControllers.postMessage);

// Delete a chatroom
router.delete('/:roomId', chatRoomControllers.deleteChatRoom);

module.exports = router;

