const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  url: String,
  originalname: String,
  size: Number,
  cloudinaryId: String
});

const FileGroupSchema = new mongoose.Schema({
  code: String,
  files: [FileSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FileGroup', FileGroupSchema);
