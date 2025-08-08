// controllers/uploadController.js

const FileGroup = require('../models/FileGroup');
const generateCode = require('../utils/generateCode');
// const generateQR = require('../utils/generateQR'); // You can keep this if you use it
const cloudinary = require('cloudinary').v2;

exports.handleUpload = async (req, res) => {
  try {
    // The message will be in req.body because it's a text field in the form
    const { message } = req.body; // <-- ADD THIS LINE
    const { files } = req; // Get files from request

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const code = generateCode();

    const uploadResults = await Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                originalname: file.originalname,
                url: result.secure_url,
                size: file.size,
                cloudinaryId: result.public_id
              });
            }
          ).end(file.buffer);
        });
      })
    );

    // MODIFIED: Include the message when creating the new document
    const newGroup = new FileGroup({ 
      code, 
      message, // <-- ADD THE MESSAGE HERE
      files: uploadResults 
    });
    
    await newGroup.save();
    console.log('Saved to MongoDB with message');

    res.status(200).json({ code }); // QR data sending removed for simplicity, add it back if you need it

  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};