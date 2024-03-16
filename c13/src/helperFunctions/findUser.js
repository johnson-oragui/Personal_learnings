const User = require('../models/userModel');

const findUser = async (userdata) => {
  try {
    // const allUsers = await User.find();
    // console.log('allUsers: ', allUsers);

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
