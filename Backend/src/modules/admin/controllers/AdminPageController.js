const User = require('../../../models/User');
const SecurityLog = require('../../../models/SecurityLog');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');

class AdminPageController {

  async renderDashboard(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      
      const lastUsersRaw = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('nome email createdAt');

      const lastUsers = lastUsersRaw.map(user => ({
        nome: user.nome,
        dominio: `@${user.email.split('@')[1]}`,
        data: user.createdAt.toLocaleDateString('pt-BR')
      }));

      // Renderiza o arquivo views/admin/pages/dashboard.ejs e passa os dados
      return res.render('admin/pages/dashboard', {
        totalUsers,
        lastUsers
      });
    } catch (err) {
      return res.status(500).send("Erro ao carregar o dashboard administrativo.");
    }
  }

  async renderUsers(req, res) {
    try {
      const users = await User.find().sort({ nome: 1 });
      return res.render('admin/pages/users', { users });
    } catch (err) {
      return res.status(500).send("Erro ao listar usuários.");
    }
  }

  // Ação para deletar usuário
  async deleteUser(req, res) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.redirect('/admin/pages/users-view'); // Recarrega a página
    } catch (err) {
      return res.status(500).send("Erro ao eliminar usuário.");
    }
  }

  // Ação para alternar Admin (Toggle)
  async toggleAdmin(req, res) {
    try {
      const user = await User.findById(req.params.id);
      user.isAdmin = !user.isAdmin;
      await user.save();
      return res.redirect('/admin/pages/users-view');
    } catch (err) {
      return res.status(500).send("Erro ao alterar privilégios.");
    }
  }

  async renderMonitor(req, res) {
    try {
      // Verifica conexão
      const dbStatus = mongoose.connection.readyState === 1 ? 'Online' : 'Offline';
      const dbName = mongoose.connection.name || 'N/A';

      // Busca logs (tratando caso não existam logs ainda)
      const logs = await SecurityLog.find()
        .sort({ createdAt: -1 })
        .limit(15) || [];

      const totalFailures = await SecurityLog.countDocuments({ status: 'failed' }) || 0;

      return res.render('admin/pages/monitor', { 
        dbStatus, 
        logs, 
        totalFailures,
        dbName
      });
    } catch (err) {
      // Isso vai imprimir o erro real no seu console/terminal do VS Code
      console.error("ERRO NO MONITOR:", err); 
      return res.status(500).send("Erro interno ao carregar o monitor. Verifique o console do servidor.");
    }
  }

    renderApiDocs(req, res) {
        const endpoints = [
            { 
                method: 'POST', 
                path: '/api/register', 
                desc: 'Cria um novo usuário.',
                body: '{ "nome": "...", "email": "...", "senha": "..." }',
                response: '{ "msg": "Usuário criado!" }'
            },
            { 
                method: 'POST', 
                path: '/api/login', 
                desc: 'Autentica o usuário e retorna um Token JWT.',
                body: '{ "email": "...", "senha": "..." }',
                response: '{ "token": "ey...", "user": {...} }'
            },
            { 
                method: 'POST', 
                path: '/api/forgot-password', 
                desc: 'Solicita recuperação de senha via e-mail institucional.',
                body: '{ "email": "..." }',
                response: '{ "msg": "E-mail enviado!" }'
            },
            { 
                method: 'PUT', 
                path: '/api/reset-password', 
                desc: 'Redefine a senha usando a chave temporária.',
                body: '{ "email": "...", "senhaTemporaria": "...", "novaSenha": "..." }',
                response: '{ "msg": "Senha atualizada!" }'
            }
        ];

        return res.render('admin/pages/api-docs', { endpoints });
    }
}

module.exports = new AdminPageController();