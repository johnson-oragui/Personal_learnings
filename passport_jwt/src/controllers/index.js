
class GetHome {
  static get(req, res) {
    return res.send({ status: "welcome" });
  }
}

export default GetHome;
