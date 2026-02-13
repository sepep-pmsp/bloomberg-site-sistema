const { Router } = require('express');
const RegisterController = require('./controllers/login/RegisterController');
const LoginController = require('./controllers/login/LoginController');
const ForgotPasswordController = require('./controllers/login/ForgotPasswordController');
const ProfileController = require('./controllers/profile/ProfileController');
const authMiddleware = require('./middlewares/auth');
const fs = require('fs');
const path = require('path');

// AJUSTE DE CAMINHO: Baseado na sua estrutura de pastas enviada
const ContentController = require('./controllers/service/ContentController'); 
const apiRoutes = Router();

// --- ROTAS PÚBLICAS DA API ---
apiRoutes.post('/register', RegisterController.store);
apiRoutes.post('/login', LoginController.store);
apiRoutes.post('/forgot-password', ForgotPasswordController.store);
apiRoutes.put('/reset-password', ForgotPasswordController.update);

// --- ROTA DE CONTEÚDO (PÚBLICA - GET) ---
// O Front acessa: GET /api/content/metodologia
apiRoutes.get('/content/:pageName', ContentController.getPageContent);


// --- ROTAS DE ARQUIVOS JSON ESTÁTICOS ---
apiRoutes.get('/frota-tabela', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'content/frota_tabela.json');
        if (!fs.existsSync(dataPath)) {
            return res.status(404).json({ error: "Dados da frota não encontrados." });
        }
        const data = fs.readFileSync(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: "Erro ao ler base de dados." });
    }
});

apiRoutes.get('/mapa-distritos', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'content/mapas_distritos.json');
        if (!fs.existsSync(dataPath)) return res.status(404).json({ error: "Mapa não encontrado." });
        const data = fs.readFileSync(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: "Erro interno no mapa." });
    }
});

apiRoutes.get('/simulacao', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'content/simulacao_monte_carlo.json');
        if (!fs.existsSync(dataPath)) return res.status(404).json({ error: "Simulação não encontrada." });
        const data = fs.readFileSync(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: "Erro interno na simulação." });
    }
});

// --- ROTAS PROTEGIDAS (PRECISA DE LOGIN) ---
apiRoutes.use(authMiddleware);

// ROTA DE CONTEÚDO (PRIVADA - PUT)
// O Admin acessa: PUT /api/content/metodologia/banner
// Corrigido de 'routes.put' para 'apiRoutes.put'
apiRoutes.put('/content/:pageName/:sectionKey', ContentController.updateSection);

apiRoutes.get('/me', ProfileController.show);
apiRoutes.delete('/logout', LoginController.delete);

module.exports = apiRoutes;