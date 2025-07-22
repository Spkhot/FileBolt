const FileGroup = require('../models/FileGroup');
const generateCode = require('../utils/generateCode');
const generateQR = require('../utils/generateQR');

exports.handleUpload = async (req, res) => {
  try {
    const code = generateCode();

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size
    }));

    const newGroup = new FileGroup({ code, files });
    await newGroup.save();

    const qrData = generateQR(code);

    res.status(200).json({ code, qrData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
