const User = require('../models/userModel');

const updateRefreshToken = async (newRefreshToken, userId) => {
  try {
    const user = await User.findOneAndUpdate({ _id: userId }, { refreshToken: newRefreshToken });
    return !!user;
  } catch (error) {
    console.error('Failed to update refreshTokens');
    throw new Error('Failed to update refreshTokens');
  }
};

module.exports = updateRefreshToken;
