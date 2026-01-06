const User = require('../../../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Adicione o import do JWT
const authConfig = require('../../../../config/domains/auth'); // Adicione o import da config

const { dominiosPermitidos } = authConfig;

class RegisterController {
  async store(req, res) {
    try {
      const { nome, email, senha, confirmarSenha } = req.body;

      if (senha !== confirmarSenha) return res.status(400).json({ error: "Senhas não coincidem" });
      
      const emailLower = email.trim().toLowerCase();
      const dominioValido = dominiosPermitidos.some(dom => emailLower.endsWith(dom.toLowerCase()));
      if (!dominioValido) return res.status(403).json({ error: "Domínio não autorizado" });

      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ error: "Usuário já existe" });

      const salt = await bcrypt.genSalt(10);
      const hashSenha = await bcrypt.hash(senha, salt);

      // Cria o usuário
      const user = await User.create({ nome, email, senha: hashSenha });

      // --- NOVIDADE: Geração automática de Token após cadastro ---
      const token = jwt.sign({ id: user._id }, authConfig.jwtSecret, { 
        expiresIn: authConfig.expiresIn 
      });

      // Envia o cookie para o navegador já deixar o usuário logado
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true em produção
        sameSite: 'lax',
        maxAge: 86400000 
      });

      return res.status(201).json({ 
        user: { id: user._id, nome, email } 
      });

    } catch (err) {
      return res.status(500).json({ error: "Erro no cadastro" });
    }
  }
}

module.exports = new RegisterController();