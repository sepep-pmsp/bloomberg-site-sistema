const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: "Acesso negado. Requer privilégios de Administrador." });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao validar permissões de admin." });
  }
};