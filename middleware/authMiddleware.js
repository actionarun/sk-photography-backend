const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// protectAdmin: verifies the JWT AND enforces that the token belongs to the
// single allowed admin account (ADMIN_EMAIL). This is a deliberate extra
// safety net: even if another Admin document were ever created in the
// database by mistake, only the account matching ADMIN_EMAIL can perform
// any CRUD action anywhere in the app.
const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
    }

    const allowedEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    if (!allowedEmail || admin.email.toLowerCase().trim() !== allowedEmail) {
      return res.status(403).json({
        success: false,
        message: 'This account is not permitted to perform admin actions',
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protectAdmin };
