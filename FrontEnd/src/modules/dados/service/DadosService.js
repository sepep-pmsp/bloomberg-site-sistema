import { API_BASE_URL } from '../../../service/ConfigApi';

// 1. Busca os dados para a tabela principal (ID, Modelo, Linha, Emissões...)
export const getFrotaData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/json_final`);
        if (!response.ok) throw new Error('Erro ao buscar dados da frota');
        return await response.json();
    } catch (error) {
        console.error("Erro em getFrotaData:", error);
        return [];
    }
};

// 2. Busca os dados de Totais (KPIs do topo: Total patrimonial, Elétricos, etc)
export const getTotaisData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/totais-gerais`);
        if (!response.ok) throw new Error('Erro ao buscar totais gerais');
        return await response.json();
    } catch (error) {
        console.error("Erro em getTotaisData:", error);
        return null;
    }
};

// --- Funções Futuras (Para o Modal e Mapa) ---

// 3. Busca o GeoJSON das Rotas (Linhas no mapa)
export const getFrotaRotas = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/frota-rotas`);
        if (!response.ok) throw new Error('Erro ao buscar rotas');
        return await response.json();
    } catch (error) {
        console.error("Erro em getFrotaRotas:", error);
        return null;
    }
};

// 4. Busca o JSON dos Distritos (Mapa Colorido)
export const getDistritosData = async () => {
    try {
        // Ajuste a URL abaixo para a rota correta onde o seu admin salva o mapas_distritos.json
        const response = await fetch(`${API_BASE_URL}/mapas_distritos.json`); 
        if (!response.ok) throw new Error('Erro ao buscar dados dos distritos');
        return await response.json();
    } catch (error) {
        console.error("Erro em getDistritosData:", error);
        return null;
    }
};