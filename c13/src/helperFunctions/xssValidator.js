const xss = require('xss');

const xssValidator = (requestBody) => {
  const options = {
    whiteList: {
      p: [],
      strong: [],
      em: [],
    }, // List of allowed HTML tags and attributes
    encodeHTML: true, // Encode HTML tags
    escapeScript: true, // Escape JavaScript tags
    stripIgnoreTagBody: ['script'],
  };
  console.log(xss(requestBody));
  return xss(requestBody, options);
};

module.exports = xssValidator;
