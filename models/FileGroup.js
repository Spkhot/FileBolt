const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  originalname: { type: String, required: true },
  size: { type: Number, required: true },
  cloudinaryId: { type: String, required: true }
});

const FileGroupSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  files: [FileSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FileGroup', FileGroupSchema);
