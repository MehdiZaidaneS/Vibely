const Message = require('../models/messageModel');
const ChatRoom = require('../models/chatRoomModel');

exports.createChatRoom = async (req, res) => {
  const { name, participants, isGroup } = req.body; 

  try {
    let chatRoom;

    if (!isGroup && participants.length === 2) {
      chatRoom = await ChatRoom.findOne({
        isGroup: false,
        participants: { $all: participants, $size: 2 }
      });
    }

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        name: isGroup ? name : undefined,
        isGroup: !!isGroup,
        participants
      });
      await chatRoom.save();
    }

    const populatedRoom = await ChatRoom.findById(chatRoom._id).populate('participants', 'name email');
    res.status(201).json(populatedRoom);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postMessage = async (req, res) => {
  const { roomId } = req.params;
  const { sender, content, type} = req.body;

  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (type === 'text' && !content) {
      return res.status(400).json({ message: 'Text messages require content' });
    }

    const message = new Message({
      sender,
      chatRoom: roomId,
      type: type || 'text',
      content
    });
    await message.save();

    chatRoom.lastMessage = message._id;
    await chatRoom.save();

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name email');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { userId, content } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Not author of this message' });
    }

    if (message.type !== 'text') {
      return res.status(400).json({ message: 'Only text messages can be edited' });
    }

    if (!content) {
      return res.status(400).json({ message: 'Content is required for editing' });
    }

    message.content = content;
    message.edited = true; 
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getChatHistory = async (req, res) => {
  const { roomId } = req.params;

  try {

    const chatRoom = await ChatRoom.findById(roomId).populate('participants','name email');
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    const messages = await Message.find({ chatRoom: roomId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    res.json({ room: chatRoom, messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParticipants = async (req, res) => {
  const roomID = req.params.roomID;
  try {
    const chatRoom = await ChatRoom.findById(roomID).populate('participants', 'name email')
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    res.json({ room: chatRoom._id, participants: chatRoom.participants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


