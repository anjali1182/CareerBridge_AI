const express = require('express');
const { applyJob, getUserApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/', protect, applyJob);
router.get('/', protect, getUserApplications);
module.exports = router;
