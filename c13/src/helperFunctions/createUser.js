const User = require('../models/userModel');
const checkSiteAdminRole = require('./checkSiteAdminRole');

const createUser = async (userdata) => {
  try {
    // checks for siteAdmin role, returns boolean
    const siteAdminExists = await checkSiteAdminRole();
    if (siteAdminExists) {
      throw new Error('site admin already exists');
    }
    // const allUsers = await User.find();
    // console.log('allUsers: ', allUsers);

    const existsEmail = await User.exists({ email: userdata.email });
    if (existsEmail) {
      return 'email';
    }
    const existsUsername = await User.exists({ email: userdata.username });
    if (existsUsername) {
      return 'username';
    }
    const userModel = new User(userdata);
    const newUser = await userModel.save();
    console.log('New user created:', newUser);
    return newUser;
  } catch (error) {
    console.error('failed to create user: ', error);
    throw new Error('Failed to create user');
  }
};

module.exports = createUser;
