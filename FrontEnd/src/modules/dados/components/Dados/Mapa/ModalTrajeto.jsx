import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import proj4 from 'proj4';
import 'leaflet/dist/leaflet.css';
import CustomZoomControl from '../../../hooks/CustomZoomControl';

const utm23s = "+proj=utm +zone=23 +south +datum=WGS84 +units=m +no_defs";

const parseLineString = (wkt) => {
    if (!wkt || !wkt.includes('LINESTRING')) return [];
    try {
        const coordsStr = wkt.replace('LINESTRING (', '').replace('LINESTRING(', '').replace(')', '');
        return coordsStr.split(',').map(point => {
            const [x, y] = point.trim().split(' ').map(Number);
            const [lng, lat] = proj4(utm23s, "WGS84", [x, y]);
            return [lat, lng];
        });
    } catch (e) {
        console.error("Erro ao converter rota UTM para LatLng:", e);
        return [];
    }
};

function MapBounds({ coordinates }) {
    const map = useMap();
    React.useEffect(() => {
        if (coordinates && coordinates.length > 0) {
            setTimeout(() => {
                map.invalidateSize();
                map.fitBounds(coordinates, { padding: [40, 40] });
            }, 100);
        }
    }, [coordinates, map]);
    return null;
}


export default function ModalTrajeto({ bus, onClose }) {
    const routeCoordinates = useMemo(() => {
        if (!bus || !bus.geometry || bus.geometry === "N/A") return [];
        return parseLineString(bus.geometry);
    }, [bus]);

    if (!bus) return null;

    const startPoint = routeCoordinates.length > 0 ? routeCoordinates[0] : null;
    const endPoint = routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1] : null;

    return (
        <div className="w-sm lg:w-full h-full p-4 flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between gap-4">
                <div className="bg-[#0A290F] text-white flex-1 py-2 px-6 rounded-full text-center font-bold" style={{ fontFamily: 'var(--font-heading-secondary)' }}>
                    {bus.id_onibus}
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#0A290F] text-[#0A290F] hover:bg-[#0A290F] hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div className="bg-[#0A290F] text-white w-full py-2 px-6 rounded-full text-center text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                {bus.linha} - Trajeto Registrado
            </div>
            <div className="flex-1 min-h-[450px] w-full rounded-xl overflow-hidden relative bg-[#e5e5e5]">
                {routeCoordinates.length === 0 && (
                    <div className="absolute inset-0 z-[50] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm text-gray-600">
                        <i className="fas fa-map-marker-alt text-4xl mb-3 text-gray-400"></i>
                        <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading-secondary)' }}>Trajeto Indisponível</h3>
                    </div>
                )}
                
                <MapContainer center={[-23.5505, -46.6333]} zoom={11} style={{ height: '100%', width: '100%', zIndex: 10 }} zoomControl={false}>
                    <MapBounds coordinates={routeCoordinates} />
                    <CustomZoomControl />
                    <TileLayer url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; CODATA'/>
                    {routeCoordinates.length > 0 && (
                        <Polyline positions={routeCoordinates} color="#CEFA05" weight={5} opacity={0.9} />
                    )}
                    {startPoint && <CircleMarker center={startPoint} radius={8} pathOptions={{ color: '#0A290F', fillColor: '#0A290F', fillOpacity: 1 }} />}
                    {endPoint && <CircleMarker center={endPoint} radius={8} pathOptions={{ color: '#0A290F', fillColor: '#0A290F', fillOpacity: 1 }} />}
                </MapContainer>
                <div className="absolute bottom-4 left-2 z-[20] bg-[#0A290F] text-[var(--green-50)] p-3 rounded-lg shadow-lg text-xs leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    <h4><strong className="text-[var(--green-50)] !font-bold">Empresa:</strong> <span className='text-[var(--green-50)] !font-normal'>{bus.modelo}</span></h4>
                    <h4><strong className="text-[var(--green-50)] !font-bold">KM Rodados:</strong> <span className='text-[var(--green-50)] !font-normal'>{bus.km_rodados.toLocaleString('pt-BR')}</span></h4>
                    <h4><strong className="text-[var(--green-50)] !font-bold">CO2:</strong> <span className='text-[var(--green-50)] !font-normal'>{bus.co2.toLocaleString('pt-BR')} kg</span></h4>
                    <h4><strong className="text-[var(--green-50)] !font-bold">População:</strong> <span className='text-[var(--green-50)] !font-normal'>{bus.populacao_afetada?.toLocaleString('pt-BR')}</span></h4>
                </div>
            </div>
        </div>
    );
}