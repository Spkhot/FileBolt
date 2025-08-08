const TextNote = require('../models/TextNote');
const generateCode = require('../utils/generateCode'); // Assuming you have this utility

// 1. Controller to create a new text note
exports.handleTextUpload = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate that a message was actually sent
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const code = generateCode();

    const newNote = new TextNote({
      code,
      message: message.trim(),
    });

    await newNote.save();
    console.log(`Saved text note with code: ${code}`);

    res.status(200).json({ code });

  } catch (err) {
    console.error('Text note creation failed:', err);
    res.status(500).json({ error: 'Failed to create note. Please try again.' });
  }
};


// 2. Controller to retrieve a text note
exports.handleTextDownload = async (req, res) => {
  try {
    const { code } = req.params;
    const note = await TextNote.findOne({ code });

    if (!note) {
      return res.status(404).json({ error: 'Code not found or has expired.' });
    }

    // Send back only the message
    res.json({ message: note.message });

  } catch (err) {
    console.error(`Error retrieving note for code ${code}:`, err);
    res.status(500).json({ error: 'An internal error occurred.' });
  }
};


// 3. Controller to delete a text note
exports.handleTextDelete = async (req, res) => {
  try {
    const { code } = req.params;
    const note = await TextNote.findOne({ code });

    if (!note) {
      return res.status(404).json({ error: 'Code not found or has expired.' });
    }

    await note.deleteOne();
    res.json({ message: 'Note has been successfully deleted.' });

  } catch (err) {
    console.error(`Error deleting note for code ${code}:`, err);
    res.status(500).json({ error: 'An internal error occurred.' });
  }
};