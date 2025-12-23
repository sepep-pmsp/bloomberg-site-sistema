module.exports = {
  dominiosPermitidos: [
    '@prefeitura.sp.gov.br',
    '@sptrans.com.br'
  ],
  jwtSecret: process.env.JWT_SECRET || 'chave-secreta-muito-forte',
  expiresIn: '8h'
};