const mongoose = require('mongoose');

const STATUSES = ['Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      required: true,
      enum: ['Wedding', 'Portrait', 'Outdoor', 'Baby Shoot', 'Traditional', 'Other'],
    },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    message: { type: String, trim: true, default: '' },
    status: { type: String, enum: STATUSES, default: 'Pending' },
  },
  { timestamps: true }
);

enquirySchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model('Enquiry', enquirySchema);
