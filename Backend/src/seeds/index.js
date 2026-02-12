const seedAdmin = require('./users/admin.seed');
const seedMetodologia = require('./pages/metodologia.seed');
// Futuramente: const seedDados = require('./pages/dados.seed');

const runAllSeeds = async () => {
    console.log('🌱 Iniciando verificação de Seeds...');
    
    // 1. Garante que o Admin exista (pode ser necessário para atrelar conteúdo a ele no futuro)
    await seedAdmin();

    // 2. Roda os seeds de conteúdo
    await seedMetodologia();
    
    // await seedDados();
    
    console.log('🏁 Seeds finalizados.');
};

module.exports = runAllSeeds;