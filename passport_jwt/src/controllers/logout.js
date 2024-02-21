class Logout {
  static post(req, res) {
    return res.cookies.clear();
  }
  static get(req, res) {
    return res.send({ message: 'logged out' });
  }
}

export default Logout;
