const express = require('express');
const FileGroup = require('../models/FileGroup');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.delete('/:code', async (req, res) => {
  const group = await FileGroup.findOne({ code: req.params.code });
  if (!group) return res.status(404).json({ error: 'Code not found' });

  // Delete files from disk
  group.files.forEach(file => {
    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    fs.unlink(filePath, err => {
      if (err) console.error('File delete error:', err);
    });
  });

  await group.deleteOne();
  res.json({ message: 'Files deleted' });
});

module.exports = router;
