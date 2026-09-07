const { Router } = require('express');

const AdminPageController = require('./controllers/AdminPageController');
const AdminController = require('./controllers/AdminController');
const AdminAuthController = require('./controllers/AdminAuthController');
const JsonUploadController = require('./controllers/JsonUploadController');

const adminAuthMiddleware = require('./middlewares/adminAuth');
const uploadSimulationCsv = require('./middlewares/uploadSimulationCsv');
const uploadJson = require('./middlewares/uploadJson');

const authMiddleware = require('../../middlewares/auth');
const adminMiddleware = require('../../middlewares/admin');

const adminRoutes = Router();


// ======================================================
// AUTENTICAÇÃO ADMIN
// ======================================================

adminRoutes.get(
    '/login',
    AdminAuthController.renderLogin
);

adminRoutes.post(
    '/login',
    AdminAuthController.login
);

adminRoutes.get(
    '/logout',
    AdminAuthController.logout
);


// ======================================================
// A PARTIR DAQUI, TODAS AS ROTAS EXIGEM LOGIN ADMIN
// ======================================================

adminRoutes.use(adminAuthMiddleware);


// ======================================================
// INTERFACE VISUAL
// ======================================================

adminRoutes.get(
    '/dashboard-view',
    AdminPageController.renderDashboard
);

adminRoutes.get(
    '/users-view',
    AdminPageController.renderUsers
);

adminRoutes.get(
    '/monitor-view',
    AdminPageController.renderMonitor
);

adminRoutes.get(
    '/docs',
    AdminPageController.renderApiDocs
);

adminRoutes.get(
    '/pages/metodologia/:sectionKey',
    AdminPageController.renderMetodologiaSection
);


// ======================================================
// SIMULAÇÃO MONTE CARLO
// ======================================================

adminRoutes.get(
    '/simulation/simulacao',
    AdminPageController.renderSimulacao
);

adminRoutes.post(
    '/simulation/upload-csv',
    uploadSimulationCsv,
    AdminPageController.uploadSimulationCsv
);


// ======================================================
// GERENCIAMENTO DOS ARQUIVOS JSON
// ======================================================

adminRoutes.post(
    '/data/upload-json',
    uploadJson.single('jsonFile'),
    JsonUploadController.store
);


// ======================================================
// AÇÕES DO PAINEL
// ======================================================

adminRoutes.post(
    '/users/delete/:id',
    AdminPageController.deleteUser
);

adminRoutes.post(
    '/users/toggle/:id',
    AdminPageController.toggleAdmin
);


// ======================================================
// DADOS DA API PARA O ADMIN
// ======================================================

adminRoutes.get(
    '/dashboard-data',
    authMiddleware,
    adminMiddleware,
    AdminController.dashboard
);

adminRoutes.get(
    '/users-data',
    authMiddleware,
    adminMiddleware,
    AdminController.index
);

adminRoutes.post(
    '/run-engine',
    AdminController.updateEngine
);


module.exports = adminRoutes;