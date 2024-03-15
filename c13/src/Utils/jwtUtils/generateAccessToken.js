const jwt = require('jsonwebtoken');

/**
 * Generates a new access token.
 *
 * @param {Object} user - The user object containing id and username.
 * @returns {string} - The generated access token.
 */
const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const options = {
    expiresIn: '10m',
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };

  const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET;

  try {
    const token = jwt.sign(payload, secretKey, options);
    console.log('access token generated: ', token);

    return token;
  } catch (error) {
    console.error('error generating acces token: ', error.message);
    throw new Error('Failed to generate access token');
  }
};

module.exports = generateAccessToken;
