// controllers/downloadController.js

const FileGroup = require('../models/FileGroup');
// const archiver = require('archiver'); // You can keep these for the zip functionality
// const https = require('https');

exports.handleDownload = async (req, res) => {
  const { code } = req.params;
  try {
    const group = await FileGroup.findOne({ code });
    if (!group) {
      return res.status(404).json({ error: 'Code not found or has expired.' });
    }

    // MODIFIED: Send the message along with the files
    res.json({
      message: group.message, // <-- ADD THIS LINE
      files: group.files.map(f => ({
        originalname: f.originalname,
        url: f.url
      }))
    });

  } catch (err) {
    console.error(`Error retrieving group for code ${code}:`, err);
    res.status(500).json({ error: 'An internal error occurred.' });
  }
};