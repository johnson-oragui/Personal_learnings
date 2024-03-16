const User = require('../models/userModel');

const compareRefreshToken = async (refreshToken, userId) => {
  try {
    const user = await User.findOne({ _id: userId, refreshToken });
    return !!user;
  } catch (error) {
    console.error('Failed to compare refreshTokens: ', error.message);
    throw new Error('Failed to compare refreshTokens');
  }
};

module.exports = compareRefreshToken;
