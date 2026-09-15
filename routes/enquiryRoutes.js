const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protectAdmin } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/', asyncHandler(createEnquiry));
router.get('/', protectAdmin, asyncHandler(getEnquiries));
router.get('/:id', protectAdmin, asyncHandler(getEnquiry));
router.put('/:id', protectAdmin, asyncHandler(updateEnquiry));
router.delete('/:id', protectAdmin, asyncHandler(deleteEnquiry));

module.exports = router;
