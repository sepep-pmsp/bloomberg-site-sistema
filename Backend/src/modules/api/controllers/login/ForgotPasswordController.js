const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../../../../models/User');
const transport = require('../../../../config/mail/mail');

class ForgotPasswordController {
  async store(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
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
      await transport.sendMail({
        to: email,
        from: 'seu_e-mail_profissional',
        subject: 'Recuperação de Senha - Sistema Interno',
        html: `
            <div style="font-family: sans-serif; color: #333;">
              <h1>Recuperação de Senha</h1>
              <p>Olá, <strong>${user.nome}</strong>.</p>
              <p>Você solicitou uma alteração de senha para este e-mail institucional.</p>
              <p>Sua senha temporária de acesso é: <span style="font-size: 1.2em; color: #174E36; font-weight: bold;">${senhaTemporaria}</span></p>
              <p>Ao acessar o sistema com esta senha, você será solicitado a criar uma nova senha definitiva.</p>
              <hr />
              <p style="font-size: 0.8em; color: #666;">Este código expira em 1 hora. Se você não solicitou esta alteração, ignore este e-mail.</p>
            </div>
        `,
      });
      return res.json({ 
        message: "Uma senha temporária foi enviada ao seu e-mail institucional." 
      });

    } catch (err) {
      console.error("Erro no Nodemailer: ", err);
      return res.status(400).json({ error: 'Erro ao processar recuperação de senha' });
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