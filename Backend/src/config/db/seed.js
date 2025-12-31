const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
require('dotenv').config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      
      await User.create({
        nome: 'Administrador Sistema',
        email: process.env.ADMIN_EMAIL,
        senha: hashedPassword,
        isAdmin: true
      });

      console.log('✅ Usuário Admin criado com sucesso!');
    } else {
      console.log('ℹ️ Usuário Admin já existe no banco.');
    }

    process.exit();
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
}

seedAdmin();