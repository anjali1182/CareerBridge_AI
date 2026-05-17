const express = require('express');
const { recommendCareer, analyzeResume, chatCareer, getChatStatus } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/recommend', recommendCareer);
router.post('/resume', analyzeResume);
router.get('/chat/status', protect, getChatStatus);
router.post('/chat', protect, chatCareer);
module.exports = router;
