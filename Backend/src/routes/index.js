const { Router } = require('express');

const RegisterController = require('../controllers/RegisterController');
const LoginController = require('../controllers/LoginController');
const ForgotPasswordController = require('../controllers/ForgotPasswordController');
const AdminController = require('../controllers/Admin/AdminController');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
const routes = Router();

// --- ROTAS PÚBLICAS ---
routes.post('/register', RegisterController.store);
routes.post('/login', LoginController.store);
routes.post('/forgot-password', ForgotPasswordController.store);
routes.put('/reset-password', ForgotPasswordController.update);

// --- ROTAS DE ADMIN ---
routes.get('/admin/dashboard', authMiddleware, adminMiddleware, AdminController.dashboard);
routes.get('/admin/users', authMiddleware, adminMiddleware, AdminController.index);

module.exports = routes;