import { API_BASE_URL } from '../../../service/ConfigApi'; 

const ContentService = {
  /**
   * Busca todo o conteúdo de uma página específica
   * @param {string} pageName - Ex: 'metodologia'
   * Rota final: http://10.80.14.29:3001/api/content/metodologia
   */
  getPageContent: async (pageName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${pageName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("ContentService Error:", error);
      throw error;
    }
  }
};

export default ContentService;