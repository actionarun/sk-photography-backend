const cloudinary = require('../config/cloudinary');

// Fails fast with a clear message if the Cloudinary env vars are missing
// or blank, instead of letting the SDK fail later with a vague 401/403.
const assertCloudinaryConfig = () => {
  const { cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret } = cloudinary.config();
  const missing = [];
  if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!apiKey) missing.push('CLOUDINARY_API_KEY');
  if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');
  if (missing.length) {
    const err = new Error(`Cloudinary is not configured. Missing: ${missing.join(', ')}`);
    err.statusCode = 500;
    throw err;
  }
};

// Uploads a buffer (from multer memoryStorage) to Cloudinary using an
// upload_stream, and returns { url, publicId }. Cloudinary's own error
// text is surfaced so the API response says what actually went wrong
// (bad credentials, account restriction, file too large, etc.) instead
// of a bare 500.
const uploadBufferToCloudinary = (buffer, folder) => {
  assertCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload failed:', {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
            cloud_name: cloudinary.config().cloud_name,
          });
          const err = new Error(
            `Cloudinary upload failed (${error.http_code || 'no code'}): ${error.message || 'unknown error'}`
          );
          err.statusCode = 502;
          return reject(err);
        }
        if (!result || !result.secure_url) {
          return reject(new Error('Cloudinary returned no URL for the uploaded image'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.on('error', (streamErr) => {
      console.error('Cloudinary stream error:', streamErr);
      reject(streamErr);
    });
    stream.end(buffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // A failed cleanup should never block the main operation; just log it.
    console.error('Cloudinary delete failed:', err.message);
  }
};

module.exports = { uploadBufferToCloudinary, deleteFromCloudinary };
