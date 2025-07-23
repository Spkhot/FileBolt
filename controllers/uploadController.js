const FileGroup = require('../models/FileGroup');
const generateCode = require('../utils/generateCode');
const generateQR = require('../utils/generateQR');

exports.handleUpload = async (req, res) => {
  try {
    console.log('🚩 handleUpload called');
    console.log('Files received:', req.files);

    const code = generateCode();
    console.log('Generated code:', code);

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size,
    }));

    console.log('Files to save:', files);

    const newGroup = new FileGroup({ code, files });
    await newGroup.save();

    console.log('✅ Saved to DB');

    const qrData = await generateQR(code);
    console.log('Generated QR:', qrData);

    res.json({ code, qrData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

