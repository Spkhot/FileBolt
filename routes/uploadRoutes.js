const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

const upload = multer({
  dest: './uploads/',
  limits: { fileSize: 20 * 1024 * 1024 }
}).any(); // <-- accept ANY field name

router.post('/', (req, res) => {
  console.log('🔥 Upload endpoint hit');

  upload(req, res, err => {
    console.log('📂 Files:', req.files);
    console.log('📝 Body:', req.body);

    if (err) {
      console.error('💥 Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    uploadController.handleUpload(req, res);
  });
});

module.exports = router;
