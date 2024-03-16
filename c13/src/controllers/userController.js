const findUser = require('../helperFunctions/findUser');
const deleteUser = require('../helperFunctions/deleteUser');
const usernameConstraints = require('../helperFunctions/usernameConstraints');
const validateEmail = require('../helperFunctions/validateEmail');

class UserController {
  static async deleteUser(req, res) {
    const { userId } = req.params;
    // check if the user is siteAdmin
    const user = await findUser(userId);
    // check if user is siteAdmin
    if (user && user.role === 'siteAdmin') {
      // retrieve the user email and username the siteAdmin wants to delete
      const { username, email } = req.body;
      // check if fields are not empty
      if (username && username.trim() !== '' && email && email.trim() !== '') {
        // validate username, returns true if valid
        const usernameValid = usernameConstraints(username);
        // validate email, returns true if valid
        const emailValid = validateEmail(email);
        if (!usernameValid || !emailValid) {
          console.log('username or email invalid: ', username, email);
          return res.status(400).json({ error: 'Invalid username or email' });
        }
        // go ahead to delete user from database
        try {
          // check if user can be delted
          const deleteUserResult = await deleteUser(userId, { username, email });
          if (deleteUserResult !== 'User deleted successfully' || deleteUserResult === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
          }

          return res.status(201).json({ message: 'User Account successfully removed' });
        } catch (error) {
          console.error('could not delete user: ', error.message);
          throw new Error('Failed to delete user');
        }
      }
    }
    console.log('userId from deleteUser: ', userId);
    try {
      // check if user can be delted
      const deleteUserResult = await deleteUser(userId);
      if (deleteUserResult !== 'User deleted successfully' || deleteUserResult === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(201).json({ message: 'User Account successfully removed' });
    } catch (error) {
      console.error('could not delete user: ', error.message);
      throw new Error('Failed to delete user');
    }
  }
}

module.exports = UserController;
