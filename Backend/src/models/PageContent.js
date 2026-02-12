const mongoose = require('mongoose');

const PageContentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    required: true, 
    index: true // Ex: 'metodologia', 'home', 'dados'
  },
  section: { 
    type: String, 
    required: true // Ex: 'banner', 'reducoes_acordeon', 'cards_cenarios'
  },
  content: {
    // Aqui guardamos o objeto JSON flexível com os textos
    // Ex: { title: "...", description: "...", items: [] }
    type: mongoose.Schema.Types.Mixed, 
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Garante que não tenhamos duas seções iguais na mesma página
PageContentSchema.index({ page: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('PageContent', PageContentSchema);