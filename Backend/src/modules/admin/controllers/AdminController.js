const User = require('../../../models/User');
const path = require('path');
const { exec } = require('child_process');

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

      return res.json({ totalUsers, lastUsers });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao gerar estatísticas" });
    }
  }

  async updateEngine(req, res) {
    const scriptPath = path.join(
      __dirname,
      '../../../../engine/scripts/run_pipeline.sh'
    );
    console.log("Tentando rodar script em:", scriptPath);

    exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro na execução: ${error}`);
        return res.status(500).json({
          success: false,
          message: "Falha ao executar o pipeline.",
          error: stderr
        });
      }

      return res.json({
        success: true,
        message: "Dados atualizados com sucesso!",
        output: stdout
      });
    });
  }
}

module.exports = new AdminController();