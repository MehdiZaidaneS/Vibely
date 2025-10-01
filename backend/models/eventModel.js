const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    endTime: { type: String, required: false },
    image: { type: String, required: false },
    imageUrl: { type: String, required: false },
    location: { type: String, required: true },
    capacity: { type: Number, required: false },
    participant: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
