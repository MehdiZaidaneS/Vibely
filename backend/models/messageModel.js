const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    type: { 
    type: String, 
    enum: ['text', 'image', 'file'], 
    default: 'text' 
  },
    content: { type: String},
    edited:{type:Boolean, default: false},
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
