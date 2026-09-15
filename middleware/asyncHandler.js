// Wraps an async Express route handler so any rejected promise (thrown
// error) is passed to next(err) instead of crashing the process with an
// unhandled promise rejection. Without this, a single failed upload,
// missing Cloudinary config, or bad file could take the whole backend
// down (which shows up to the frontend as a CORS error / 502).
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
