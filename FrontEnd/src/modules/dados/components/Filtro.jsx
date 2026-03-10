import React, { useEffect, useMemo, useState } from 'react';
import FiltrosFrota from './Shared/Tabela/FiltrosFrota';
import { getFrotaData } from '../service/DadosService';
import TabelaFrota from './Shared/Tabela/TabelaFrota';

const parseNumber = (val) => {
    if (val === "nan" || val == null) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
};

export default function Filtro({ variant = "plus" }) {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popBounds, setPopBounds] = useState({ min: 0, max: 2000000 });

    const [filters, setFilters] = useState({
        populacaoMin: 0,
        linha: '',
        modelo: ''
    });

    useEffect(() => {
        async function load() {
            try {
                const data = await getFrotaData();
                
                const normalizedData = data.map(item => ({
                    id_onibus: item.codigo_onibus,
                    linha: item.random_linhas || "Sem Linha",
                    modelo: item.tecnologia || "Desconhecido",
                    km_rodados: parseNumber(item.distancia_percorrida) / 1000,
                    co2: parseNumber(item.emissao_co2),
                    mp: parseNumber(item.emissao_mp),
                    nox: parseNumber(item.emissao_nox),
                    populacao_afetada: Math.max(
                        parseNumber(item.random_pop_afetada_mp), 
                        parseNumber(item.random_pop_afetada_nox)
                    ),
                    geometry: item.geometry
                }));
                if (normalizedData.length > 0) {
                    const minPop = Math.min(...normalizedData.map(d => d.populacao_afetada));
                    const maxPop = Math.max(...normalizedData.map(d => d.populacao_afetada));
                    
                    setPopBounds({ min: minPop, max: maxPop });
                    setFilters(prev => ({ ...prev, populacaoMin: minPop }));
                }
                setRawData(normalizedData);
            } catch (error) {
                console.error("Erro ao processar dados da frota", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const uniqueLines = useMemo(() =>
        [...new Set(rawData.map(d => d.linha))].filter(Boolean).sort(),
        [rawData]);

    const uniqueModels = useMemo(() =>
        [...new Set(rawData.map(d => d.modelo))].filter(Boolean).sort(),
        [rawData]);

    const filteredData = useMemo(() => {
        return rawData.filter(item => {
            if ((item.populacao_afetada || 0) < filters.populacaoMin) return false;

            if (filters.linha && item.linha !== filters.linha) return false;
            if (filters.modelo && item.modelo !== filters.modelo) return false;

            return true;
        });
    }, [rawData, filters]);

    const stats = useMemo(() => {
        if (rawData.length === 0) return { co2: 0, nox: 0, mp: 0, populacao: 0 };
        const total = rawData.length;
        const sum = rawData.reduce((acc, curr) => ({ 
            co2: acc.co2 + (curr.co2 || 0),
            nox: acc.nox + (curr.nox || 0),
            mp: acc.mp + (curr.mp || 0),
            pop: acc.pop + (curr.populacao_afetada || 0)
        }), { co2: 0, nox: 0, mp: 0, pop: 0 });

        return {
            co2: sum.co2 / total,
            nox: sum.nox / total,
            mp: sum.mp / total,
            populacao: sum.pop / total 
        };
    }, [rawData]);

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-12">
            {loading ? (
                <div className="text-center py-20 text-green-800 animate-pulse">Carregando base de dados...</div>
            ) : (
                <>
                    <FiltrosFrota
                        variant={variant}
                        filters={filters}
                        setFilters={setFilters}
                        uniqueLines={uniqueLines}
                        uniqueModels={uniqueModels}
                        stats={stats}
                        popBounds={popBounds}
                    />

                    <TabelaFrota variant={variant} data={filteredData} stats={stats}/>
                </>
            )}
        </div>
    );
}