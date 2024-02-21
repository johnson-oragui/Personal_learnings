class Login {
  static async get(req, res) {
    return res.send({ message: "login page" });
  }

  static async post(req, res) {
    res.send({ message: "logged in" });
  }
}

export default Login;
