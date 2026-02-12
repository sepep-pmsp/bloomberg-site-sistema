const bcrypt = require('bcryptjs');
const User = require('../../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      
      await User.create({
        nome: 'Administrador Sistema',
        email: process.env.ADMIN_EMAIL,
        senha: hashedPassword,
        isAdmin: true
      });

      console.log('✅ Seed: Usuário Admin criado com sucesso!');
    } else {
      console.log('ℹ️ Seed: Usuário Admin já existe.');
    }
  } catch (error) {
    console.error('❌ Erro no seed de Admin:', error);
  }
};

module.exports = seedAdmin;