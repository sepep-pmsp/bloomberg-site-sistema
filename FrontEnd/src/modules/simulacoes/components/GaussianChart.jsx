import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { clsx } from 'clsx';

export default function GaussianChart({ dados, color = "#5B9BD5" }) {
    const [activeTab, setActiveTab] = useState('co2');
    const tabs = [
        { id: 'co2', label: 'CO2', display: 'CO₂ (t/dia)' },
        { id: 'nox', label: 'NOx', display: 'NOx (t/dia)' },
        { id: 'mp', label: 'MP', display: 'MP (t/dia)' }
    ];
    const currentMean = dados[activeTab].provavel;
    const data = useMemo(() => {
        if (!currentMean) return [];
        const points = [];
        const stdDev = currentMean * 0.2;

        for (let i = currentMean - (stdDev * 3); i <= currentMean + (stdDev * 3); i += stdDev / 5) {
            const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((i - currentMean) / stdDev, 2));
            points.push({ x: i, y: y * 1000 });
        }
        return points;
    }, [currentMean]);

    const activeDisplay = tabs.find(t => t.id === activeTab).display;
    const safeGradientId = `colorUv_${activeTab}`;

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-end gap-2 px-4">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={clsx( "px-12 py-4 text-sm font-bold rounded-t-lg transition-colors relative lg:-left-4", activeTab === tab.id 
                        ? "bg-[#196626] text-white py-6" 
                        : "bg-[#D6F5DB] text-[#196626] hover:bg-[#b3e2bb]"
                    )}>
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="bg-[#196626] p-6 pt-6 rounded-2xl rounded-tl-none flex flex-col h-170 shadow-md">
                <h3 className="text-white !font-normal !text-base mb-4">Projeção de emissões evitadas acumuladas: </h3>
                <div className="bg-white self-start px-5 py-2 rounded-full shadow-sm mb-4">
                    <h3 className="text-[#196626] !font-black text-sm">{activeDisplay}</h3>
                </div>
                <div className="flex-1 h-full w-full bg-[#FCFCFC] rounded-lg p-2 border border-[#EBEBEB]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id={safeGradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                            <XAxis 
                                type="number" 
                                dataKey="x" 
                                domain={['dataMin', 'dataMax']} 
                                tick={{ fill: '#888', fontSize: 11 }} 
                                tickFormatter={(val) => val.toFixed(2)} 
                                axisLine={false} 
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis 
                                tick={{ fill: '#888', fontSize: 11 }} 
                                axisLine={false} 
                                tickLine={false}
                                dx={-10}
                                label={{ value: 'Densidade', angle: -90, position: 'insideLeft', offset: 0, fill: '#888', style: { textAnchor: 'middle' } }}
                            />
                            <Tooltip formatter={(value, name, props) => [props.payload.x.toFixed(3), 'T/dia']} labelStyle={{ display: 'none' }} />
                            <Area type="monotone" dataKey="y" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#${safeGradientId})`} />
                            <ReferenceLine x={currentMean} stroke="#000" strokeWidth={1.5} strokeDasharray="4 4" label={{ position: 'top', value: 'Média', fill: '#666', fontSize: 11 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}