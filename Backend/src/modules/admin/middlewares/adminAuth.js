module.exports = (req, res, next) => {
  // O cookie-parser coloca os cookies dentro de req.cookies
  const token = req.cookies ? req.cookies.admin_token : null;

  if (token === 'session_valid_token') {
    return next();
  }

  // Se não tem token, manda pro login
  return res.redirect('/admin/login');
};