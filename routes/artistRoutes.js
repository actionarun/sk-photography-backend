const express = require('express');
const router = express.Router();
const { getArtist, updateArtist } = require('../controllers/artistController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getArtist);
router.put('/', protectAdmin, upload.single('image'), updateArtist);

module.exports = router;
