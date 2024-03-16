const User = require('../models/userModel');
const checkSiteAdminRole = require('./checkSiteAdminRole');

const deleteUser = async (userId) => {
  try {
    // returns true if userId is siteAdmin
    const siteAdminExists = await checkSiteAdminRole(userId);
    if (siteAdminExists) {
      throw new Error('Cannot delete site admin');
    }
    const deletedUser = await User.findOneAndDelete({ _id: userId });
    if (!deletedUser) {
      return 'User not found';
    }
    return 'User deleted successfully';
  } catch (error) {
    console.error('Failed to delete user', error.message);
    throw new Error('Failed to delete user');
  }
};

module.exports = deleteUser;
