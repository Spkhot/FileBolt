const mongoose = require('mongoose');

const TextNoteSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h', // The note will self-destruct after 24 hours
  },
});

module.exports = mongoose.model('TextNote', TextNoteSchema);