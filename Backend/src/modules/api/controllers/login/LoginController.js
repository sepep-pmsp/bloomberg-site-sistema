const User = require('../../../../models/User');
const SecurityLog = require('../../../../models/SecurityLog');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../../../config/domains/auth');

class LoginController {
  async store(req, res) {
    const { email, password } = req.body;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    const user = await User.findOne({ email });

    if (!user) {
      await SecurityLog.create({ email, ip, userAgent, status: 'failed', reason: 'Usuário não encontrado' });
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.senha);

    if (!passwordMatch) {
      await SecurityLog.create({ email, ip, userAgent, status: 'failed', reason: 'Senha incorreta' });
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    await SecurityLog.create({ email, ip, userAgent, status: 'success' });

    const { id, nome } = user;
    
    // 1. Geramos o token exatamente como você já faz
    const token = jwt.sign({ id }, authConfig.jwtSecret, { expiresIn: authConfig.expiresIn });

    // 2. Em vez de enviar o token no JSON, enviamos pelo Cookie
    res.cookie('token', token, {
      httpOnly: true,     // Impede que o JS acesse o token (Segurança extra)
      secure: false,      // Deixe 'false' por enquanto para funcionar em http://localhost
      sameSite: 'lax',    // Proteção básica contra ataques CSRF
      maxAge: 86400000    // Tempo de vida do cookie (1 dia em milissegundos)
    });
    
    return res.json({
      user: { id, nome, email }
    });

  }
  async delete(req, res) {
    res.clearCookie('token');
    return res.json({ message: 'Logout realizado com sucesso' });
  }
}

module.exports = new LoginController();