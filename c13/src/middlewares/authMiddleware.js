const checkRevokedAccessToken = require('../helperFunctions/checkRevokedAccessToken');
const verifyAccessToken = require('../Utils/jwtUtils/verifyAccessToken');

/**
 * authenticationMiddleware
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const authenticationMiddleware = async (req, res, next) => {
  // Exclude refresh route from expiration/revokedToken check
  const { userId } = req.params;
  if (req.path === `/api/todo/profile/${userId}/refresh`) {
    return next();
  }

  // Token for authentication
  let token;
  if (req.headers.authorization) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('token: ', token);

  if (!token) {
    console.error('token missing: ', typeof token);
    return res.status(400).json({ error: 'token missing, send your token' });
  }
  console.log('token from authMiddleware: ', token);

  // returns true of token is revoked from user log out
  // eslint-disable-next-line max-len
  const tokenRevoked = await checkRevokedAccessToken(String(token), userId);
  if (tokenRevoked) {
    console.error('token revoked from user log out');
    return res.status(401).json({ error: 'Token has been revoked' });
  }

  try {
    // Verify and decode the access token
    const vToken = verifyAccessToken(token);

    if (vToken.success === false && vToken.error === 'jwt malformed') {
      return res.status(404).json({ error: 'unauthorized, token malformed' });
    }
    if (vToken.error && vToken.error.message === 'Access token expired') {
      return res.status(400).json({ error: 'token expired', message: 'visit the refresh route with refreshToken to refresh token' });
    }
    return next();
  } catch (error) {
    console.error('Error in authenticationMiddleware: ', error.message);
    return next(error);
  }
};

module.exports = authenticationMiddleware;
