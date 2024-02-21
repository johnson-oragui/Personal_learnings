class SecuredRoute {
  static async get(req, res) {
    return res.send({ message: "secured route" });
  }
}

export default SecuredRoute;
