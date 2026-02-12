const PageContent = require('../../../../models/PageContent');

module.exports = {
  // 1. Busca todo o conteúdo de uma página específica
  async getPageContent(req, res) {
    const { pageName } = req.params;

    try {
      const contents = await PageContent.find({ page: pageName });
      
      // Transforma o array do banco em um objeto mais fácil pro front usar
      // Ex: { banner: { title: '...' }, reducoes: { ... } }
      const formatted = {};
      contents.forEach(item => {
        formatted[item.section] = item.content;
      });

      return res.json(formatted);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar conteúdo' });
    }
  },

  // 2. Atualiza (ou cria) uma seção específica
  async updateSection(req, res) {
    const { pageName, sectionKey } = req.params;
    const { content } = req.body; // O JSON novo com os textos

    try {
      const updated = await PageContent.findOneAndUpdate(
        { page: pageName, section: sectionKey },
        { 
          content,
          lastUpdatedBy: req.userId // Pega do middleware de auth
        },
        { new: true, upsert: true } // Cria se não existir
      );

      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar conteúdo' });
    }
  }
};