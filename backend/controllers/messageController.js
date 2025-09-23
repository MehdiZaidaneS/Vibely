const Message = require('../models/messageModel');

const getChatHistory = async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort('timestamp');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
module.exports={getChatHistory}