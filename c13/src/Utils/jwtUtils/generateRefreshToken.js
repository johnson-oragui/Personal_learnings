const jwt = require('jsonwebtoken');

/**
 * Generates a new refresh token.
 *
 * @param {Object} user - The user object containing id and username.
 * @returns {string} - The generated refresh token.
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const options = {
    expiresIn: '7d',
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,

  };

  const secretKey = process.env.JWT_FRESH_TOKEN_SECRET;

  try {
    const refreshToken = jwt.sign(payload, secretKey, options);

    console.log('successfully generated refreshToken', refreshToken);

    return refreshToken;
  } catch (error) {
    console.error('successfully generated refreshToken', error.message);
    throw new Error('Failed to generate refreshToken');
  }
};

module.exports = generateRefreshToken;
