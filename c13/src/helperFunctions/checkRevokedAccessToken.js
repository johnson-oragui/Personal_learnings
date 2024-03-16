const User = require('../models/userModel');

const checkRevokedToken = async (token, userId) => {
  try {
    const user = await User.findOne({
      _id: userId,
      revokedAccessTokens: { $elemMatch: { token } },
    });
    return !!user;
  } catch (error) {
    console.error('Failed to check if Token is revoked: ', error.message);
    throw new Error('Failed to check if Token is revoked');
  }
};

module.exports = checkRevokedToken;
