const express = require('express');
const router = express.Router();
const { getStudio, updateStudio } = require('../controllers/studioController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getStudio);
router.put('/', protectAdmin, updateStudio);

module.exports = router;
