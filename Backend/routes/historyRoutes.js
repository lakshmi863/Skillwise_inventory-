const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/:id/history', authenticateToken, historyController.getProductHistory);

module.exports = router;