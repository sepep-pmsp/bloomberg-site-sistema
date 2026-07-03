const GOLD_BASE_PATH = "/gold";

const DATA_FILES = {
    mediasReferencia: "medias-diarias-referencia_2026-06-30_gold.json",
    totalSp: "distrito-sp-total_2026-06-30_gold.json",
    onibusDiesel: "onibus_diesel_diario_2026-06-30_gold.json",
    onibusEletricos: "onibus_eletricos_diario_2026-06-30_gold.json",
    distritoDiesel: "distrito-diesel_2026-06-30_gold.geojson",
    distritoEletricos: "distrito-eletricos_2026-06-30_gold.geojson",
};

async function fetchGoldFile(fileName) {
    const response = await fetch(`${GOLD_BASE_PATH}/${fileName}`);

    if (!response.ok) {
        throw new Error(`Erro ao buscar arquivo estático: ${fileName}`);
    }

    return response.json();
}

export const getFrotaData = async (variant = "plus") => {
    try {
        const fileName = variant === "minus"
            ? DATA_FILES.onibusEletricos
            : DATA_FILES.onibusDiesel;

        return await fetchGoldFile(fileName);
    } catch (error) {
        console.error("Erro em getFrotaData:", error);
        return [];
    }
};

export const getMediasReferencia = async () => {
    try {
        const data = await fetchGoldFile(DATA_FILES.mediasReferencia);
        return data?.[0] || null;
    } catch (error) {
        console.error("Erro em getMediasReferencia:", error);
        return null;
    }
};

export const getTotaisData = async () => {
    try {
        return await fetchGoldFile(DATA_FILES.totalSp);
    } catch (error) {
        console.error("Erro em getTotaisData:", error);
        return null;
    }
};

export const getDistritosData = async (tipologia = "emissao") => {
    try {
        const fileName = tipologia === "evitada"
            ? DATA_FILES.distritoEletricos
            : DATA_FILES.distritoDiesel;

        return await fetchGoldFile(fileName);
    } catch (error) {
        console.error("Erro em getDistritosData:", error);
        return null;
    }
};

export const getFrotaRotas = async () => {
    try {
        const response = await fetch("/frota_rotas.geojson");

        if (!response.ok) {
            throw new Error("Erro ao buscar rotas");
        }

        return response.json();
    } catch (error) {
        console.error("Erro em getFrotaRotas:", error);
        return null;
    }
};