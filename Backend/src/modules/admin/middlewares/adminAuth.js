module.exports = (req, res, next) => {
  const token = req.cookies ? req.cookies.admin_token : null;

  if (token === 'session_valid_token') {
        res.locals.user = {
            nome: "Super Admin",
            isAdmin: true,
            avatar: "/images/avatars/admin-avatar.svg"
        };
        return next();
    }
    res.locals.user = null;
    return res.redirect('/admin-panel/login');
};