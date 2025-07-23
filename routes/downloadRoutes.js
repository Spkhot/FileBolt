const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

router.get('/:code', downloadController.handleDownload);

module.exports = router;
