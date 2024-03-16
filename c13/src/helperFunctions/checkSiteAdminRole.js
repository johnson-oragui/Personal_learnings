const User = require('../models/userModel');

const checkSiteAdminRole = async (userId, userData) => {
  try {
    const siteAdminExists = await User.exists({ role: 'siteAdmin' });
    const currentUser = await User.findOne({ _id: userId });
    if (siteAdminExists && currentUser.role === 'user' && userData.role === 'siteAdmin') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('error in siteAdminCheck: ', error.message);
    throw new Error('Failed to check site admin role');
  }
};

module.exports = checkSiteAdminRole;
