const User = require('../models/userModel');
const checkSiteAdminRole = require('./checkSiteAdminRole');

const updateUser = async (userId, userData) => {
  try {
    // checks if siteAdmin exists, returns boolean
    const siteAdminExists = await checkSiteAdminRole(userId, userData);
    if (siteAdminExists) {
      throw new Error('SiteAdmin already exists');
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { refreshToken: userData.refreshToken } },
      { upsert: true, new: true },
    );

    console.log('New user created:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('failed to update user: ', error.message);
    throw new Error('Failed to update user');
  }
};

module.exports = updateUser;
