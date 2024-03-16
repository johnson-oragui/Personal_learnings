const User = require('../models/userModel');

const revokeAccessToken = async (token, userId) => {
  try {
    console.log('token from revokeAccessToken: ', token);
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { revokedAccessTokens: { token: String(token), createAt: Date.now() } } },
      { upsert: true, new: true },
    );
    return !!user;
  } catch (error) {
    console.error('Failed to revoke Token: ', error.message);
    throw new Error('Failed to revoke Token');
  }
};

module.exports = revokeAccessToken;
