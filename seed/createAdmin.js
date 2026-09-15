// Run once with: npm run create-admin
// Creates (or resets the password of) the single admin account allowed to
// log in — the email is taken from ADMIN_EMAIL in .env. This script also
// removes any other Admin documents, so there is never more than one
// account and it can never belong to a different email.
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const run = async () => {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_INITIAL_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD in server/.env before running this script.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  // Remove any admin accounts that are not the allowed one.
  await Admin.deleteMany({ email: { $ne: email } });

  let admin = await Admin.findOne({ email });
  if (admin) {
    admin.password = password; // pre-save hook re-hashes it
    await admin.save();
    console.log(`Password updated for existing admin: ${email}`);
  } else {
    admin = await Admin.create({ email, password });
    console.log(`Admin account created: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
