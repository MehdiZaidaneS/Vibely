const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: { type: String }, // optional: group name or title
  
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
