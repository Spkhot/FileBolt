const FileGroup = require('../models/FileGroup');
const archiver = require('archiver');
const https = require('https');

exports.handleDownload = async (req, res) => {
  const { code } = req.params;
  const group = await FileGroup.findOne({ code });
  if (!group) return res.status(404).json({ error: 'Invalid code' });

  res.json({ files: group.files.map(f => ({
    originalname: f.originalname,
    url: f.url
  }))});
};

