const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
// Note: there is NO public register route. The only admin account is
// created once via `npm run create-admin` (seed/createAdmin.js), and only
// the email in ADMIN_EMAIL is permitted to log in — see authMiddleware.js
// for the second layer of this check on every protected request.
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const allowedEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  if (email.toLowerCase().trim() !== allowedEmail) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({
    success: true,
    data: {
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
    },
  });
};

// @desc    Get current logged-in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({ success: true, data: req.admin });
};

module.exports = { login, getMe };
