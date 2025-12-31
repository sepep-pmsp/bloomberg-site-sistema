const { Router } = require('express');

// Importamos apenas os "chefes" de cada módulo
const adminModuleRoutes = require('../modules/admin/routes');
const apiModuleRoutes = require('../modules/api/routes'); 

const routes = Router();

// Redireciona tudo que é visual/painel para o módulo Admin
routes.use('/admin', adminModuleRoutes);

// Redireciona tudo que é dado/JSON para o módulo API
routes.use('/api', apiModuleRoutes);

module.exports = routes;