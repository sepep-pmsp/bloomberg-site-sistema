import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { clsx } from 'clsx';

export default function GaussianChart({ title, poluenteLabel, meanProvavel, meanMax, color = "#5B9BD5" }) {
    const [activeTab, setActiveTab] = useState('max');
    const currentMean = activeTab === 'provavel' ? meanProvavel : meanMax;
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

    const cardBg = activeTab === 'max' ? 'bg-[#D6F5DB]' : 'bg-[#196626]';
    const textColor = activeTab === 'max' ? 'text-[var(--green-600)]' : 'text-white';
    const safeGradientId = `colorUv_${poluenteLabel.replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <div className="flex flex-col">
            <div className="flex items-end gap-3 relative -left-px">
                <button onClick={() => setActiveTab('max')} className={clsx("px-4 py-2 text-sm font-bold rounded-t-xl transition-colors", activeTab === 'max' ? "bg-[#D6F5DB] text-[#196626] h-12" : "bg-[#cae0d1] text-[#0A290F] hover:bg-[#cbe6d3]")}>
                    <h2 className='!font-normal'>Cen. Máx</h2>
                </button>
                <button onClick={() => setActiveTab('provavel')} className={clsx("px-4 py-2 text-sm font-bold rounded-t-xl transition-colors", activeTab === 'provavel' ? "bg-[#196626] text-[#D6F5DB] h-12" : "bg-[#D9F0E0] text-[#0A290F] hover:bg-[#cbe6d3]")}>
                    <h2 className='!font-normal'>Cen. Provável</h2>
                </button>
            </div>
            <div className={clsx("p-6 rounded-xl rounded-tl-none flex flex-col h-100 shadow-sm transition-colors duration-300", cardBg)}>
                <h3 className={clsx("!font-normal !text-lg mb-3", textColor)}> {title}</h3>
                <div className="bg-[var(--green-50)] self-start px-4 py-1.5 rounded-full shadow-sm mb-6">
                    <h3 className="text-[var(--green-600)] !font-bold text-base">{poluenteLabel}</h3>
                </div>
                <div className="flex-1 w-full bg-white rounded p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={safeGradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <XAxis type="number" dataKey="x" domain={['dataMin', 'dataMax']} tick={{ fontSize: 10 }} tickFormatter={(val) => val.toFixed(1)}/>
                            <Tooltip formatter={(value, name, props) => [props.payload.x.toFixed(2), 'T/dia']} labelStyle={{ display: 'none' }} />
                            <Area type="monotone" dataKey="y" stroke={color} fillOpacity={1} fill={`url(#${safeGradientId})`} />
                            <ReferenceLine x={currentMean} stroke="#000" strokeDasharray="3 3" label={{ position: 'top', value: 'Média', fill: '#666', fontSize: 10 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}