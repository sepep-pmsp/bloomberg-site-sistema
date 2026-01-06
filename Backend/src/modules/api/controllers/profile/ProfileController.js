const User = require('../../../../models/User');

class ProfileController {
  async show(req, res) {
    try {
      // O req.userId virá do middleware de autenticação que vamos ajustar
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const { id, nome, email, isAdmin, avatar } = user;

      // Lógica do avatar que combinamos
      const defaultAvatar = isAdmin ? 'admin-avatar.svg' : 'user-avatar.svg';
      const avatarUrl = avatar ? `/images/avatars/${avatar}` : `/images/avatars/${defaultAvatar}`;

      return res.json({
        id,
        nome,
        email,
        isAdmin,
        avatar: avatarUrl
      });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao carregar perfil' });
    }
  }
}

module.exports = new ProfileController();