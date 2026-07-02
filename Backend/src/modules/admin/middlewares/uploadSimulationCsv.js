const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadTempDir = path.resolve(__dirname, '../../../../data/uploads/tmp');

if (!fs.existsSync(uploadTempDir)) {
  fs.mkdirSync(uploadTempDir, { recursive: true });
}

const simulationCsvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadTempDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `simulacao-upload-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: simulationCsvStorage,

  limits: {
    fileSize: 1024 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext !== '.csv') {
      return cb(new Error('Apenas arquivos .csv são permitidos.'));
    }

    return cb(null, true);
  },
});

function uploadSimulationCsv(req, res, next) {
  upload.single('csvSimulacao')(req, res, (err) => {
    if (err) {
      return res.redirect(
        '/admin/simulation/simulacao?uploadError=' +
        encodeURIComponent(err.message)
      );
    }

    return next();
  });
}

module.exports = uploadSimulationCsv;