class SignUp {
  static get(req, res) {
    return res.send({ message: "sign up" });
  }

  static async post(req, res) {
    return res.send({ message: "signed up" });
  }
}

export default SignUp;
