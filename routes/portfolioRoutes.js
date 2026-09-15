const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} = require('../controllers/portfolioController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/', asyncHandler(getPortfolio));
router.get('/:id', asyncHandler(getPortfolioItem));
router.post('/', protectAdmin, upload.single('image'), asyncHandler(createPortfolioItem));
router.put('/:id', protectAdmin, upload.single('image'), asyncHandler(updatePortfolioItem));
router.delete('/:id', protectAdmin, asyncHandler(deletePortfolioItem));

module.exports = router;
