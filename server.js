require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const artistRoutes = require('./routes/artistRoutes');
const studioRoutes = require('./routes/studioRoutes');

connectDB();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));

// TEMPORARY diagnostic route: pings Cloudinary's Admin API using the
// configured credentials, so we can confirm whether CLOUDINARY_CLOUD_NAME /
// API_KEY / API_SECRET on Render are actually valid, without needing shell
// access (not available on Render's free plan). Remove this route once the
// Cloudinary upload issue is resolved — it should not stay in production.
app.get('/api/debug/cloudinary-ping', async (req, res) => {
  const cloudinary = require('./config/cloudinary');
  try {
    const result = await cloudinary.api.ping();
    res.json({ success: true, result, cloud_name: cloudinary.config().cloud_name });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      http_code: err.http_code,
      name: err.name,
      cloud_name: cloudinary.config().cloud_name,
    });
  }
});

// TEMPORARY: tests an actual signed upload (a 1x1 pixel PNG, embedded as a
// data URI so no file needs to be sent) using the Upload API — as opposed
// to /api/debug/cloudinary-ping which only tests the Admin API. If ping
// succeeds but this fails, the credentials are valid but lack upload
// permission (a restricted/scoped API key) or something else is specific
// to the Upload API. Remove both debug routes once resolved.
app.get('/api/debug/cloudinary-upload-test', async (req, res) => {
  const cloudinary = require('./config/cloudinary');
  const onePixelPng =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  try {
    const result = await cloudinary.uploader.upload(onePixelPng, {
      folder: 'stuart-photography/debug-test',
    });
    res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      http_code: err.http_code,
      name: err.name,
      cloud_name: cloudinary.config().cloud_name,
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/studio', studioRoutes);

app.use(notFound);
app.use(errorHandler);

// Startup visibility: confirms which Cloudinary vars actually reached the
// running service (never logs the secret itself).
console.log('Cloudinary config check:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'MISSING',
  api_key_present: Boolean(process.env.CLOUDINARY_API_KEY),
  api_secret_present: Boolean(process.env.CLOUDINARY_API_SECRET),
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Safety net: log (rather than silently crash on) any promise rejection
// that slips past asyncHandler, so Render logs show the real cause
// instead of the service just going down with a 502.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
