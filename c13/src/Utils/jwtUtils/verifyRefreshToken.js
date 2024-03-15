const jwt = require('jsonwebtoken');

/**
 * Verifies a refresh token.
 *
 * @param {string} token - The refresh token to verify.
 * @returns {Object} - An object indicating success or failure along with decoded data.
 */
const verifyRefreshToken = (refreshToken) => {
  const secretKey = process.env.JWT_FRESH_TOKEN_SECRET;

  const options = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };
  try {
    const decodedPayload = jwt.verify(refreshToken, secretKey, options);

    console.log('successfully verified refresh token: ', { success: true, data: decodedPayload });

    return { success: true, data: decodedPayload };
  } catch (error) {
    if (error.message === 'jwt expired' || error.name === 'TokenExpiredError') {
      return { success: false, error: new Error('refreshToken expired') };
    }
    console.error('error in verifyRefreshToken: ', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = verifyRefreshToken;
