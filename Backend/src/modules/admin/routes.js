const { Router } = require('express');
const AdminPageController = require('./controllers/AdminPageController');
const AdminController = require('./controllers/AdminController'); // Controller de dados da API
const AdminAuthController = require('./controllers/AdminAuthController');
const adminAuthMiddleware = require('./middlewares/adminAuth');
const authMiddleware = require('../../middlewares/auth');
const adminMiddleware = require('../../middlewares/admin');

const adminRoutes = Router();

// Rota de Login (Pública dentro do admin)
adminRoutes.get('/login', AdminAuthController.renderLogin);
adminRoutes.post('/login', AdminAuthController.login);
adminRoutes.get('/logout', AdminAuthController.logout);

adminRoutes.use(adminAuthMiddleware);
// --- INTERFACE VISUAL (O que você vê no navegador) ---
adminRoutes.get('/dashboard-view', AdminPageController.renderDashboard);
adminRoutes.get('/users-view', AdminPageController.renderUsers);
adminRoutes.get('/monitor-view', AdminPageController.renderMonitor);
adminRoutes.get('/docs', AdminPageController.renderApiDocs);

// --- AÇÕES DO PAINEL ---
adminRoutes.post('/users/delete/:id', AdminPageController.deleteUser);
adminRoutes.post('/users/toggle/:id', AdminPageController.toggleAdmin);

// --- DADOS DA API PARA O ADMIN (Se precisar de JSON no futuro) ---
adminRoutes.get('/dashboard-data', authMiddleware, adminMiddleware, AdminController.dashboard);
adminRoutes.get('/users-data', authMiddleware, adminMiddleware, AdminController.index);
adminRoutes.post('/run-engine', adminAuthMiddleware, AdminController.updateEngine);

module.exports = adminRoutes;