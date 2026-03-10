import React, { useState } from 'react';
import { clsx } from 'clsx';
import ModalTrajeto from '../../Dados/Mapa/ModalTrajeto';

export default function TabelaFrota({ data, stats, variant }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedBus, setSelectedBus] = useState(null);
    const itemsPerPage = 7;
    const isMinus = variant === "minus";
    const tituloTabela = isMinus ? "Ônibus com emissões evitadas por linha/dia" : "Ônibus mais poluentes por linha/dia";
    const labelPopTable = isMinus ? "População Resguardada" : "População Afetada";

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return data;
        return [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);
    
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const renderSortIcon = (colKey) => {
        if (sortConfig.key !== colKey) return <i className="fa fa-angle-down text-gray-300 ml-2"></i>;
        return sortConfig.direction === 'asc'
            ? <i className="fa fa-angle-up text-green-600 ml-2 relative "></i>
            : <i className="fa fa-angle-down text-green-600 ml-2 relative"></i>;
    };
    return (
        <div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-[#0A290F] px-4 py-8 flex items-center gap-3">
                    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#CEFA05] flex-shrink-0" >
                        <mask id="mask0_546_351" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="37" height="37">
                            <rect width="36.4801" height="36.4801" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_546_351)">
                            <path d="M4.55981 31.9199V28.8799L7.59982 25.8399V31.9199H4.55981ZM10.6398 31.9199V22.7999L13.6798 19.7599V31.9199H10.6398ZM16.7198 31.9199V19.7599L19.7599 22.8379V31.9199H16.7198ZM22.7999 31.9199V22.8379L25.8399 19.7979V31.9199H22.7999ZM28.8799 31.9199V16.7198L31.9199 13.6798V31.9199H28.8799ZM4.55981 24.0539V19.7599L15.1998 9.11983L21.2799 15.1998L31.9199 4.55981V8.85383L21.2799 19.4939L15.1998 13.4138L4.55981 24.0539Z" fill="currentColor" />
                        </g>
                    </svg>
                    <h2 className="text-[var(--bg-page-secondary)] !text-3xl !font-normal">{tituloTabela}</h2>
                </div>
                <div className="flex flex-row w-full">
                    <div className={clsx("overflow-x-auto transition-all duration-300 flex w-full", selectedBus ? "border-r-2 border-gray-200" : "w-full")}>
                        <table className="w-full text-sm">
                            <thead className="bg-white border-b-2 border-[#6C7F6F] text-[var(--green-800)] !font-normal" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                                <tr>
                                    {[
                                        { label: 'ID do Ônibus', key: 'id_onibus' },
                                        { label: 'Modelo', key: 'modelo' },
                                        { label: 'Linha', key: 'linha' },
                                        { label: 'Kms Rodados', key: 'km_rodados' },
                                        { label: labelPopTable, key: 'populacao_afetada' },
                                    ].map(col => (
                                        <th key={col.key} className="px-4 py-4 text-left cursor-pointer hover:bg-gray-50 transition-colors w-40 !font-normal" onClick={() => handleSort(col.key)}>
                                            <div className="flex items-center gap-1">{col.label} {renderSortIcon(col.key)}</div>
                                        </th>
                                    ))}

                                    {!selectedBus && (
                                        <>
                                            <th className="px-4 py-4 border-l-3 border-[var(--green-800)] cursor-pointer hover:bg-gray-50 transition-colors !font-normal" onClick={() => handleSort('co2')}>
                                                <div className="flex items-center justify-center gap-1">CO2 {renderSortIcon('co2')}</div>
                                            </th>
                                            <th className="px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors !font-normal" onClick={() => handleSort('mp')}>
                                                <div className="flex items-center justify-center gap-1">MP {renderSortIcon('mp')}</div>
                                            </th>
                                            <th className="px-4 py-4 cursor-pointer border-r-3 border-[var(--green-800)] hover:bg-gray-50 transition-colors !font-normal" onClick={() => handleSort('nox')}>
                                                <div className="flex items-center justify-center gap-1">NOx {renderSortIcon('nox')}</div>
                                            </th>

                                            <th className="px-4 py-4 text-center w-44 border-l">Visualização de trajeto e infos.</th>

                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {currentData.length > 0 ? currentData.map((item, idx) => {
                                    const isRedPop = item.populacao_afetada > stats.populacao;
                                    const isRedEmissions = (item.co2 > stats.co2) || (item.mp > stats.mp) || (item.nox > stats.nox);
                                    const isActiveRow = selectedBus?.id_onibus === item.id_onibus;
                                    const rowClass = clsx("border-b border-[#6C7F6F] transition-colors cursor-pointer", isActiveRow ? "bg-gray-100" : "hover:bg-gray-50");
                                    const badgeClass = clsx(
                                        "px-4 py-1.5 rounded-full text-xs font-bold text-white text-center inline-block min-w-[90px] border-2",
                                        isMinus ? "bg-[#B9B9B9] border-[#B9B9B9]" : (isRedPop ? "bg-[#8A1B1B] border-[#8A1B1B]" : "bg-[#2E7D32] border-[#2E7D32]")
                                    );
                                    const pollutionCellClass = clsx(
                                        "px-6 py-4 text-center text-gray-800 font-medium",
                                        isMinus ? "bg-[#dedede]" : (isRedEmissions ? "bg-[#FFEBEB]" : "bg-[#E8F5E9]")
                                    );
                                    const lineBadgeClass = "bg-[#0A290F] text-white px-3 py-1 rounded-full text-xs font-bold text-center inline-block min-w-[70px]";
                                    return (
                                        <tr key={idx} className={rowClass} onClick={() => setSelectedBus(item)}>
                                            <td className="px-6 py-4 text-[var(--green-800)] font-semibold" style={{ fontFamily: 'var(--font-heading-secondary)' }}>{item.id_onibus}</td>
                                            <td className="px-6 py-4 text-gray-600 font-medium" style={{ fontFamily: 'var(--font-body)' }}>{item.modelo}</td>
                                            <td className="px-6 py-4" style={{ fontFamily: 'var(--font-heading-secondary)' }}><span className={lineBadgeClass}>{item.linha}</span></td>
                                            <td className="px-6 py-4 text-gray-700" style={{ fontFamily: 'var(--font-heading-secondary)' }}>{item.km_rodados.toLocaleString('pt-BR')}</td>

                                            <td className="px-6 py-4" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                                                <span className={badgeClass}>{item.populacao_afetada?.toLocaleString('pt-BR')}</span>
                                            </td>
                                            {!selectedBus && (
                                                <>
                                                    <td className={`${pollutionCellClass} border-l-3 border-[var(--green-800)]`} style={{ fontFamily: 'var(--font-heading-secondary)' }}>{item.co2.toLocaleString('pt-BR')}</td>
                                                    <td className={pollutionCellClass} style={{ fontFamily: 'var(--font-heading-secondary)' }}>{item.mp.toLocaleString('pt-BR')}</td>
                                                    <td className={`${pollutionCellClass} border-r-3 border-[var(--green-800)]`} style={{ fontFamily: 'var(--font-heading-secondary)' }}>{item.nox.toLocaleString('pt-BR')}</td>

                                                    <td className="px-6 py-4 text-center border-l bg-white">
                                                        <button
                                                            className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--green-800)] hover:bg-gray-200 transition text-white mx-auto"
                                                            onClick={(e) => { e.stopPropagation(); setSelectedBus(item); }}
                                                        >
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
                                            Nenhum dado encontrado para os filtros selecionados.
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
            {totalPages > 0 && (
                <div className="p-8 flex justify-center items-end gap-2">
                    {getPageNumbers().map((page, index) => {
                        if (page === '...') {
                            return (
                                <span key={index} className="text-[#0A290F] font-bold px-2 text-lg tracking-widest pb-1">
                                    ...
                                </span>
                            );
                        }
                        const isActive = page === currentPage;
                        return (
                            <button key={index} onClick={() => setCurrentPage(page)} className={clsx("w-9 h-9 flex items-center justify-center rounded transition-colors text-sm",
                                isActive
                                    ? "bg-[#0A290F] text-white font-bold"
                                    : "bg-[#1D5D42] text-white font-medium hover:bg-[#0A290F]"
                            )} style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                                {page}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}