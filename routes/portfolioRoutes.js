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

router.get('/', getPortfolio);
router.get('/:id', getPortfolioItem);
router.post('/', protectAdmin, upload.single('image'), createPortfolioItem);
router.put('/:id', protectAdmin, upload.single('image'), updatePortfolioItem);
router.delete('/:id', protectAdmin, deletePortfolioItem);

module.exports = router;
