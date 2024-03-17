const request = require('request');

const isImageUrl = (url, callback) => {
  request.head(url, (error, res, body) => {
    if (error) callback(error, false);
    else {
      const contentType = res.headers['content-type'];
      callback(null, contentType.startsWith('image'));
    }
  });
};

module.exports = isImageUrl;
