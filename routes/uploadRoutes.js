const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB per file
}).array('files', 5);

router.post('/', (req, res) => {
  upload(req, res, (err) => {
    console.log('Incoming upload request...');
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }

    console.log('Files received:', req.files);

    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded.');
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    uploadController.handleUpload(req, res);
  });
});


module.exports = router;
