const User = require('../models/userModel');

const deleteOldRefreshToken = async (refreshToken, userId) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, refreshToken },
      { refreshToken: null },
    );
    return !!user;
  } catch (error) {
    console.error('Failed to delete refreshTokens: ', error.message);
    throw new Error('Failed to delete refreshTokens');
  }
};

module.exports = deleteOldRefreshToken;
