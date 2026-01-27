const User = require('../../../models/User');
const SecurityLog = require('../../../models/SecurityLog');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');

class AdminPageController {

  async renderDashboard(req, res) {
    try {
        // 1. Busca os dados reais do banco
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

        // 2. Define o usuário logado (Simulação por enquanto)
        const loggedUser = {
            nome: "Super Admin",
            isAdmin: true,
            avatar: "/images/avatars/admin-avatar.svg" 
        };

        // 3. Renderiza TUDO em um único comando no final
        return res.render('admin/pages/dashboard', {
            totalUsers,
            lastUsers,
            user: loggedUser
        });

    } catch (err) {
        console.error(err);
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
      return res.redirect('/admin/users-view');
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

    async renderApiDocs(req, res) {
        const contentPath = path.join(__dirname, '../../api/content');
        const checkFile = (filename) => fs.existsSync(path.join(contentPath, filename));
        
        const filesStatus = {
            'frota_tabela.json': checkFile('frota_tabela.json'),
            'frota_pontos.geojson': checkFile('frota_pontos.geojson'),
            'frota_rotas.geojson': checkFile('frota_rotas.geojson'),
            'mapas_distritos.json': checkFile('mapas_distritos.json'),
            'simulacao_monte_carlo.json': checkFile('simulacao_monte_carlo.json')
        };

        const endpoints = [
            { 
                tag: 'Frota', method: 'GET', path: '/api/frota-tabela', 
                desc: 'Retorna a lista completa de ônibus.', 
                response: [{ id: 64460, linha: "502J-10" }], 
                status: filesStatus['frota_tabela.json']
            },
            { 
                tag: 'Geográfico', method: 'GET', path: '/api/frota-pontos', 
                desc: 'GeoJSON com posições e calor.', 
                response: { type: 'FeatureCollection' }, 
                status: filesStatus['frota_pontos.geojson']
            },
            { 
                tag: 'Geográfico', method: 'GET', path: '/api/frota-rotas', 
                desc: 'GeoJSON com trajetos das linhas.', 
                response: { type: 'FeatureCollection' }, 
                status: filesStatus['frota_rotas.geojson']
            },
            { 
                tag: 'Geográfico', method: 'GET', path: '/api/mapa-distritos', 
                desc: 'Consolidado por distritos.', 
                response: { "JABAQUARA": { co2: 15.4 } }, 
                status: filesStatus['mapas_distritos.json']
            },
            { 
                tag: 'Simulação', method: 'GET', path: '/api/simulacao', 
                desc: 'Simulação Monte Carlo.', 
                response: { cenario_50: { media: 0.008 } }, 
                status: filesStatus['simulacao_monte_carlo.json']
            }
        ];

        return res.render('admin/pages/api-docs', {
            endpoints,
            filesStatus,
            user: req.user || { nome: "Admin", avatar: "/images/avatars/admin-avatar.svg" },
            title: 'CODATA API Docs'
        });
    }
}

module.exports = new AdminPageController();