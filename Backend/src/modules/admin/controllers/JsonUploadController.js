const JsonFileService = require(
    '../services/JsonFileService'
);

function redirectBack(req, res, params) {
    const baseUrl =
        `${req.protocol}://${req.get('host')}`;

    const previousPage =
        req.get('referer') || '/admin';

    const url = new URL(
        previousPage,
        baseUrl
    );

    url.searchParams.delete('uploadJsonSuccess');
    url.searchParams.delete('uploadJsonError');
    url.searchParams.delete('jsonFile');

    Object.entries(params).forEach(
        ([key, value]) => {
            url.searchParams.set(key, value);
        }
    );

    return res.redirect(
        `${url.pathname}${url.search}`
    );
}

class JsonUploadController {
    async store(req, res) {
        try {
            const { targetFile } = req.body;

            const result =
                await JsonFileService.replaceJson({
                    targetFile,
                    uploadedFile: req.file,
                });

            return redirectBack(req, res, {
                uploadJsonSuccess: '1',
                jsonFile: result.file,
            });

        } catch (error) {
            console.error(
                'Erro ao substituir JSON:',
                error
            );

            return redirectBack(req, res, {
                uploadJsonError: error.message,
            });
        }
    }
}

module.exports =
    new JsonUploadController();