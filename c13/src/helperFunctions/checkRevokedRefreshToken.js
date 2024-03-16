const User = require('../models/userModel');

const checkRevokedRefreshToken = async (refreshToken, userId) => {
  try {
    const user = await User.findOne({
      _id: userId,
      revokedRefreshTokens: { $elemMatch: { refreshToken } },
    },);
    return !!user;
  } catch (error) {
    console.error('Failed to check if refreshTokens is revoked: ', error.message);
    throw new Error('Failed to check if refreshTokens is revoked');
  }
};

module.exports = checkRevokedRefreshToken;
