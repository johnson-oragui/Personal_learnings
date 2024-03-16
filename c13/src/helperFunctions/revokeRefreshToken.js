const User = require('../models/userModel');

const revokeRefreshToken = async (refreshToken, userId) => {
  try {
    if (!refreshToken) {
      console.log('refreshToken is null from revokeRefreshToken: ', refreshToken);
      return null;
    }
    const user = await User.findOneAndUpdate(
      { _id: userId, refreshToken },
      { $push: { revokedRefreshTokens: { refreshToken: String(refreshToken), createAt: Date.now() } } },
    );
    return !!user;
  } catch (error) {
    console.error('Failed to revoke refreshTokens');
    throw new Error('Failed to revoke refreshTokens');
  }
};

module.exports = revokeRefreshToken;
