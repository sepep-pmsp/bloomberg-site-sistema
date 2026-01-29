module.exports = {
  dominiosPermitidos: process.env.DOMAINS_ALLOWED.split(','),
  jwtSecret: process.env.JWT_SECRET || 'chave-secreta-muito-forte',
  expiresIn: '8h'
};