const express = require('express');
const router = express.Router();

// Import the specific controller for text notes
const textController = require('../controllers/textController');

// --- Text Note API Routes ---

// @route   POST /api/text/upload
// @desc    Create a new text note
// @access  Public
router.post('/upload', textController.handleTextUpload);

// @route   GET /api/text/download/:code
// @desc    Retrieve a text note by its code
// @access  Public
router.get('/download/:code', textController.handleTextDownload);

// @route   DELETE /api/text/delete/:code
// @desc    Delete a text note by its code
// @access  Public
router.delete('/delete/:code', textController.handleTextDelete);

module.exports = router;