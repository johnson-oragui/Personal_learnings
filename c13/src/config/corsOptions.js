const allowedOrigins = [
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'https://www.google.com',
];

const corsOption = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) === -1 || origin === undefined) {
      const msg = `The CORS Policy from this site does not allow acces from ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

module.exports = { corsOption, allowedOrigins };
