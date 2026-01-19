const fs = require('fs');
const path = require('path');

class DataController {
    // Método para servir a tabela da frota (o que acabamos de testar)
    async getFrotaTabela(req, res) {
        try {
            const dataPath = path.join(__dirname, '../../content/frota_tabela.json');
            
            if (!fs.existsSync(dataPath)) {
                return res.status(404).json({ 
                    status: "error", 
                    message: "Base de dados não encontrada. Engine Python precisa ser executada." 
                });
            }

            const rawData = fs.readFileSync(dataPath, 'utf8');
            const data = JSON.parse(rawData);

            // Interface estilo FastAPI: enviando metadados úteis
            res.json({
                total_records: data.length,
                last_updated: fs.statSync(dataPath).mtime,
                data: data
            });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }
}

module.exports = new DataController();