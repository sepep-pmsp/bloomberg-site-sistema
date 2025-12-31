const express = require('express');
const cors = require('cors');
require('dotenv').config();
const engine = require('ejs-mate');
const path = require('path');

const connectDB = require('./config/db/database');
const routes = require('./routes/main'); 

const app = express();
const cookieParser = require('cookie-parser');
connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Configurações de View Engine (EJS e Pasta Public)
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'modules', 'admin', 'views'));
app.use(express.static(path.join(__dirname, 'modules', 'admin', 'public')));

// Use as rotas DEPOIS de configurar as views e estáticos
app.use(routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});