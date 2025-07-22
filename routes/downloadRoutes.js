const express = require('express');
const FileGroup = require('../models/FileGroup');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ✅ Get files list
router.get('/:code', async (req, res) => {
  const group = await FileGroup.findOne({ code: req.params.code });
  if (!group) return res.status(404).json({ error: 'Code not found' });
  res.json({ files: group.files });
});

// ✅ Download single file
router.get('/:code/:filename', async (req, res) => {
  const group = await FileGroup.findOne({ code: req.params.code });
  if (!group) return res.status(404).json({ error: 'Code not found' });

  const file = group.files.find(f => f.filename === req.params.filename);
  if (!file) return res.status(404).json({ error: 'File not found' });

  res.download(path.join(__dirname, '..', 'uploads', file.filename));
});

// ✅ Download all as ZIP
router.get('/:code/zip', async (req, res) => {
  const group = await FileGroup.findOne({ code: req.params.code });
  if (!group) return res.status(404).json({ error: 'Code not found' });

  res.attachment(`${req.params.code}.zip`);
  const archive = archiver('zip');
  archive.pipe(res);

  group.files.forEach(file => {
    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    archive.file(filePath, { name: file.originalname });
  });

  archive.finalize();
});

module.exports = router;
