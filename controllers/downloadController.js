const FileGroup = require('../models/FileGroup');
const path = require('path');
const createZip = require('../utils/createZip');

exports.getFiles = async (req, res) => {
  try {
    const group = await FileGroup.findOne({ code: req.params.code });
    if (!group) return res.status(404).json({ error: 'Invalid code.' });

    res.status(200).json({ files: group.files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.downloadZip = async (req, res) => {
  try {
    const group = await FileGroup.findOne({ code: req.params.code });
    if (!group) return res.status(404).send('Invalid code.');

    createZip(group.files, res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const group = await FileGroup.findOne({ code: req.params.code });
    if (!group) return res.status(404).send('Invalid code.');

    const file = group.files.find(f => f.filename === req.params.filename);
    if (!file) return res.status(404).send('File not found.');

    res.download(path.resolve(file.path), file.originalname);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
