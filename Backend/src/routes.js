const express = require('express');
const routes = express.Router();

// Rota de teste
routes.get('/', (req, res) => {
  return res.send('API de Login Ativa!');
});

// Rota de Login (POST)
routes.post('/login', (req, res) => {
  const { email, password } = req.body;

  // USUÁRIO MOCKADO (Para teste inicial sem banco de dados)
  const usuarioCadastrado = {
    email: "user@teste.com",
    senha: "123"
  };

  if (email === usuarioCadastrado.email && password === usuarioCadastrado.senha) {
    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user: { id: 1, email: email }
    });
  }

  return res.status(401).json({ message: "E-mail ou senha incorretos." });
});

module.exports = routes;
