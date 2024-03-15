/* eslint-disable no-await-in-loop */
const User = require('../models/userModel');
const { tokenLogger } = require('../Utils/logger');

const expireRevokedTokens = async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      const now = Date.now();
      let numOfAccessTokensRemoved = 0;
      let numOfRefreshTokensRemoved = 0;

      // Delete expired revoked access tokens
      const updatedToken = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $pull: {
            revokedAccessTokens: {
              createdAt: { $lt: now - (5 * 60 * 1000) }, // Less than 5 minutes ago
            },
          },
        },
      );
      // Count removed access tokens
      numOfAccessTokensRemoved = user.revokedAccessTokens.length - updatedToken.revokedAccessTokens.length;
      // Log information about removed tokens
      tokenLogger(numOfAccessTokensRemoved, 'Access Token(s)', updatedToken._id);

      // Delete expired revoked refresh tokens
      const updatedRefreshToken = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $pull: {
            revokedRefreshTokens: {
              createdAt: { $lt: now - (7 * 24 * 60 * 60 * 1000) }, // Less than 7 days ago
            },
          },
        },
      );
      // Count removed refresh tokens
      numOfRefreshTokensRemoved = user.revokedRefreshTokens.length - updatedRefreshToken.revokedRefreshTokens.length;
      // Log information about removed tokens
      tokenLogger(numOfRefreshTokensRemoved, 'Refresh Token(s)', updatedToken._id);
    }
    console.log('logging/expire tokens fired: ');
  } catch (error) {
    console.error('Error clearing revoked tokens:', error);
    throw new Error('Error clearing revoked tokens');
  }
};

module.exports = expireRevokedTokens;
