const { allowedOrigins } = require('../config/corsOptions');

const accessControlCredential = (req, res, next) => {
  const { origin } = req.headers;

  if (allowedOrigins.includes(origin)) {
    res.headers('Access-Control-Allow-Origin', true);
  }
  next();
};

module.exports = accessControlCredential;
