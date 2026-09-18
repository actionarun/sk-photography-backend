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



