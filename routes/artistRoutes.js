const express = require('express');
const router = express.Router();
const { getArtist, updateArtist } = require('../controllers/artistController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/', asyncHandler(getArtist));
router.put('/', protectAdmin, upload.single('image'), asyncHandler(updateArtist));

module.exports = router;
