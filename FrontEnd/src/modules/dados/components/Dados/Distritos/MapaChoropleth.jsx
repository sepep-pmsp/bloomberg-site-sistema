import React, { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, useMapEvents, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CustomZoomControl from '../../../hooks/CustomZoomControl';
import { useMapaChoropleth, formatValueForTooltip } from '../../../hooks/useMapaChoropleth';

function MapZoomTracker({ onZoomChange }) {
    const map = useMapEvents({
        zoomend: () => onZoomChange(map.getZoom()),
    });
    useEffect(() => { onZoomChange(map.getZoom()); }, [map, onZoomChange]);
    return null;
}

export default function MapaChoropleth({ filters }) {
    const [zoomLevel, setZoomLevel] = useState(10);
    const isTotalMode = zoomLevel <= 9;
    const isLabelsMode = zoomLevel >= 12;
    const { 
        geoData, loading, geoJsonLayerRef, 
        mapStats, styleFeature, onEachFeature, layerKey 
    } = useMapaChoropleth(filters, isTotalMode, isLabelsMode);
    const spBounds = [
        [-24.3, -47.1], 
        [-23.1, -46.1] 
    ];

    if (loading) return <div className="w-full h-full flex items-center justify-center font-bold text-[#0A290F]">Carregando Mapa Coroplético...</div>;
    if (!geoData) return <div className="w-full h-full flex items-center justify-center font-bold text-red-600">Falha ao cruzar dados do mapa.</div>;

    return (
        <div className="w-full h-86 lg:h-full relative bg-[#F3FDF5]">
            <style>{`.custom-tooltip-transparent { background: transparent; border: none; box-shadow: none; padding: 0; }
                .custom-tooltip-labels { background: transparent; border: none; box-shadow: none; padding: 0; pointer-events: none; }
                .leaflet-tooltip-left::before, .leaflet-tooltip-right::before, .leaflet-tooltip-top::before, .leaflet-tooltip-bottom::before { display: none; }`}</style>
            {isTotalMode && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[400] bg-[#0A290F] text-white px-8 py-4 rounded-2xl shadow-2xl flex flex-col items-center border-2 border-[#CEFA05]">
                    <span className="text-sm font-medium mb-1 text-gray-300" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                        Total da Cidade de São Paulo
                    </span>
                    <span className="text-3xl font-bold text-[#CEFA05]" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                        {formatValueForTooltip(mapStats.total, filters.visualizacao)}
                    </span>
                </div>
            )}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[400] flex gap-4 h-[70%]">
                <div className="w-4 rounded-full bg-gradient-to-b from-[#0A290F] via-[#2E7D32] to-[#B0BDB2] border border-gray-200 shadow-md"></div>
                <div className="flex flex-col justify-between text-xs font-bold text-gray-600 py-2 h-full" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                    <span>Alto ({formatValueForTooltip(mapStats.max, filters.visualizacao)})</span>
                    <span>Médio</span>
                    <span>Baixo ({formatValueForTooltip(mapStats.min, filters.visualizacao)})</span>
                </div>
            </div>

            <MapContainer 
                center={[-23.5505, -46.6333]} 
                zoom={10} 
                minZoom={9}
                maxBounds={spBounds}
                maxBoundsViscosity={1.0}
                style={{ height: '100%', width: '100%', zIndex: 10, background: '#e5e5e5' }} 
                zoomControl={false} 
                attributionControl={false}
            >
                <MapZoomTracker onZoomChange={setZoomLevel} />
                <CustomZoomControl hasBackground />
                <TileLayer url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <GeoJSON 
                    key={layerKey} 
                    ref={geoJsonLayerRef} 
                    data={geoData} 
                    style={styleFeature} 
                    onEachFeature={onEachFeature} 
                />
            </MapContainer>
        </div>
    );
}