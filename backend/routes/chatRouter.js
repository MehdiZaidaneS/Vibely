const express = require('express');
const router = express.Router();
const requireAuth = require("../middleware/requireAuth")
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

// Join a group
router.post('/join/:roomId', chatRoomControllers.joinGroup);

// Leave a group
router.post('/leave/:roomId', chatRoomControllers.leaveGroup);


router.use(requireAuth)
router.post("/unread-chats", chatRoomControllers.getUnreadPrivateChats)
router.post("/:roomId/markAsRead", chatRoomControllers.markMessagesAsRead)

module.exports = router;

