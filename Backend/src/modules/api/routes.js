const { Router } = require('express');
const RegisterController = require('./controllers/login/RegisterController');
const LoginController = require('./controllers/login/LoginController');
const ForgotPasswordController = require('./controllers/login/ForgotPasswordController');

const apiRoutes = Router();

// --- ROTAS PÚBLICAS DA API ---
apiRoutes.post('/register', RegisterController.store);
apiRoutes.post('/login', LoginController.store);
apiRoutes.post('/forgot-password', ForgotPasswordController.store);
apiRoutes.put('/reset-password', ForgotPasswordController.update);

module.exports = apiRoutes;