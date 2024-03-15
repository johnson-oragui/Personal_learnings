const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('from validateRequest middleware', errors);
      return res.status(400).json({ errors: errors.array() });
    }
    return next();
  } catch (error) {
    console.error('error in validate request: ', error.message);
    throw new Error(error);
  }
};

module.exports = validateRequest;
