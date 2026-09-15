const StudioSettings = require('../models/StudioSettings');

const getOrCreateSettings = async () => {
  let settings = await StudioSettings.findOne();
  if (!settings) settings = await StudioSettings.create({});
  return settings;
};

// @desc  Get studio settings
// @route GET /api/studio
// @access Public
const getStudio = async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, data: settings });
};

// @desc  Update studio settings
// @route PUT /api/studio
// @access Private (admin only)
const updateStudio = async (req, res) => {
  const settings = await getOrCreateSettings();
  const fields = ['studioName', 'email', 'phone', 'whatsapp', 'instagram', 'youtube', 'address', 'description'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) settings[field] = req.body[field];
  });
  await settings.save();
  res.json({ success: true, data: settings });
};

module.exports = { getStudio, updateStudio };
