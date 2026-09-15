const Enquiry = require('../models/Enquiry');

// @desc  Submit a new enquiry
// @route POST /api/enquiries
// @access Public
const createEnquiry = async (req, res) => {
  const { name, email, phone, eventType, eventDate, location, message } = req.body;

  if (!name || !email || !phone || !eventType || !eventDate || !location) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email' });
  }

  const enquiry = await Enquiry.create({
    name,
    email,
    phone,
    eventType,
    eventDate,
    location,
    message: message || '',
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! We will contact you soon.',
    data: enquiry,
  });
};

// @desc  Get all enquiries
// @route GET /api/enquiries
// @access Private (admin only)
const getEnquiries = async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json({ success: true, count: enquiries.length, data: enquiries });
};

// @desc  Get single enquiry
// @route GET /api/enquiries/:id
// @access Private (admin only)
const getEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
  res.json({ success: true, data: enquiry });
};

// @desc  Update enquiry (status)
// @route PUT /api/enquiries/:id
// @access Private (admin only)
const updateEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

  const { status } = req.body;
  if (status && !Enquiry.STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  if (status) enquiry.status = status;

  await enquiry.save();
  res.json({ success: true, data: enquiry });
};

// @desc  Delete enquiry
// @route DELETE /api/enquiries/:id
// @access Private (admin only)
const deleteEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
  await enquiry.deleteOne();
  res.json({ success: true, message: 'Enquiry deleted' });
};

module.exports = { createEnquiry, getEnquiries, getEnquiry, updateEnquiry, deleteEnquiry };
