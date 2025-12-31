const User = require('../../../../models/User');
const bcrypt = require('bcrypt');
const { dominiosPermitidos } = require('../../../../config/domains/auth');

class RegisterController {
  async store(req, res) {
    try {
      const { nome, email, senha, confirmarSenha } = req.body;

      if (senha !== confirmarSenha) return res.status(400).json({ error: "Senhas não coincidem" });
      
      const dominioValido = dominiosPermitidos.some(dom => email.endsWith(dom));
      if (!dominioValido) return res.status(403).json({ error: "Domínio não autorizado" });

      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ error: "Usuário já existe" });

      const salt = await bcrypt.genSalt(10);
      const hashSenha = await bcrypt.hash(senha, salt);

      const user = await User.create({ nome, email, senha: hashSenha });

      return res.status(201).json({ id: user._id, nome, email });
    } catch (err) {
      return res.status(500).json({ error: "Erro no cadastro" });
    }
  }
}

module.exports = new RegisterController();