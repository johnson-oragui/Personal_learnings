class ProfileController {
  static putProfile(req, res) {
    return res.status(200).json({ message: 'update profile' });
  }

  static putPassword(req, res) {
    return res.status(200).json({ message: 'update password' });
  }

  static putAvatar(req, res) {
    return res.status(200).json({ message: 'update avatar' });
  }

  static deleteUser(req, res) {
    return res.status(200).json({ message: 'user deleted user' });
  }
}

module.exports = ProfileController;
