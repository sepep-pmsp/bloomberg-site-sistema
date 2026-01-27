module.exports = {
  dominiosPermitidos: [
    
  ],
  jwtSecret: process.env.JWT_SECRET || 'chave-secreta-muito-forte',
  expiresIn: '8h'
};