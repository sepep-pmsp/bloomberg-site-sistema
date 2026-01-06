const bcrypt = require('bcryptjs');
const User = require('../../../models/User');

class AdminAuthController {
  renderLogin(req, res) {
    return res.render('admin/login/login', { error: null });
  }

  async login(req, res) {
    try {
        const { email, password } = req.body;

        // 1. Verificar se é o Admin do .env
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        res.cookie('admin_token', 'session_valid_token', { 
            httpOnly: true,
            maxAge: 3600000 // 1 hora de duração
        });
        return res.redirect('/admin/dashboard-view');
        }

        // 2. Se não for o fixo do .env, tentar buscar no banco (Usuários com isAdmin: true)
        const user = await User.findOne({ email, isAdmin: true });
        if (user && await bcrypt.compare(password, user.senha)) {
        res.cookie('admin_token', 'session_valid_token', { httpOnly: true });
        return res.redirect('/admin/login');
        }

        return res.render('admin/login/login', { error: 'Credenciais inválidas ou sem permissão de admin.' });
    } catch (err) {
        return res.render('admin/login/login', { error: 'Erro interno no servidor.' });
    }
  }

  logout(req, res) {
    res.clearCookie('admin_token');
    return res.redirect('/admin/login/login');
  }
}

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

    return res.redirect('/admin/login');
};

module.exports = new AdminAuthController();