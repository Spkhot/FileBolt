const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  size: Number
});

const fileGroupSchema = new mongoose.Schema({
  code: String,
  files: [fileSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 // Auto-delete after 24 hours
  }
});

module.exports = mongoose.model('FileGroup', fileGroupSchema);
