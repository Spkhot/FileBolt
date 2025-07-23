const FileGroup = require('../models/FileGroup');
const generateCode = require('../utils/generateCode');
const generateQR = require('../utils/generateQR');
const cloudinary = require('cloudinary').v2;

exports.handleUpload = async (req, res) => {
  try {
    const code = generateCode();

    const uploadResults = await Promise.all(
      req.files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve({
                filename: file.originalname.replace(/\s+/g, '_'),
                originalname: file.originalname,
                url: result.secure_url,
                size: file.size,
                cloudinaryId: result.public_id // ✅ for cleanup later
              });
            }
          ).end(file.buffer);
        });
      })
    );

    const newGroup = new FileGroup({ code, files: uploadResults });
    await newGroup.save();

    const qrData = await generateQR(code);

    res.status(200).json({ code, qrData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
