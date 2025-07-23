const express = require('express');
const router = express.Router();
const FileGroup = require('../models/FileGroup');
const archiver = require('archiver');
const axios = require('axios');

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const group = await FileGroup.findOne({ code });
    if (!group) return res.status(404).json({ error: 'Files not found.' });

    res.attachment(`FastDrop_${code}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    for (const file of group.files) {
      const response = await axios.get(file.url, { responseType: 'stream' });
      archive.append(response.data, { name: file.originalname });
    }

    await archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create ZIP.' });
  }
});

module.exports = router;
