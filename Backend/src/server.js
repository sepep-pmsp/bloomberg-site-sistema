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

// 2. Configuração do CORS (Bloco Único e Corrigido)
const allowedOrigins = [
  'http://localhost',       // Nginx/Docker
  'http://localhost:5173',  // Local sem Docker
  'http://localhost:3001', // Backend local
  'http://127.0.0.1'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (como ferramentas de teste ou mobile)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS: Origem não permitida'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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