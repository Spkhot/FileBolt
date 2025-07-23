const FileGroup = require('../models/FileGroup');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.handleDelete = async (req, res) => {
  const { code } = req.params;

  const group = await FileGroup.findOne({ code });
  if (!group) return res.status(404).json({ error: 'Invalid code' });

  for (const file of group.files) {
    await cloudinary.uploader.destroy(file.cloudinaryId);
  }

  await group.deleteOne();

  res.json({ message: 'Files deleted' });
};
