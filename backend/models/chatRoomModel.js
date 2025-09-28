const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: { type: String },
  isGroup: { type: Boolean, default: false },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  avatar: { type: String, default: '/default-group-avatar.png' }, // Add this line
}, { timestamps: true });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
