const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  size: Number,
});

const FileGroupSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  files: [FileSchema],
  createdAt: { type: Date, default: Date.now, expires: '1d' }, // auto-delete after 1 day
});

module.exports = mongoose.model('FileGroup', FileGroupSchema);
