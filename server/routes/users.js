const express = require('express');
const { getProfile, updateProfile, saveJob } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.route('/save').post(protect, saveJob);
module.exports = router;
