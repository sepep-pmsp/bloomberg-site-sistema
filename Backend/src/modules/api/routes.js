const { Router } = require('express');
const RegisterController = require('./controllers/login/RegisterController');
const LoginController = require('./controllers/login/LoginController');
const ForgotPasswordController = require('./controllers/login/ForgotPasswordController');
const ProfileController = require('./controllers/profile/ProfileController');
const authMiddleware = require('./middlewares/auth');

const apiRoutes = Router();

// --- ROTAS PÚBLICAS DA API ---
apiRoutes.post('/register', RegisterController.store);
apiRoutes.post('/login', LoginController.store);
apiRoutes.post('/forgot-password', ForgotPasswordController.store);
apiRoutes.put('/reset-password', ForgotPasswordController.update);

// --- ROTAS PROTEGIDAS (Só entra com Cookie válido) ---
apiRoutes.use(authMiddleware);

apiRoutes.get('/me', ProfileController.show);
apiRoutes.delete('/logout', LoginController.delete);

module.exports = apiRoutes;