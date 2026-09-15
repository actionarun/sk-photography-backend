const mongoose = require('mongoose');

const CATEGORIES = ['Traditional', 'Portraits', 'Outdoor', 'Baby Shoot'];

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, required: true, enum: CATEGORIES },
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
  },
  { timestamps: true }
);

portfolioSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Portfolio', portfolioSchema);
