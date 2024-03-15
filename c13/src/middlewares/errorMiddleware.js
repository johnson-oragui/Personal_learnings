const { errorLogger } = require('../Utils/logger');

const errorMiddleware = (err, req, res, next) => {
  errorLogger(err, req, res, next);
  console.error('Error:', err.message);

  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = 'Bad Request: Validation Error';
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = 'Unauthorized';
  }

  if (err.statusCode === 403) {
    statusCode = 403;
    errorMessage = 'Forbidden';
  }

  if (err.statusCode === 404) {
    statusCode = 404;
    errorMessage = 'Not Found';
  }

  if (err.statusCode === 405) {
    statusCode = 405;
    errorMessage = 'Method Not Allowed';
  }

  if (err.statusCode === 501) {
    statusCode = 501;
    errorMessage = 'Not Implemented';
  }

  if (err.statusCode === 502) {
    statusCode = 502;
    errorMessage = 'Bad Gateway';
  }

  if (err.statusCode === 503) {
    statusCode = 503;
    errorMessage = 'Service Unavailable';
  }

  // Send generic error for production, detailed for development
  const isProduction = process.env.NODE_ENV === 'production';
  const prod = { error: errorMessage, statusCode };
  const dev = { error: errorMessage, stackTrace: err.stack };

  const errorResponse = isProduction ? prod : dev;

  res.status(statusCode).json(errorResponse);
  next();
};

module.exports = errorMiddleware;
