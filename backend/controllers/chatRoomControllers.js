const Message = require('../models/messageModel');
const ChatRoom = require('../models/chatRoomModel');

exports.createChatRoom = async (req, res) => {
  const { name, participants, isGroup, description } = req.body;

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
        participants,
        description
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
  const { sender, content, type } = req.body;

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

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name email profile_pic');

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

const User = require('../models/userModel'); // Assuming your user model is here

exports.getPrivateChat = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all private chatrooms where this user is a participant
    const chatrooms = await ChatRoom.find({ 
      participants: userId, 
      isGroup: false 
    })
      .populate('participants', 'name avatar isOnline')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    if (!chatrooms || chatrooms.length === 0) {
      return res.status(200).json([]); // No private chats found
    }

    // Format private chats
    const formattedChats = chatrooms.map(room => {
      // Find the other participant
      const otherParticipant = room.participants.find(
        p => p._id.toString() !== userId
      );

      return {
        id: room._id,
        otherUserId: otherParticipant?._id.toString() || null,
        name: otherParticipant?.name || 'Unknown User',
        avatar: otherParticipant?.avatar || '/default-avatar.png',
        isOnline: otherParticipant?.isOnline || false,
        lastMessage: room.lastMessage?.content || 'No messages yet.',
        lastMessageTime: room.lastMessage?.createdAt || room.updatedAt
      };
    });

    res.json(formattedChats);
  } catch (error) {
    console.error('Error fetching private chats:', error);
    res.status(500).json({ error: 'Failed to search for private chatrooms.' });
  }
};


exports.getPublicChat = async (req, res) => {
  try {
    const publicGroups = await ChatRoom.find({ isGroup: true })
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    if (!publicGroups || publicGroups.length === 0) {
      return res.status(200).json([]);
    }

    const formattedGroups = publicGroups.map((group) => {
      // You can format the response here to match the frontend's needs
      return {
        id: group._id,
        name: group.name,
        description: group.description, // Assuming you add this field to your model
        members: group.participants.length, // Display member count
        lastMessage: group.lastMessage?.content || 'No messages yet.',
        lastMessageTime: group.lastMessage?.createdAt || group.updatedAt,
      };
    });

    res.json(formattedGroups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public groups.' });
  }
};

exports.getChatHistory = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ chatRoom: roomId })
      .populate('sender', 'name email profile_pic')
      .sort({ createdAt: 1 });

    // Only return the messages array
    res.json(messages);
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

exports.deleteChatRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Delete all messages in the chatroom
    await Message.deleteMany({ chatRoom: roomId });

    // Delete the chatroom itself
    await ChatRoom.findByIdAndDelete(roomId);

    res.status(200).json({ message: 'Chat room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.body;

  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (!chatRoom.isGroup) {
      return res.status(400).json({ message: 'Cannot join a private chat' });
    }

    if (chatRoom.participants.includes(userId)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    chatRoom.participants.push(userId);
    await chatRoom.save();

    const populatedRoom = await ChatRoom.findById(chatRoom._id).populate('participants', 'name email');
    res.status(200).json(populatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.leaveGroup = async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.body;

  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (!chatRoom.isGroup) {
      return res.status(400).json({ message: 'Cannot leave a private chat' });
    }

    chatRoom.participants = chatRoom.participants.filter(
      participant => participant.toString() !== userId
    );
    await chatRoom.save();

    const populatedRoom = await ChatRoom.findById(chatRoom._id).populate('participants', 'name email');
    res.status(200).json(populatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


