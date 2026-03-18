import React, { useState, useEffect } from 'react';
import { fetchSimulacoesData, calcularCenarioInterpolado } from '../service/SimulacoesService';
import GaussianChart from '../components/GaussianChart';

export default function Simulacoes() {
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [diasInput, setDiasInput] = useState(30);
    const [onibusInput, setOnibusInput] = useState(15);
    const [simulacaoAtiva, setSimulacaoAtiva] = useState({ dias: 30, onibus: 15 });
    const [isFiltroAberto, setIsFiltroAberto] = useState(false);
    useEffect(() => {
        const carregarDados = async () => {
            const data = await fetchSimulacoesData();
            setApiData(data);
            setLoading(false);
        };
        carregarDados();
    }, []);
    const handleSimular = () => {
        setSimulacaoAtiva({ dias: diasInput, onibus: onibusInput });
    };

    if (loading) { return <div className="min-h-screen flex items-center justify-center bg-[#F3FDF5] text-xl font-bold text-[#0A290F]">Carregando simulações da API...</div>; }
    if (!apiData) { return <div className="min-h-screen flex items-center justify-center bg-[#F3FDF5] text-xl font-bold text-red-600">Erro ao conectar com a API de Simulação.</div>; }
    const dados = calcularCenarioInterpolado(apiData, simulacaoAtiva.onibus);
    const dias = simulacaoAtiva.dias;
    const fmtPoluente = (num) => (num || 0).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    const fmtPop = (num) => Math.round(num || 0).toLocaleString('pt-BR');

    return (
        <div className="min-h-screen pb-20 flex flex-col items-center gap-8" style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
            <div className="bg-[#DBFB46] w-full max-w-2xl p-6 flex flex-col items-center gap-4 relative shadow-lg z-10 rounded-b-2xl transition-all duration-300">
                <section className='!flex flex-row items-center justify-center gap-8 cursor-pointer' onClick={() => setIsFiltroAberto(!isFiltroAberto)}>
                    <h2 className="font-bold text-xl uppercase text-[#0A290F]">Simule o impacto</h2>
                    <i className={`fa-solid fa-arrow-${isFiltroAberto ? 'up' : 'down'} text-[#0A290F] text-xl`}></i>
                </section>
                <div className={`w-full flex flex-col items-center gap-4 transition-all duration-500 overflow-hidden ${isFiltroAberto ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                        <input type="number" placeholder="Insira a quantidade de dias" className="p-3 rounded bg-[#EAF7EC] text-gray-800 outline-none focus:ring-2 focus:ring-[#0A290F] w-full md:w-64 placeholder:text-gray-500 text-sm" value={diasInput}onChange={(e) => setDiasInput(Number(e.target.value))}/>
                        <input type="number" placeholder="Insira a quantidade de ônibus" className="p-3 rounded bg-[#EAF7EC] text-gray-800 outline-none focus:ring-2 focus:ring-[#0A290F] w-full md:w-80 placeholder:text-gray-500 text-sm" value={onibusInput} onChange={(e) => setOnibusInput(Number(e.target.value))}/>
                    </div>
                    <button onClick={() => { handleSimular(); setIsFiltroAberto(false);}} className="w-full md:w-[600px] bg-[#F3FDF5] text-[#0A290F] font-bold py-3 rounded hover:bg-white transition-colors shadow-sm">
                       <h2>Executar Simulação</h2>
                    </button>
                </div>
            </div>
            <div className="w-full h-full flex flex-col lg:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-2 bg-[var(--bg-page-secondary)] p-8 rounded-2xl">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="bg-[#DBFB46] text-[#0A290F] font-bold text-xl flex flex-col items-center justify-center py-4 rounded-xl shadow-sm leading-tight text-center">
                            <h3 className="text-2xl">{fmtPop(simulacaoAtiva.onibus)}</h3>
                            <h3 className='!font-normal'>ônibus</h3>
                        </div>
                        <div className="bg-white text-gray-800 font-semibold text-sm flex items-center justify-center py-4 rounded-xl shadow-sm text-center px-2">
                            <h3 className='!font-normal'>Média acumulada<br/>por dia</h3>
                        </div>
                        <div className="bg-white text-gray-800 font-semibold text-sm flex items-center justify-center py-4 rounded-xl shadow-sm text-center px-2">
                            <h3 className='!font-normal'>Média acumulada<br/>no período</h3>
                        </div>
                    </div>
                    {[
                        { label: 'CO₂ (t/dia)', val: dados.co2.media, isPop: false, colorLabel: '#2D4B39', colorData: '#719580' },
                        { label: 'NOx (t/dia)', val: dados.nox.media, isPop: false, colorLabel: '#22402F', colorData: '#6B8E7A' },
                        { label: 'MP (t/dia)', val: dados.mp.media, isPop: false, colorLabel: '#193626', colorData: '#658673' },
                        { label: 'População resguardada', val: dados.pop.media, isPop: true, colorLabel: '#122D1F', colorData: '#5C7C6A' },
                    ].map((row, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-2 h-20">
                            <div className="text-white text-xs font-semibold flex items-center justify-center py-4 px-2 rounded-xl text-center shadow-sm" style={{ backgroundColor: row.colorLabel }}>
                                <h3 className='!font-normal'>{row.label}</h3>
                            </div>
                            <div className="text-[var(--green-800)] text-sm font-semibold flex items-center justify-center py-4 rounded-full shadow-sm" style={{ backgroundColor: row.colorData }}>
                                <h3 className='!font-normal'>{row.isPop ? fmtPop(row.val) : fmtPoluente(row.val)}</h3>
                            </div>
                            <div className="text-[var(--green-800)] text-sm font-semibold flex items-center justify-center py-4 rounded-full shadow-sm" style={{ backgroundColor: row.colorData }}>
                                <h3 className='!font-normal'>{row.isPop ? fmtPop(row.val * dias) : fmtPoluente(row.val * dias)}</h3>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex-1 flex flex-col gap-2 bg-[var(--bg-page-secondary)] p-8 rounded-2xl">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-white text-gray-800 font-semibold text-sm flex items-center justify-center py-4 rounded-xl shadow-sm text-center px-4">
                            <h3 className='!font-normal'>Cenário Mais<br/>Provável* por dia</h3>
                        </div>
                        <div className="bg-white text-gray-800 font-semibold text-sm flex items-center justify-center py-4 rounded-xl shadow-sm text-center px-4">
                            <h3 className='!font-normal'>Cenário máximo<br/>evitado** por dia</h3>
                        </div>
                    </div>
                    {[
                        { prov: dados.co2.provavel, max: dados.co2.max, isPop: false },
                        { prov: dados.nox.provavel, max: dados.nox.max, isPop: false },
                        { prov: dados.mp.provavel, max: dados.mp.max, isPop: false },
                        { prov: dados.pop.provavel, max: dados.pop.max, isPop: true },
                    ].map((row, idx) => (
                        <div key={idx} className="grid grid-cols-2 gap-4 px-2 h-20">
                            <div className="bg-[#C58079] text-[var(--green-800)] text-sm font-semibold flex items-center justify-center py-4 rounded-full shadow-sm ">
                                <h3 className='!font-normal'>{row.isPop ? fmtPop(row.prov) : fmtPoluente(row.prov)}</h3>
                            </div>
                            <div className="bg-[#89DEAE] text-[var(--green-800)] text-sm font-bold flex items-center justify-center py-4 rounded-full shadow-sm">
                                <h3 className='!font-normal'>{row.isPop ? fmtPop(row.max) : fmtPoluente(row.max)}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white w-full  mt-4 p-4 rounded-xl shadow-sm border border-gray-100 text-base text-[var(--green-600)]">
                <h4><strong className='!font-extrabold'>*Cenário mais provável:</strong> Leva em consideração as substituições mais prováveis com base na idade dos ônibus em questão.</h4>
                <h4><strong className='!font-extrabold'>**Cenário máximo evitado:</strong> Leva em consideração as substituições que seriam mais benéficas em termos de redução de emissões.</h4>
            </div>
            <div className="w-full mt-12 mb-10" id='projeções'>
                <GaussianChart dados={dados} />
            </div>
        </div>
    );
}