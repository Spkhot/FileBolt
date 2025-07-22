const FileGroup = require('../models/FileGroup');
const fs = require('fs');

exports.deleteFiles = async (req, res) => {
  try {
    const group = await FileGroup.findOne({ code: req.params.code });
    if (!group) return res.status(404).send('Invalid code.');

    for (const file of group.files) {
      fs.unlink(file.path, err => {
        if (err) console.error('Failed to delete:', file.path);
      });
    }

    await FileGroup.deleteOne({ code: req.params.code });

    res.status(200).send('Files deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
