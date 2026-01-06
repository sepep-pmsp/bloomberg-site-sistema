const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/domains/auth');

module.exports = (req, res, next) => {
  // Agora buscamos o token dentro dos cookies
  const token = req.cookies ? req.cookies.token : null;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    
    // Guardamos o ID do usuário na requisição para o ProfileController usar
    req.userId = decoded.id; 

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
};