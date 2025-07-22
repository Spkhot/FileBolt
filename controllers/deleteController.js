const FileGroup = require('../models/FileGroup');
const fs = require('fs');

exports.deleteFiles = async (req, res) => {
  try {
    // 1️⃣ Find the group by code
    const group = await FileGroup.findOne({ code: req.params.code });
    if (!group) return res.status(404).send('Invalid code.');

    // 2️⃣ Loop over each file in group and delete from disk
    for (const file of group.files) {
      fs.unlink(file.path, err => {
        if (err) console.error('Failed to delete:', file.path);
      });
    }

    // 3️⃣ Remove the MongoDB document too
    await FileGroup.deleteOne({ code: req.params.code });

    // 4️⃣ Respond success
    res.status(200).send('Files deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
