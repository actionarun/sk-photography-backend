const mongoose = require('mongoose');

const studioSettingsSchema = new mongoose.Schema(
  {
    studioName: { type: String, default: 'Stuart Photography' },
    email: { type: String, default: 'Stuartphotography21@gmail.com' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: 'https://wa.me/918870189856' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    address: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudioSettings', studioSettingsSchema);
