import React from 'react';

export default function FiltrosFrota({ filters, setFilters, uniqueLines, uniqueModels, stats, popBounds, variant }) {

    const fmt = (n) => n?.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    const range = popBounds.max - popBounds.min;
    const percentage = range === 0 ? 0 : ((filters.populacaoMin - popBounds.min) / range) * 100;

    const isMinus = variant === "minus";
    const labelFaixaPop = isMinus ? "Faixa de população resguardada:" : "Faixa de população afetada:";

    return (
        <>
            <div className="bg-[#0A290F] text-white p-6 rounded-2xl mb-4 shadow-lg flex flex-col items-center md:items-start">
                <div className="mb-6">
                    <span className="bg-[#D6F5DB] text-[#0A290F] text-xs font-bold px-3 py-1 rounded-full break-all">
                        *dados do dia 31/12/2025, 6h às 18h
                    </span>
                </div>
                <div className={`flex flex-col items-start lg:flex-row ${isMinus ? 'justify-start gap-18' : 'justify-between'} lg:items-center gap-8 w-full`}>
                    <div className="lg:col-span-5 space-y-2 w-1/5">
                        <label for="name" className="text-sm flex items-center gap-2">
                            <h3 className='!font-normal text-[var(--green-50)]'>{labelFaixaPop}</h3>
                        </label>
                        <input type="range"
                            min={popBounds.min}
                            max={popBounds.max}
                            step="10"
                            id='name'
                            value={filters.populacaoMin}
                            onChange={(e) => setFilters(prev => ({ ...prev, populacaoMin: Number(e.target.value) }))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#CEFA05]"
                            style={{ background: `linear-gradient(to right, #1D5D42 ${percentage}%, #ffffff ${percentage}%)` }} />

                        <div className="flex justify-between text-xs text-gray-300 font-mono mt-1">
                            <h3 className='!font-normal text-[var(--green-50)]'>{fmt(popBounds.min)}</h3>
                            <h3 className='!font-normal text-[var(--green-50)]'>{fmt(popBounds.max)}</h3>
                        </div>
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <h3 className='!font-normal text-[var(--green-50)]'>Filtrar por:</h3>
                        <div className='flex flex-row items justify-center gap-8'>
                            <div className="w-1/2">
                                <select className="w-full h-10 px-3 rounded text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" value={filters.linha} onChange={(e) => setFilters(prev => ({ ...prev, linha: e.target.value }))} >
                                    <option value="">Linha</option>
                                    {uniqueLines.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div className="w-1/2">
                                <select className="w-full h-10 px-3 rounded text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                    value={filters.modelo}
                                    onChange={(e) => setFilters(prev => ({ ...prev, modelo: e.target.value }))}>

                                    <option value="">Modelo</option>
                                    {uniqueModels.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    {!isMinus && (
                        <div className='flex flex-col gap-4'>
                            <h2 className='!font-normal text-[var(--green-50)]'>legenda:</h2>
                            <span className='w-full flex flex-col items-start gap-3 break-all'>
                                <span className='flex flex-row items-center gap-4 break-all'>
                                    <span className='flex w-4 h-4 !border-3 border-white bg-red-600'></span>
                                    <p className='break-all'>valores acima da média</p>
                                </span>
                                <span className='flex flex-row items-center gap-4 break-all'>
                                    <span className='flex w-4 h-4 !border-3 border-white bg-green-600'></span>
                                    <p className='break-all w-36'>Valores abaixo ou dentro da média</p>
                                </span>
                            </span>
                        </div>
                    )}
                    {!isMinus && (
                        <div className="flex flex-col text-gray-800 p-3 rounded-lg text-xs shadow-inner">
                        <h4 className="font-bold border-b border-gray-200 p-3 mb-2 bg-white rounded-sm">
                            Valores de média diária* para referência:
                        </h4>
                        <div className='flex flex-row item justify-center gap-2'>
                            <div className="flex flex-col flex-nowrap items-stretch justify-center gap-8 gap-y-1 p-3 bg-white rounded-sm">
                                <div className="flex flex-row flex-nowrap items-center justify-around gap-12">
                                    <span className="font-semibold text-gray-600">CO2</span>
                                    <span className="bg-[#E8F5E9] px-2 rounded text-green-800 lg:w-30">{fmt(stats.co2)} kg/dia</span>
                                </div>
                                <div className="flex flex-row flex-nowrap items-center justify-around gap-12">
                                    <span className="font-semibold text-gray-600">NOx</span>
                                    <span className="bg-[#E8F5E9] px-2 rounded text-green-800 lg:w-30">{fmt(stats.nox)} g/dia</span>
                                </div>
                                <div className="flex flex-row flex-nowrap items-center justify-around gap-12">
                                    <span className="font-semibold text-gray-600">MP</span>
                                    <span className="bg-[#E8F5E9] px-2 rounded text-green-800 lg:w-30">{fmt(stats.mp)} g/dia</span>
                                </div>
                            </div>
                            <div className="row-span-3 flex flex-col justify-between items-center border-l p-3 bg-white rounded-sm">
                                <span className="font-semibold text-gray-600 mb-1">População Afetada</span>
                                <span className="bg-[#E8F5E9] px-2 py-1 rounded text-green-800 font-bold text-center w-full">
                                    {fmt(stats.populacao)}
                                </span>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <div className="my-6 flex flex-wrap gap-2 min-h-[30px] py-5 px-4 items-center bg-[#0A290F] rounded-2xl">
                {filters.linha && (
                    <span className="bg-[#D6F5DB] text-[#0A290F] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        {filters.linha}
                        <button onClick={() => setFilters(prev => ({ ...prev, linha: '' }))} className="hover:text-red-600">✕</button>
                    </span>
                )}
                {filters.modelo && (
                    <span className="bg-[#D6F5DB] text-[#0A290F] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        {filters.modelo}
                        <button onClick={() => setFilters(prev => ({ ...prev, modelo: '' }))} className="hover:text-red-600">✕</button>
                    </span>
                )}
                {filters.populacaoMin > popBounds.min && (
                    <span className="bg-[#D6F5DB] text-[#0A290F] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        Pop &gt; {filters.populacaoMin.toLocaleString('pt-BR')}
                        <button onClick={() => setFilters(prev => ({ ...prev, populacaoMin: popBounds.min }))} className="hover:text-red-600">
                            ✕
                        </button>
                    </span>
                )}
            </div>
        </>
    );
}