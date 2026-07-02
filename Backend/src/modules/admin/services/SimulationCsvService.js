const fs = require('fs');
const path = require('path');
const SimulacaoJobService = require('../../api/services/SimulacaoJobService');

class SimulationCsvService {
  replaceSimulationCsv(file) {
    if (!file) {
      throw new Error('Nenhum arquivo CSV foi enviado.');
    }

    const extensao = path.extname(file.originalname).toLowerCase();

    if (extensao !== '.csv') {
      this.removeTempFile(file.path);
      throw new Error('Apenas arquivos .csv são permitidos.');
    }

    const { csvPath } = SimulacaoJobService.getSimulationPaths();

    const csvDir = path.dirname(csvPath);
    const backupDir = path.join(csvDir, 'backups');

    if (!fs.existsSync(csvDir)) {
      fs.mkdirSync(csvDir, { recursive: true });
    }

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    let backupPath = null;

    if (fs.existsSync(csvPath)) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-');

      backupPath = path.join(
        backupDir,
        `backup-simulacao-${timestamp}.csv`
      );

      fs.copyFileSync(csvPath, backupPath);
    }

    fs.renameSync(file.path, csvPath);

    return {
      csvPath,
      backupPath,
      originalName: file.originalname,
    };
  }

  removeTempFile(filePath) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = new SimulationCsvService();