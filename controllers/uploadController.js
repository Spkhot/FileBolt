const cloudinary = require('cloudinary').v2;
const FileGroup = require('../models/FileGroup');
const generateCode = require('../utils/generateCode');
const generateQR = require('../utils/generateQR');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.handleUpload = async (req, res) => {
  try {
    const code = generateCode(); // e.g. "12345"

    // ✅ Parallel upload all files to Cloudinary:
    const uploadPromises = req.files.map(file => {
      return cloudinary.uploader.upload(file.path, {
        folder: 'fastdrop',
        resource_type: 'auto'  // auto = any file type
      }).then(result => {
        // Clean up local temp file after upload
        fs.unlinkSync(file.path);
        return {
          url: result.secure_url,
          originalname: file.originalname,
          size: file.size,
          cloudinaryId: result.public_id
        };
      });
    });

    const files = await Promise.all(uploadPromises);

    // ✅ Save the code & file metadata in Mongo:
    const newGroup = new FileGroup({ code, files });
    await newGroup.save();

    // ✅ Generate QR only for frontend display:
    const qrData = generateQR(code);

    // ✅ Send response:
    res.status(200).json({ code, qrData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
