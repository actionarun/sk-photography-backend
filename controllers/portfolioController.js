const Portfolio = require('../models/Portfolio');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc  Get all portfolio items (optionally filtered by category)
// @route GET /api/portfolio?category=Traditional
// @access Public
const getPortfolio = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const items = await Portfolio.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
};

// @desc  Get single portfolio item
// @route GET /api/portfolio/:id
// @access Public
const getPortfolioItem = async (req, res) => {
  const item = await Portfolio.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Image not found' });
  res.json({ success: true, data: item });
};

// @desc  Create portfolio item (uploads image to Cloudinary)
// @route POST /api/portfolio
// @access Private (admin only)
const createPortfolioItem = async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !category) {
    return res.status(400).json({ success: false, message: 'Title and category are required' });
  }
  if (!Portfolio.CATEGORIES.includes(category)) {
    return res.status(400).json({ success: false, message: 'Invalid category' });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image file is required' });
  }

  const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, 'stuart-photography/portfolio');

  const item = await Portfolio.create({
    title,
    description: description || '',
    category,
    imageUrl: url,
    cloudinaryPublicId: publicId,
  });

  res.status(201).json({ success: true, data: item });
};

// @desc  Update portfolio item (image optional)
// @route PUT /api/portfolio/:id
// @access Private (admin only)
const updatePortfolioItem = async (req, res) => {
  const item = await Portfolio.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Image not found' });

  const { title, description, category } = req.body;
  if (category && !Portfolio.CATEGORIES.includes(category)) {
    return res.status(400).json({ success: false, message: 'Invalid category' });
  }

  if (req.file) {
    const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, 'stuart-photography/portfolio');
    await deleteFromCloudinary(item.cloudinaryPublicId);
    item.imageUrl = url;
    item.cloudinaryPublicId = publicId;
  }

  if (title !== undefined) item.title = title;
  if (description !== undefined) item.description = description;
  if (category !== undefined) item.category = category;

  await item.save();
  res.json({ success: true, data: item });
};

// @desc  Delete portfolio item (removes DB record + Cloudinary image)
// @route DELETE /api/portfolio/:id
// @access Private (admin only)
const deletePortfolioItem = async (req, res) => {
  const item = await Portfolio.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Image not found' });

  await deleteFromCloudinary(item.cloudinaryPublicId);
  await item.deleteOne();

  res.json({ success: true, message: 'Image deleted' });
};

module.exports = {
  getPortfolio,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
};
