const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const CONTENT_DIR = path.resolve(
    __dirname,
    '../../api/content'
);

const BACKUP_DIR = path.join(
    CONTENT_DIR,
    'backups'
);

/*
 * Somente esses arquivos podem ser alterados pelo painel.
 *
 * Isso também impede alguém de mandar no formulário algo como:
 * ../../arquivo-importante
 */
const ALLOWED_FILES = new Set([
    'frota_tabela.json',
    'simulacao_monte_carlo.json',
    'mapas_distritos.json',
]);

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

function createTimestamp() {
    return new Date()
        .toISOString()
        .replace(/[:.]/g, '-');
}

async function replaceJson({
    targetFile,
    uploadedFile,
}) {
    if (!uploadedFile) {
        throw new Error('Nenhum arquivo JSON foi enviado.');
    }

    if (!ALLOWED_FILES.has(targetFile)) {
        throw new Error(
            'O arquivo de destino informado não é permitido.'
        );
    }

    const extension = path
        .extname(uploadedFile.originalname)
        .toLowerCase();

    if (extension !== '.json') {
        throw new Error(
            'Apenas arquivos com extensão .json são permitidos.'
        );
    }

    /*
     * Converte o arquivo recebido em texto.
     * Também remove BOM, caso exista.
     */
    const jsonContent = uploadedFile.buffer
        .toString('utf8')
        .replace(/^\uFEFF/, '');

    /*
     * Não basta confiar na extensão.
     *
     * arquivo.json pode conter qualquer coisa.
     */
    try {
        JSON.parse(jsonContent);
    } catch {
        throw new Error(
            'O arquivo enviado não contém um JSON válido.'
        );
    }

    const targetPath = path.join(
        CONTENT_DIR,
        targetFile
    );

    await fs.mkdir(BACKUP_DIR, {
        recursive: true,
    });

    /*
     * Faz backup do JSON atual antes de substituir.
     */
    if (await fileExists(targetPath)) {
        const fileName = path.parse(targetFile).name;

        const backupPath = path.join(
            BACKUP_DIR,
            `${fileName}-${createTimestamp()}.json`
        );

        await fs.copyFile(
            targetPath,
            backupPath
        );
    }

    /*
     * Primeiro escreve em arquivo temporário.
     *
     * Assim nunca escrevemos diretamente por cima
     * do JSON utilizado pela API.
     */
    const temporaryPath = path.join(
        CONTENT_DIR,
        `.${targetFile}.${crypto.randomUUID()}.tmp`
    );

    await fs.writeFile(
        temporaryPath,
        jsonContent,
        'utf8'
    );

    /*
     * Somente depois da validação e escrita completa
     * substituímos o arquivo oficial.
     */
    await fs.rename(
        temporaryPath,
        targetPath
    );

    return {
        file: targetFile,
        size: uploadedFile.size,
    };
}

module.exports = {
    replaceJson,
};