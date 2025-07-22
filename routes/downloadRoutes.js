const express = require('express');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const FileGroup = require('../models/FileGroup');

const router = express.Router();

// Get files by code
router.get('/:code', async (req, res) => {
  try {
    const group = await FileGroup.findOne({ code: req.params.code });
    if (!group) return res.status(404).json({ error: 'Invalid code.' });

    res.status(200).json({ files: group.files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Download zip
router.get('/:code/zip', async (req, res) => {
  try {
    const group = await FileGroup.findOne({ code: req.params.code });
    if (!group) return res.status(404).send('Invalid code.');

    const archive = archiver('zip');
    res.attachment('files.zip');
    archive.pipe(res);

    group.files.forEach(file => {
      archive.file(file.path, { name: file.originalname });
    });

    archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Download single file
router.get('/:code/:filename', async (req, res) => {
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
});

module.exports = router;
