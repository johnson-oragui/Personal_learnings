const jwt = require('jsonwebtoken');
const compareRefreshToken = require('../helperFunctions/compareRefreshToken');
const generateAccessToken = require('../Utils/jwtUtils/generateAccessToken');
const generateRefreshToken = require('../Utils/jwtUtils/generateRefreshToken');
const verifyRefreshToken = require('../Utils/jwtUtils/verifyRefreshToken');
const checkRevokedRefreshToken = require('../helperFunctions/checkRevokedRefreshToken');
const revokeRefreshToken = require('../helperFunctions/revokeRefreshToken');
const deleteOldRefreshToken = require('../helperFunctions/deleteOldRefreshToken');
const updateRefreshToken = require('../helperFunctions/updateRefreshToken');
const checkRevokedAccessToken = require('../helperFunctions/checkRevokedAccessToken');
const verifyAccessToken = require('../Utils/jwtUtils/verifyAccessToken');

/**
 * @description Middleware to refresh the user's access token using the refresh token
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
class RefreshToken {
  static async refreshToken(req, res, next) {
    // ##################################################################
    // ACCESS TOKEN CHECK
    try {
      // Token for authentication
      let token = null;

      // Extract token from different sources
      if (req.headers.authorization) {
        // eslint-disable-next-line prefer-destructuring
        token = req.headers.authorization.split(' ')[1];
      }
      console.log('refrshToken controller, token: ', token);

      if (!token) {
        console.error('token missing from refreshToken controller');
        return res.status(400).json({ error: 'token missing, send your token and refreshToken via cookie' });
      }

      const { userId } = req.params;

      // returns true of token is revoked from user log out
      // eslint-disable-next-line max-len
      const tokenRevoked = await checkRevokedAccessToken(token, userId);
      if (tokenRevoked) {
        console.error('token revoked from user log out');
        return res.status(401).json({ error: 'Token has been revoked by User logout' });
      }
      // Verify and decode the access token
      const vToken = verifyAccessToken(token);

      if (vToken.success && vToken.data) {
        // Token is valid, no need to refresh
        return res.status(200).json({ message: 'Token is still valid' });
      }

      if (vToken.success === false && vToken.error === 'jwt malformed') {
        console.error('token malformed from refrshtoken controller', vToken.error);
        return res.status(404).json({ error: 'unauthorized, token malformed' });
      }
      if (!(vToken.error.message === 'Access token expired') || !(vToken.error instanceof Error) || vToken.error1 !== jwt.TokenExpiredError) {
        return res.status(400).json({ error: 'token still valid, authorize with token or logout to invalidate token' });
      }
      // #########################################################################
      // REFRESHTOKEN CHECK

      // extract tokens
      const { refreshToken } = req.body;
      // const { userId } = req.params.userId;

      // check for token and refresh token
      if (!refreshToken) {
        return res.status(403).json({ message: 'refreshToken Missing' });
      }

      // try verifying refreshtoken with jwt verify
      const rTokenVerified = await verifyRefreshToken(refreshToken);

      // if refreshToken is invalid or malformed
      if (rTokenVerified.success === false && rTokenVerified.error === 'jwt malformed') {
        console.log('refreshToken malformed: ', rTokenVerified.error);
        return res.status(400).json({ error: 'refreshToken malformed' });
      }
      if (rTokenVerified.error === 'refreshToken expired' || rTokenVerified.error instanceof Error) {
        // add old refreshToken to revokedToken in the database
        await revokeRefreshToken(refreshToken, userId);
        // delete old refreshToken from the database
        await deleteOldRefreshToken(refreshToken, userId);
        console.log('refreshToken expired', rTokenVerified.error);
        return res.status(400).json({ error: 'refreshToken expired, please login again' });
      }
      // compare refreshToken from cookies with refreshToken from database
      // returns true if it is a match
      const refreshTokenResult = await compareRefreshToken(refreshToken, userId);
      //
      if (!refreshTokenResult || refreshTokenResult === false) {
        // add old refreshToken to revokedToken in the database
        await revokeRefreshToken(refreshToken, userId);
        // delete old refreshToken from the database
        await deleteOldRefreshToken(refreshToken, userId);
        // delete old refreshToken from cookie
        return res.status(404).json({ error: 'refreshToken invalid' });
      }

      // check if the provided refreshToken is revoked, returns true if revoked
      const refreshTokenIsRevoked = await checkRevokedRefreshToken(refreshToken, userId);
      if (refreshTokenIsRevoked) {
        // delete old refreshToken from the database
        await deleteOldRefreshToken(refreshToken, userId);
        // delete old refreshToken from cookie
        res.status(404).json({ error: 'refreshToken revoked/already used' });
      }

      // generate new token
      const newAccessToken = await generateAccessToken({
        id: rTokenVerified.data.id,
        username: rTokenVerified.data.username,
        role: rTokenVerified.data.role,
      });

      // generate new refreshToken
      const newRefreshToken = await generateRefreshToken({
        id: rTokenVerified.data.id,
        username: rTokenVerified.data.username,
        role: rTokenVerified.data.role,
      });
      // add old refreshToken to revokedToken in the database
      await revokeRefreshToken(refreshToken, userId);

      // delete old refreshToken from the database
      await deleteOldRefreshToken(refreshToken, userId);

      // update the refreshToken in the database with the new refreshToken
      await updateRefreshToken(newRefreshToken, userId);

      // set a new access token to auth header
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);

      // return new tokens
      return res.status(200).json({ refreshToken: newRefreshToken });
    } catch (error) {
      console.error('error in refreshToken controller: ', error.message);
      next(error);
      throw new Error('Failed to refreshToken: ', error.message);
    }
  }
}

module.exports = RefreshToken;
