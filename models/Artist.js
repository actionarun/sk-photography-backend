const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Stuart' },
    imageUrl: { type: String, default: '' },
    cloudinaryPublicId: { type: String, default: '' },
    bio: { type: String, default: '' },
    quote: { type: String, default: 'Every moment deserves to be captured beautifully.' },
    experience: { type: String, default: '' },
    specialization: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artist', artistSchema);
