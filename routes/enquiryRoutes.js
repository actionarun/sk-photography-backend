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

router.post('/', createEnquiry);
router.get('/', protectAdmin, getEnquiries);
router.get('/:id', protectAdmin, getEnquiry);
router.put('/:id', protectAdmin, updateEnquiry);
router.delete('/:id', protectAdmin, deleteEnquiry);

module.exports = router;
