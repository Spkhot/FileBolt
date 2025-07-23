const express = require('express');
const router = express.Router();
const deleteController = require('../controllers/deleteController');

router.delete('/:code', deleteController.handleDelete);

module.exports = router;
