const User = require('../../../models/User');

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
  renderApiDocs(req, res) {
    const endpoints = [
        { method: 'POST', path: '/register', desc: 'Cadastro de novos usuários (@prefeitura.sp.gov.br)' },
        { method: 'POST', path: '/login', desc: 'Autenticação e geração de Token JWT' },
        { method: 'POST', path: '/forgot-password', desc: 'Gera senha temporária e envia e-mail' },
        { method: 'PUT', path: '/reset-password', desc: 'Substitui senha temporária pela definitiva' },
        { method: 'GET', path: '/admin/users', desc: 'Lista todos os usuários (Requer Token Admin)' }
    ];
        return res.render('admin/pages/api-docs', { endpoints });
    }
}

module.exports = new AdminController();