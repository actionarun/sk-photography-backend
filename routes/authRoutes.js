const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/login', asyncHandler(login));
router.get('/me', protectAdmin, asyncHandler(getMe));

module.exports = router;
