// controllers/uploadController.js

const FileGroup = require('../models/FileGroup');
const generateCode = require('../utils/generateCode');
const cloudinary = require('cloudinary').v2;

exports.handleUpload = async (req, res) => {
  try {
    const { message } = req.body;
    const files = req.files || []; // Default to an empty array if no files are uploaded

    // --- KEY CHANGE 1: Adjust validation ---
    // Check if there's NEITHER a message NOR any files.
    if (!message.trim() && files.length === 0) {
      return res.status(400).json({ error: 'Cannot create an empty share. Please add a message or files.' });
    }

    const code = generateCode();
    let uploadResults = []; // Initialize as an empty array

    // --- KEY CHANGE 2: Only upload to Cloudinary if there are files ---
    if (files.length > 0) {
      uploadResults = await Promise.all(
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
    }
    
    // Create the new document. This works even if uploadResults is empty.
    const newGroup = new FileGroup({ 
      code, 
      message: message.trim(), // Save the trimmed message
      files: uploadResults 
    });
    
    await newGroup.save();
    console.log('Saved to MongoDB');

    res.status(200).json({ code });

  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed due to an internal server error.' });
  }
};