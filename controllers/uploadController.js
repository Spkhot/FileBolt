const FileGroup = require('../models/FileGroup');
const generateCode = require('../utils/generateCode');
const generateQR = require('../utils/generateQR');

exports.handleUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const code = generateCode();
    console.log('Generated code:', code);

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size
    }));

    const newGroup = new FileGroup({ code, files });
    const savedGroup = await newGroup.save();

    const qrData = generateQR(code);

    console.log('Upload successful:', savedGroup);

    res.status(200).json({ code, qrData });
  } catch (err) {
    console.error('❌ Upload Controller Error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
