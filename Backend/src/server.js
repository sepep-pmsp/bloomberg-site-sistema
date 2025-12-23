const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();

// Middlewares
app.use(cors()); // Libera acesso para o front-end
app.use(express.json()); // Permite que o servidor entenda JSON no corpo (body) das requisições

// Usar as rotas que vamos criar
app.use(routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
