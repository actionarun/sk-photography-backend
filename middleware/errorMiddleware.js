const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Prefer an explicit statusCode set by the thrower (e.g. Cloudinary
  // failures set 502), then any status already on the response.
  const statusCode =
    err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  console.error(`[${req.method} ${req.originalUrl}] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
