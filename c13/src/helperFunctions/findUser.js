const User = require('../models/userModel');

const findUser = async (userdata = {}, userId = '') => {
  try {
    // retrieve user if userId is provided, strictly for siteAdmin
    if (userId) {
      const users = await User.findOne({ _id: userId });
      console.log('Users from find user: ', users);
      return userId;
    }

    const existsEmail = await User.findOne({ email: userdata.email });
    if (existsEmail) {
      return existsEmail;
    }
    const existsUsername = await User.findOne({ username: userdata.username });
    if (existsUsername) {
      return existsUsername;
    }
    return null;
  } catch (error) {
    console.error('failed to find user: ', error);
    throw new Error('Failed to find user');
  }
};

module.exports = findUser;
