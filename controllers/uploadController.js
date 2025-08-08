const FileGroup = require('../models/FileGroup');
const generateCode = require('../utils/generateCode');
const generateQR = require('../utils/generateQR');
const cloudinary = require('cloudinary').v2;

exports.handleUpload = async (req, res) => {
  try {
    console.log('Received upload request');
    console.log('Files:', req.files);

    const code = generateCode();
    console.log('Generated code:', code);

    const uploadResults = await Promise.all(
      req.files.map(file => {
        return new Promise((resolve, reject) => {
          console.log('Uploading to Cloudinary:', file.originalname);
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                console.error('Cloudinary error:', error);
                reject(error);
              }
              else {
                console.log('Cloudinary success:', result.secure_url);
                resolve({
                  filename: file.originalname.replace(/\s+/g, '_'),
                  originalname: file.originalname,
                  url: result.secure_url,
                  size: file.size,
                  cloudinaryId: result.public_id
                });
              }
            }
          ).end(file.buffer);
        });
      })
    );

    console.log('Upload results:', uploadResults);

    const newGroup = new FileGroup({ code, files: uploadResults });
    await newGroup.save();
    console.log('Saved to MongoDB');

    const qrData = await generateQR(code);
    console.log('Generated QR');

    res.status(200).json({ code, qrData });

  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

