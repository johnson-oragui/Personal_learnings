const jwt = require('jsonwebtoken');

/**
 * Verifies an access token.
 *
 * @param {string} token - The access token to verify.
 * @returns {Object} - An object indicating success or failure along with decoded data.
 */
const verifyAccessToken = (token) => {
  const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET;

  const options = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };
  try {
    const decodedPayload = jwt.verify(token, secretKey, options);

    console.log('acces token verified: ', { success: true, data: decodedPayload });

    return { success: true, data: decodedPayload };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Access token expired:', error.message);
      return { success: false, error: new Error('Access token expired'), error1: jwt.TokenExpiredError };
    }
    console.error('Error verifying access token:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = verifyAccessToken;
