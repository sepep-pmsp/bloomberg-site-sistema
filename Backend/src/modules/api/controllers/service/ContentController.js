const PageContent = require('../../../../models/PageContent');

module.exports = {
  async getPageContent(req, res) {
    try {
      const { pageName } = req.params;
      const sections = await PageContent.find({ page: pageName });
      const response = {};
      sections.forEach(doc => {
        response[doc.section] = doc.content;
      });

      return res.json(response);
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
      return res.status(500).json({ error: 'Erro ao buscar dados.' });
    }
  },

  async updateSection(req, res) {
    try {
      const { pageName, sectionKey } = req.params;
      const { content } = req.body; 
      let userIdToSave = null;
      const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

      if (req.userId && isValidObjectId(req.userId)) {
          userIdToSave = req.userId;
      }
      const updateData = { 
        content,
        updatedAt: Date.now()
      };
      if (userIdToSave) {
        updateData.lastUpdatedBy = userIdToSave;
      }
      const updatedDoc = await PageContent.findOneAndUpdate(
        { page: pageName, section: sectionKey },
        updateData,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      return res.json({ success: true, data: updatedDoc });

    } catch (error) {
      console.error('❌ Erro no ContentController:', error);
      return res.status(500).json({ error: 'Erro ao atualizar conteúdo. Verifique o terminal.' });
    }
  }
};