module.exports = {
  dominiosPermitidos: process.env.DOMAINS_ALLOWED
    ? process.env.DOMAINS_ALLOWED.split(',').map(d => d.trim())
    : [],
  jwtSecret: process.env.JWT_SECRET || 'chave-secreta-muito-forte',
  expiresIn: '8h'
};
