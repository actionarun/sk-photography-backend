const express = require('express');
const router = express.Router();
const { getStudio, updateStudio } = require('../controllers/studioController');
const { protectAdmin } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/', asyncHandler(getStudio));
router.put('/', protectAdmin, asyncHandler(updateStudio));

module.exports = router;
