const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participantHash: { type: String, required: true, unique: true },
    type: { type: String, enum: ['private', 'group'], default: 'private' },
    displayName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
