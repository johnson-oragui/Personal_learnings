const deleteUser = require('../helperFunctions/deleteUser');

class UserController {
  static async deleteUser(req, res) {
    const { userId } = req.params;
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
