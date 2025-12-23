const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  },
  auth: {
    user: "seu_e-mail_profissional",
    pass: "uma_senha_segura"
  }
});

module.exports = transport;