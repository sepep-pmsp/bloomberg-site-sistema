const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../../../../models/User');
const authConfig = require('../../../../config/domains/auth');
const { dominiosPermitidos } = authConfig;

class ForgotPasswordController {
  async store(req, res) {
    const { email } = req.body;
    const emailLower = email.trim().toLowerCase();
    const dominioValido = dominiosPermitidos.some(dom => emailLower.endsWith(dom.toLowerCase()));
    if (!dominioValido) {
        return res.status(403).json({ error: "Domínio não autorizado para recuperação" });
    }
        try {
            const user = await User.findOne({ email: emailLower });
            if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });
            const senhaTemporaria = "pref" + Math.floor(1000 + Math.random() * 9000);
            const salt = await bcrypt.genSalt(10);
            const hashTemporario = await bcrypt.hash(senhaTemporaria, salt);

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: hashTemporario,
                    passwordResetExpires: now,
                }
            });
            return res.json({ 
                message: "Token gerado com sucesso",
                tokenGerado: senhaTemporaria
            });

        } catch (err) {
            return res.status(400).json({ error: 'Erro ao processar recuperação' });
        }
    }

  async update(req, res) {
    const { email, senhaTemporaria, novaSenha } = req.body;

    try {
      const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');

      if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

      const match = await bcrypt.compare(senhaTemporaria, user.passwordResetToken);
      if (!match) return res.status(400).json({ error: 'Senha temporária inválida' });

      if (new Date() > user.passwordResetExpires) {
        return res.status(400).json({ error: 'Senha temporária expirou' });
      }

      const salt = await bcrypt.genSalt(10);
      user.senha = await bcrypt.hash(novaSenha, salt);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();
      return res.json({ message: "Senha atualizada! Utilize sua nova senha para logar." });

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao atualizar senha' });
    }
  }
}

module.exports = new ForgotPasswordController();