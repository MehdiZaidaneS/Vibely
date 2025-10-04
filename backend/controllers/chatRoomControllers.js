const Message = require("../models/messageModel");
const ChatRoom = require("../models/chatRoomModel");

exports.createChatRoom = async (req, res) => {
  const { name, participants, isGroup, description } = req.body;

  try {
    let chatRoom;

    if (!isGroup && participants.length === 2) {
      chatRoom = await ChatRoom.findOne({
        isGroup: false,
        participants: { $all: participants, $size: 2 },
      });
    }

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        name: isGroup ? name : undefined,
        isGroup: !!isGroup,
        participants,
        description,
      });
      await chatRoom.save();
    }

    const populatedRoom = await ChatRoom.findById(chatRoom._id).populate(
      "participants",
      "name email"
    );
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
      return res.status(404).json({ message: "Chat room not found" });
    }

    if (type === "text" && !content) {
      return res.status(400).json({ message: "Text messages require content" });
    }

    const message = new Message({
      sender,
      chatRoom: roomId,
      type: type || "text",
      content,
    });
    await message.save();

    chatRoom.lastMessage = message._id;
    await chatRoom.save();

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email profile_pic"
    );

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
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: "Not author of this message" });
    }

    if (message.type !== "text") {
      return res
        .status(400)
        .json({ message: "Only text messages can be edited" });
    }

    if (!content) {
      return res
        .status(400)
        .json({ message: "Content is required for editing" });
    }

    message.content = content;
    message.edited = true;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const User = require("../models/userModel"); // Assuming your user model is here

exports.getPrivateChat = async (req, res) => {
  const { userId } = req.params;
  try {
    const chatrooms = await ChatRoom.find({
      participants: userId,
      isGroup: false,
    })
      .populate("participants", "name profile_pic isOnline")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    if (!chatrooms || chatrooms.length === 0) {
      return res.status(200).json([]); // Return empty array if no chatrooms
    }

    const formattedChatrooms = await Promise.all(
      chatrooms.map(async (room) => {
        const otherParticipant = room.isGroup
          ? null
          : room.participants.find((p) => p._id.toString() !== userId);

        const lastMessageContent = room.lastMessage
          ? room.lastMessage.content
          : "No messages yet.";

        const unreadCount = await Message.countDocuments({
          chatRoom: room._id,
          sender: { $ne: userId },
          readBy: { $ne: userId },
        });

        return {
          id: room._id,
          name: room.isGroup
            ? room.name
            : otherParticipant?.name || "Unknown User",
          avatar: room.isGroup
            ? room.avatar || "/default-group-avatar.png"
            : otherParticipant?.profile_pic ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
          isOnline: room.isGroup ? true : otherParticipant?.isOnline || false,
          isTyping: false,
          otherUserId: otherParticipant?._id.toString() || null,
          user_name: otherParticipant?.name || "Unknown User",
          lastMessage: lastMessageContent,
          lastMessageTime: room.lastMessage?.createdAt || room.updatedAt,
          unreadCount,
        };
      })
    );

    res.json(formattedChatrooms);
  } catch (error) {
    console.error("Error fetching private chats:", error);
    res.status(500).json({ error: "Failed to fetch private chatrooms." });
  }
};





exports.getPublicChat = async (req, res) => {
  const { userId } = req.params;

  try {
    const publicGroups = await ChatRoom.find({ isGroup: true })
      .populate("lastMessage")
      .populate("participants", "name email profile_pic")
      .sort({ updatedAt: -1 });

    if (!publicGroups || publicGroups.length === 0) {
      return res.status(200).json([]);
    }

    const formattedGroups = publicGroups.map((group) => {
      const isMember = group.participants.some(
        (p) => p._id.toString() === userId
      );

      return {
        id: group._id,
        name: group.name,
        description: group.description,
        members: group.participants.length,
        isMember: isMember,
        lastMessage: group.lastMessage?.content || "No messages yet.",
        lastMessageTime: group.lastMessage?.createdAt || group.updatedAt,
        participants: group.participants,
      };
    });

    res.json(formattedGroups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch public groups." });
  }
};

exports.getChatHistory = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ chatRoom: roomId })
      .populate("sender", "name email profile_pic")
      .sort({ createdAt: 1 });

    // Only return the messages array
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParticipants = async (req, res) => {
  const roomID = req.params.roomId;
  try {
    const chatRoom = await ChatRoom.findById(roomID).populate(
      "participants",
      "name email profile_pic"
    );
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
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
      return res.status(404).json({ message: "Chat room not found" });
    }

    // Delete all messages in the chatroom
    await Message.deleteMany({ chatRoom: roomId });

    // Delete the chatroom itself
    await ChatRoom.findByIdAndDelete(roomId);

    res.status(200).json({ message: "Chat room deleted successfully" });
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
      return res.status(404).json({ message: "Chat room not found" });
    }

    if (!chatRoom.isGroup) {
      return res.status(400).json({ message: "This is not a group chat" });
    }

    // Check if user is already a participant
    if (chatRoom.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    // Add user to participants
    chatRoom.participants.push(userId);
    await chatRoom.save();

    const populatedRoom = await ChatRoom.findById(roomId).populate(
      "participants",
      "name email profile_pic"
    );
    res
      .status(200)
      .json({ message: "Joined group successfully", chatRoom: populatedRoom });
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
      return res.status(404).json({ message: "Chat room not found" });
    }

    if (!chatRoom.isGroup) {
      return res.status(400).json({ message: "This is not a group chat" });
    }

    // Check if user is a participant
    if (!chatRoom.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    // Remove user from participants
    chatRoom.participants = chatRoom.participants.filter(
      (participantId) => participantId.toString() !== userId.toString()
    );
    await chatRoom.save();

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUnreadPrivateChats = async (req, res) => {
  const userId = req.user._id;

  try {
    const privateChats = await ChatRoom.find({
      participants: userId,
      isGroup: false,
    })
      .populate('participants', 'name avatar isOnline')
      .populate('lastMessage', 'content createdAt')
      .sort({ updatedAt: -1 });

    const chatsWithUnread = [];

    for (const chat of privateChats) {
      const unreadMessagesCount = await Message.countDocuments({
        chatRoom: chat._id,
        sender: { $ne: userId },
        readBy: { $ne: userId },
      });

      if (unreadMessagesCount > 0) {
        const otherParticipant = chat.participants.find(
          (p) => p._id.toString() !== userId
        );

        chatsWithUnread.push({
          id: chat._id,
          otherUserId: otherParticipant?._id?.toString() || null,
          name: otherParticipant?.name || 'Unknown User',
          avatar: otherParticipant?.avatar || '/default-avatar.png',
          isOnline: otherParticipant?.isOnline || false,
          unreadCount: unreadMessagesCount,
          lastMessage: chat.lastMessage?.content || 'No messages yet.',
          time: chat.lastMessage?.createdAt || null,
        });
      }
    }

    res.json(chatsWithUnread);
  } catch (error) {
    console.error('Error fetching unread private chats:', error);
    res.status(500).json({ error: 'Failed to fetch unread private chats.' });
  }
};


exports.markMessagesAsRead = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;

  try {
    await Message.updateMany(
      {
        chatRoom: roomId,
        sender: { $ne: userId },
        readBy: { $ne: userId },
      },
      { $push: { readBy: userId } }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read.' });
  }
};
