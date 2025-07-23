const express = require('express');
const router = express.Router();
const FileGroup = require('../models/FileGroup');
const axios = require('axios');

router.get('/:code/:filename', async (req, res) => {
  const { code, filename } = req.params;

  const group = await FileGroup.findOne({ code });
  if (!group) return res.status(404).send('File group not found.');

  const file = group.files.find(f => f.filename === filename);
  if (!file) return res.status(404).send('File not found.');

  try {
    const response = await axios.get(file.url, { responseType: 'stream' });
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalname}"`);
    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error downloading file.');
  }
});

module.exports = router;
