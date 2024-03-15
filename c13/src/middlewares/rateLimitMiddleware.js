const rateLimit = require('express-rate-limit');

// Function to create a custom rate limit middleware with error handling
function createRateLimitMiddleware(options) {
  const rateLimiter = rateLimit(options);

  return (req, res, next) => {
    rateLimiter(req, res, (err) => { // Handle rate limit errors
      if (err) {
        console.error('Rate limit exceeded:', err.message);
        res.status(err.statusCode || 429).send(err.message || 'Too many requests, please try again later');
      } else {
        next(); // Pass control to next middleware if no error
      }
    });
  };
}

// Example usage:
const allRouteRateLimit = createRateLimitMiddleware({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Allow 50 calls per IP within the window
  message: 'Rate limit exceeded',
  statusCode: 429, // Set a specific status code (optional)
});

const deleteTasksRateLimit = createRateLimitMiddleware({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10, // Allow 50 calls per IP within the window
  message: 'Rate limit exceeded',
  statusCode: 429, // Set a specific status code (optional)
});

const updateProfileRateLimit = createRateLimitMiddleware({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 2, // Allow 50 calls per IP within the window
  message: 'Rate limit exceeded',
  statusCode: 429, // Set a specific status code (optional)
});

module.exports = { allRouteRateLimit, deleteTasksRateLimit, updateProfileRateLimit };
