const User = require('../models/userModel');

const confirmUserId = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('error in confirmUser: ', error.message);
    throw new Error('Fialed to confirm UserId');
  }
};

module.exports = confirmUserId;
