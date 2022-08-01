const jwt = require('jsonwebtoken');
const httpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];;
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'please dont share this key');
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new httpError('Authentication failed', 401);
    next(error);
  }
};
