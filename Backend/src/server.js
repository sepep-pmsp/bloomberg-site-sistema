const express = require('express');
const cors = require('cors');
require('dotenv').config();
const engine = require('ejs-mate');
const path = require('path');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db/database');
const routes = require('./routes/main'); 

const app = express();

// 1. Conexão com o Banco de Dados
connectDB();

// 2. Configuração do CORS (Deve vir antes das rotas e outros middlewares)
// Esta configuração permite que o Vite (5173) envie cookies para o Node (3001)
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, // Permite o recebimento de Cookies HttpOnly
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// 3. Middlewares de Parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 4. Configurações de View Engine (Admin EJS)
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'modules', 'admin', 'views'));

// 5. Arquivos Estáticos (Imagens, Avatares, CSS do Admin)
app.use(express.static(path.join(__dirname, 'modules', 'admin', 'public')));

// 6. Definição do Layout padrão para ejs-mate
app.locals.layout = 'admin/layout';

// 7. Uso das Rotas (Aqui entram tanto as rotas do Admin quanto as da API)
app.use(routes);

// 8. Inicialização do Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});