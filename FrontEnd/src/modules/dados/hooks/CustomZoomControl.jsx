import React from 'react';
import { useMap } from 'react-leaflet';
import { clsx } from 'clsx'; // Vamos usar o clsx para alternar os estilos

export default function CustomZoomControl({ hasBackground = false }) {
    const map = useMap();
    const buttonClass = clsx(
        "w-10 h-10 flex items-center justify-center text-[#0A290F] hover:scale-110 transition-transform cursor-pointer",
        hasBackground && "bg-white rounded-full shadow-md"
    );
    const iconClass = clsx(
        "drop-shadow-sm",
        hasBackground ? "w-6 h-6" : "w-8 h-8"
    );

    return (
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
            <button onClick={(e) => { e.stopPropagation(); map.zoomIn(); }} className={buttonClass}  title="Aproximar" >
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
            </button>
            <button  onClick={(e) => { e.stopPropagation(); map.zoomOut(); }} className={buttonClass}  title="Afastar">
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
            </button>
        </div>
    );
}