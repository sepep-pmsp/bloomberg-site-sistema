import React, { useEffect, useMemo, useState } from 'react';
import FiltrosFrota from './Shared/Tabela/FiltrosFrota';
import { getFrotaData, getMediasReferencia } from '../service/DadosService';
import TabelaFrota from './Shared/Tabela/TabelaFrota';

const parseNumber = (val) => {
    if (val === 'nan' || val == null) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
};

export default function Filtro({ variant = 'plus' }) {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mediasReferencia, setMediasReferencia] = useState(null);

    const [filters, setFilters] = useState({
        linha: '',
        modelo: '',
    });

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                const [data, medias] = await Promise.all([
                    getFrotaData(variant),
                    getMediasReferencia(),
                ]);

                setMediasReferencia(medias);

                const normalizedData = data
                    .map(item => {
                        const co2 = parseNumber(item.co2_kg);
                        const mp = parseNumber(item.mp_kg);
                        const nox = parseNumber(item.nox_kg);
                        const kmRodados = parseNumber(item.distancia_km);

                        return {
                            id_onibus: item.codigo_onibus,
                            linha: item.linha || 'Sem Linha',
                            modelo: item.modelo || item.tecnologia || 'Desconhecido',
                            idade: item.ano_modelo || item.ano_fabricacao || 'Desconhecido',
                            km_rodados: kmRodados,
                            co2,
                            mp,
                            nox,
                            scorePoluicao: co2 + mp + nox,
                            populacao_afetada: null,
                            geometry: item.geometry || null,
                        };
                    })
                    .filter(item => item.co2 > 0 || item.mp > 0 || item.nox > 0 || item.km_rodados > 0);

                setRawData(normalizedData);
            } catch (error) {
                console.error('Erro ao processar dados da frota', error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [variant]);

    const uniqueLines = useMemo(() =>
        [...new Set(rawData.map(d => d.linha))].filter(Boolean).sort(),
        [rawData]
    );

    const uniqueModels = useMemo(() =>
        [...new Set(rawData.map(d => d.modelo))].filter(Boolean).sort(),
        [rawData]
    );

    const filteredData = useMemo(() => {
        return rawData.filter(item => {
            if (filters.linha && item.linha !== filters.linha) return false;
            if (filters.modelo && item.modelo !== filters.modelo) return false;
            return true;
        });
    }, [rawData, filters]);

    const stats = useMemo(() => {
        if (mediasReferencia) {
            return {
                co2: parseNumber(mediasReferencia.co2_dia),
                nox: parseNumber(mediasReferencia.nox_dia),
                mp: parseNumber(mediasReferencia.mp_dia),
                populacao: null,
            };
        }

        if (rawData.length === 0) return { co2: 0, nox: 0, mp: 0, populacao: null };

        const total = rawData.length;
        const sum = rawData.reduce((acc, curr) => ({
            co2: acc.co2 + (curr.co2 || 0),
            nox: acc.nox + (curr.nox || 0),
            mp: acc.mp + (curr.mp || 0),
        }), { co2: 0, nox: 0, mp: 0 });

        return {
            co2: sum.co2 / total,
            nox: sum.nox / total,
            mp: sum.mp / total,
            populacao: null,
        };
    }, [rawData, mediasReferencia]);

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
                    />

                    <TabelaFrota variant={variant} data={filteredData} stats={stats} />
                </>
            )}
        </div>
    );
}
