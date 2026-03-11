import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import ModalTrajeto from '../../dados/components/Dados/Mapa/ModalTrajeto';

const API_BASE_URL = 'http://10.80.14.29:3001/api';

const parseNumber = (val) => {
    if (val === "nan" || val == null) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
};

export default function Tabela() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBus, setSelectedBus] = useState(null);
    useEffect(() => {
        async function load() {
            try {
                const response = await fetch(`${API_BASE_URL}/json_final`);
                if (!response.ok) throw new Error("Falha ao buscar json_final");

                const rawData = await response.json();

                const normalizedData = rawData.map(item => {
                    const co2 = parseNumber(item.emissao_co2);
                    const mp = parseNumber(item.emissao_mp);
                    const nox = parseNumber(item.emissao_nox);
                    const scorePoluicao = co2 + mp + nox;

                    return {
                        id_onibus: item.codigo_onibus,
                        linha: item.random_linhas || "Sem Linha",
                        modelo: item.tecnologia || "Desconhecido",
                        idade: item.ano_fabricacao || "Desconhecido",
                        km_rodados: parseNumber(item.distancia_percorrida) / 1000,
                        co2, mp, nox, scorePoluicao,
                        populacao_afetada: Math.max(
                            parseNumber(item.random_pop_afetada_mp),
                            parseNumber(item.random_pop_afetada_nox)
                        ),
                        geometry: item.geometry
                    };
                });
                const top7 = normalizedData
                    .sort((a, b) => b.scorePoluicao - a.scorePoluicao)
                    .slice(0, 7);

                setData(top7);
            } catch (error) {
                console.error("Erro ao processar dados de sugestão:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);
    const fmtPoluente = (num) => (num || 0).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    const fmtPop = (num) => Math.round(num || 0).toLocaleString('pt-BR');
    return (
        <div className="w-full py-10 px-4">
            {loading ? (
                <div className="text-center py-20 text-[var(--green-800)] animate-pulse font-bold text-xl">
                    Carregando Sugestões de Substituição...
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-[#0A290F] px-6 py-6 flex items-center gap-4">
                        <i className="fa-solid fa-chart-line text-[#CEFA05] text-2xl"></i>
                        <h2 className="text-[#F3FDF5] !text-2xl !font-normal">
                            Sugestões para substituição de veículos com mais emissões por linha
                        </h2>
                    </div>
                    <div className="flex flex-row w-full">
                        <div className={clsx("overflow-x-auto transition-all duration-300 flex w-full", selectedBus ? "border-r-2 border-gray-200" : "w-full")}>
                            <table className="w-full text-sm">
                                <thead className="bg-white border-b-2 border-[#6C7F6F] text-[var(--green-800)] !font-normal" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                                    <tr>
                                        <th className="px-4 py-4 text-left font-normal whitespace-nowrap">Idade do ônibus <i className="fa fa-angle-down text-gray-300 ml-1"></i></th>
                                        <th className="px-4 py-4 text-left font-normal">Modelo <i className="fa fa-angle-down text-gray-300 ml-1"></i></th>
                                        <th className="px-4 py-4 text-left font-normal">Linha <i className="fa fa-angle-down text-gray-300 ml-1"></i></th>
                                        <th className="px-4 py-4 text-left font-normal whitespace-nowrap">Kms Rodados <i className="fa fa-angle-down text-gray-300 ml-1"></i></th>
                                        <th className="px-4 py-4 text-left font-normal whitespace-nowrap">População Afetada <i className="fa fa-angle-down text-gray-300 ml-1"></i></th>
                                        {!selectedBus && (
                                            <>
                                                <th className="px-4 py-4 border-l-2 border-[var(--green-800)] font-normal text-center">CO2 <i className="fa fa-angle-down text-gray-300 ml-1"></i></th>
                                                <th className="px-4 py-4 font-normal text-center">MP <i className="fa fa-angle-down text-gray-300 ml-1"></i></th>
                                                <th className="px-4 py-4 border-r-2 border-[var(--green-800)] font-normal text-center">NOx <i className="fa fa-angle-down text-gray-300 ml-1"></i></th>
                                                <th className="px-4 py-4 text-center w-40 border-l font-normal">Visualização de trajeto e infos.</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {data.length > 0 ? data.map((item, idx) => {
                                        const isActiveRow = selectedBus?.id_onibus === item.id_onibus;
                                        const rowClass = clsx("border-b border-[#6C7F6F] transition-colors cursor-pointer", isActiveRow ? "bg-gray-100" : "hover:bg-gray-50");
                                        const badgePopClass = "px-4 py-1.5 rounded-full text-xs font-bold text-white text-center inline-block min-w-[90px] bg-[#8A1B1B]";
                                        const lineBadgeClass = "bg-[#0A290F] text-white px-3 py-1 rounded-full text-xs font-bold text-center inline-block min-w-[70px]";
                                        const pollutionCellClass = "px-6 py-4 text-center text-gray-800 font-medium bg-[#FFEBEB]";
                                        return (
                                            <tr key={idx} className={rowClass} onClick={() => setSelectedBus(item)}>
                                                <td className="px-6 py-4 text-gray-600 font-medium" style={{ fontFamily: 'var(--font-body)' }}>{item.id_onibus}</td>
                                                <td className="px-6 py-4 text-[var(--green-800)] font-semibold" style={{ fontFamily: 'var(--font-heading-secondary)' }}>{item.modelo}</td>
                                                <td className="px-6 py-4" style={{ fontFamily: 'var(--font-heading-secondary)' }}><span className={lineBadgeClass}>{item.linha}</span></td>
                                                <td className="px-6 py-4 text-gray-700" style={{ fontFamily: 'var(--font-heading-secondary)' }}>{fmtPop(item.km_rodados)}</td>
                                                <td className="px-6 py-4" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                                                    <span className={badgePopClass}>{fmtPop(item.populacao_afetada)}</span>
                                                </td>
                                                {!selectedBus && (
                                                    <>
                                                        <td className={`${pollutionCellClass} border-l-2 border-[var(--green-800)]`} style={{ fontFamily: 'var(--font-heading-secondary)' }}>{fmtPoluente(item.co2)}</td>
                                                        <td className={pollutionCellClass} style={{ fontFamily: 'var(--font-heading-secondary)' }}>{fmtPoluente(item.mp)}</td>
                                                        <td className={`${pollutionCellClass} border-r-2 border-[var(--green-800)]`} style={{ fontFamily: 'var(--font-heading-secondary)' }}>{fmtPoluente(item.nox)}</td>
                                                        <td className="px-6 py-4 text-center border-l bg-white">
                                                            <button className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--green-800)] hover:bg-gray-200 transition text-white mx-auto" onClick={(e) => { e.stopPropagation(); setSelectedBus(item); }}>
                                                                <i className="fa-regular fa-eye text-xl"></i>
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={selectedBus ? "5" : "9"} className="px-6 py-10 text-center text-gray-500 font-medium bg-white">
                                                Nenhum dado encontrado para sugestão de substituição.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {selectedBus && (
                                <div className="w-full lg:w-[95%] bg-white border rounded-xl border-solid">
                                    <ModalTrajeto bus={selectedBus} onClose={() => setSelectedBus(null)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}