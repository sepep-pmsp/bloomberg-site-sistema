const User = require('../../models/User');

class AdminController {
  async index(req, res) {
    try {
      const users = await User.find().select('-senha');
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }
  async dashboard(req, res) {
    try {
        const totalUsers = await User.countDocuments();
        const lastUsersRaw = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('nome email createdAt');
        const lastUsers = lastUsersRaw.map(user => {
        const dominio = user.email.split('@')[1];
        return {
            _id: user._id,
            nome: user.nome,
            dominio: `@${dominio}`,
            dataCadastro: user.createdAt
        };
        });

        return res.json({
        totalUsers,
        lastUsers
        });
    } catch (err) {
        return res.status(500).json({ error: "Erro ao gerar estatísticas" });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      return res.json({ message: "Usuário removido com sucesso" });
    } catch (err) {
      return res.status(400).json({ error: "Erro ao remover usuário" });
    }
  }
}

module.exports = new AdminController();