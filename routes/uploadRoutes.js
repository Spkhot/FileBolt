const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }
}).array('files', 5);

router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    uploadController.handleUpload(req, res);
  });
});

module.exports = router;
