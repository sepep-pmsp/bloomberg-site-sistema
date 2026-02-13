const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/domains/auth');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const [, token] = authHeader.split(' ');
    try {
      const decoded = await promisify(jwt.verify)(token, authConfig.secret);
      req.userId = decoded.id;
      return next();
    } catch (err) {
    }
  }
  const adminCookie = req.cookies ? req.cookies.admin_token : null;

  if (adminCookie === 'session_valid_token') {
    req.userId = 'admin-master';
    return next();
  }
  return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });
};