import React from 'react';
import { clsx } from 'clsx';

const RadioOption = ({ label, value, groupValue, onChange }) => {
    const isSelected = groupValue === value;
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-6 h-6 flex items-center justify-center">
                <input 
                    type="radio" 
                    className="peer sr-only"
                    value={value} 
                    checked={isSelected} 
                    onChange={() => onChange(value)}
                />
                {/* Círculo externo */}
                <div className={clsx(
                    "w-6 h-6 rounded-full  transition-colors",
                    isSelected ? "bg-[#0A290F]" : "bg-[#0A290F] hover:bg-[#00490a] transition-colors",
                )}></div>
                {/* Círculo interno (só aparece se selecionado) */}
                <div className={clsx(
                    "absolute w-3 h-3 rounded-full bg-[#EBFAED] transition-transform scale-0",
                    isSelected && "scale-100"
                )}></div>
            </div>
            <h6 className={clsx("text-sm font-medium transition-colors", isSelected ? "text-[#0A290F] !font-bold" : "text-[#0A290F] !font-normal group-hover:text-[#0A290F]")}>
                {label}
            </h6>
        </label>
    );
};

export default function SidebarMapa({ filters, setFilters, timeOptions = [] }) {
    
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-[#E8F5E9] p-6 rounded-2xl h-full flex flex-col gap-8" style={{ fontFamily: 'var(--font-body)' }}>
            <div>
                <h3 className="font-bold text-[#0A290F] mb-4" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                    Selecione a sua visualização:
                </h3>
                <div className="flex flex-col gap-3">
                    <RadioOption label="CO2" value="co2" groupValue={filters.visualizacao} onChange={v => handleFilterChange('visualizacao', v)} />
                    <RadioOption label="NOx" value="nox" groupValue={filters.visualizacao} onChange={v => handleFilterChange('visualizacao', v)} />
                    <RadioOption label="Material Particulado" value="mp" groupValue={filters.visualizacao} onChange={v => handleFilterChange('visualizacao', v)} />
                    <RadioOption label="População Afetada/Poupada" value="populacao" groupValue={filters.visualizacao} onChange={v => handleFilterChange('visualizacao', v)} />
                </div>
            </div>
            <div>
                <h3 className="font-bold text-[#0A290F] mb-4" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                    Selecione a tipologia:
                </h3>
                <div className="flex flex-col gap-3">
                    <RadioOption label="Emissão" value="emissao" groupValue={filters.tipologia} onChange={v => handleFilterChange('tipologia', v)} />
                    <RadioOption label="Emissão Evitada" value="evitada" groupValue={filters.tipologia} onChange={v => handleFilterChange('tipologia', v)} />
                </div>
            </div>
            <div>
                <h3 className="font-bold text-[#0A290F] mb-4" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                    Selecione o tempo de coleta:
                </h3>
                <div className="relative">
                    <select 
                        className="w-full p-3 rounded-lg border-2 border-gray-200 bg-white text-gray-700 appearance-none focus:outline-none focus:border-[#0A290F] cursor-pointer"
                        value={filters.tempo}
                        onChange={(e) => handleFilterChange('tempo', e.target.value)}
                    >
                        <option value="">Selecione</option>
                        {timeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        <option value="2024-01">1 dia (Exemplo em dias)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#0A290F]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}