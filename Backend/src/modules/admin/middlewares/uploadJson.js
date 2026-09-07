const multer = require('multer');

const uploadJson = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
        files: 1,
    },
});

module.exports = uploadJson;