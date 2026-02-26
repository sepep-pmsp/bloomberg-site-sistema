import React, { useState } from 'react';
import MapaChoropleth from './Dados/Distritos/MapaChoropleth';
import SidebarMapa from './Dados/Distritos/SidebarMapa';

export default function MapaDistritos() {
    const [filters, setFilters] = useState({
        visualizacao: 'co2',
        tipologia: 'emissao',
        tempo: ''
    });

    return (
        <div className="bg-[#0A290F] p-4 rounded-[32px] flex flex-col-reverse lg:flex-row gap-8 min-h-[700px] my-18">
            <div className="w-full lg:w-2/2 bg-white rounded-2xl overflow-hidden relative">
                <MapaChoropleth filters={filters} />
            </div>
            <div className="w-full lg:w-1/4">
                <SidebarMapa filters={filters} setFilters={setFilters} />
            </div>
        </div>
    );
}