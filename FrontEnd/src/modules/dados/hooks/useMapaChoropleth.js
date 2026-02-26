import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { getDistritosData } from '../service/DadosService';

// ==========================================
// 1. FUNÇÕES DE FORMATAÇÃO E TEXTO
// ==========================================
export const normalizeString = (str) => {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
};

export const formatValueForTooltip = (val, filterType) => {
    if (val == null || isNaN(val) || val === 0) return "Sem dados";
    if (filterType === 'populacao') return Math.round(val).toLocaleString('pt-BR');
    
    const casasDecimais = val < 1 ? 3 : 1; 
    return val.toLocaleString('pt-BR', { maximumFractionDigits: casasDecimais }) + ' t';
};

// ==========================================
// 2. LÓGICA DE CORES (GRADIENTE)
// ==========================================
export const getColor = (value, min, max) => {
    if (!value || value <= 0) return '#D9D9D9';
    const range = max - min;
    const percentage = range === 0 ? 1 : (value - min) / range;
    
    if (percentage > 0.8) return '#0A290F'; 
    if (percentage > 0.5) return '#1D5D42'; 
    if (percentage > 0.2) return '#2E7D32'; 
    if (percentage > 0.05) return '#6C7F6F'; 
    return '#B0BDB2';                        
};

// ==========================================
// 3. O HOOK PRINCIPAL DE LÓGICA DO MAPA
// ==========================================
export function useMapaChoropleth(filters, isTotalMode, isLabelsMode) {
    const [geoData, setGeoData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const geoJsonLayerRef = useRef();
    const hoveredLayerRef = useRef(null); 

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const apiDataRaw = await getDistritosData();
                const apiData = typeof apiDataRaw === 'string' ? JSON.parse(apiDataRaw) : apiDataRaw;

                const shapeRes = await fetch('https://raw.githubusercontent.com/codigourbano/distritos-sp/master/distritos-sp.geojson');
                const shapeData = await shapeRes.json();

                const normalizedApiData = {};
                if (apiData && !apiData.type) {
                    Object.keys(apiData).forEach(key => {
                        normalizedApiData[normalizeString(key)] = apiData[key];
                    });
                }

                shapeData.features.forEach(feature => {
                    const mapDistrictName = feature.properties.ds_nome || feature.properties.ds_subpref || "";
                    const searchKey = normalizeString(mapDistrictName);
                    const stats = normalizedApiData[searchKey] || {};

                    feature.properties = { 
                        ...feature.properties, 
                        nome_exibicao: mapDistrictName,
                        co2: stats.co2 || 0,
                        mp: stats.mp || 0,
                        nox: stats.nox || 0,
                        km_total: stats.km_total || 0,
                        populacao: stats.populacao || 0 
                    };
                });

                setGeoData(shapeData);
            } catch (error) {
                console.error("Erro ao processar o mapa e os dados:", error);
                setGeoData(null);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const getValueFromFeature = useCallback((feature) => {
        const propNameComTipologia = `${filters.visualizacao}_${filters.tipologia}`;
        let val = feature.properties[propNameComTipologia] ?? feature.properties[filters.visualizacao] ?? 0;
        
        if (filters.visualizacao !== 'populacao' && val > 0) {
            val = val / 1000;
        }
        return val;
    }, [filters.visualizacao, filters.tipologia]);

    const mapStats = useMemo(() => {
        if (!geoData || !geoData.features) return { max: 1, min: 0, total: 0 };
        const values = geoData.features.map(f => getValueFromFeature(f)).filter(v => v > 0);
        if (values.length === 0) return { max: 1, min: 0, total: 0 };
        return { 
            max: Math.max(...values), 
            min: Math.min(...values),
            total: values.reduce((acc, curr) => acc + curr, 0)
        };
    }, [geoData, getValueFromFeature]);

    // --- ESTILO DINÂMICO DOS POLÍGONOS ---
    const styleFeature = useCallback((feature) => {
        if (isTotalMode) {
            return {
                fillColor: '#D9D9D9',
                weight: 1,
                opacity: 1,
                color: '#D9D9D9',
                fillOpacity: 0.9
            };
        }

        const value = getValueFromFeature(feature);
        return {
            fillColor: getColor(value, mapStats.min, mapStats.max),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.9
        };
    }, [getValueFromFeature, mapStats, isTotalMode]);

    // --- CONTROLE DOS TOOLTIPS ---
    const onEachFeature = useCallback((feature, layer) => {
        if (isTotalMode) {
            layer.off(); 
            return;
        }

        const distritoName = feature.properties.nome_exibicao;
        const value = getValueFromFeature(feature);
        const formattedValue = formatValueForTooltip(value, filters.visualizacao);

        const tooltipContent = `
            <div style="background-color: ${isLabelsMode ? 'transparent' : '#0A290F'}; color: ${isLabelsMode ? '#0A290F' : 'white'}; padding: ${isLabelsMode ? '0' : '8px 12px'}; border-radius: 8px; font-family: 'Inter', sans-serif; text-align: center; text-shadow: ${isLabelsMode ? '1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white' : 'none'};">
                <p style="font-size: ${isLabelsMode ? '10px' : '14px'}; font-weight: bold; margin: 0;">${distritoName}</p>
                <p style="font-size: ${isLabelsMode ? '11px' : '13px'}; color: ${isLabelsMode ? '#1D5D42' : '#CEFA05'}; margin: 2px 0 0 0; font-weight: 900;">
                    ${formattedValue}
                </p>
            </div>
        `;
        
        if (isLabelsMode) {
            layer.bindTooltip(tooltipContent, { permanent: true, direction: 'center', className: 'custom-tooltip-labels', opacity: 0.9 });
            layer.on({
                mouseover: (e) => {
                    const l = e.target;
                    if (!l.options.originalStyle) l.options.originalStyle = { ...l.options };
                    l.setStyle({ weight: 3, color: '#0A290F' });
                },
                mouseout: (e) => {
                    if (geoJsonLayerRef.current) geoJsonLayerRef.current.resetStyle(e.target);
                }
            });
        } else {
            layer.bindTooltip(tooltipContent, { className: 'custom-tooltip-transparent', direction: 'center', opacity: 1 });

            layer.on({
                mouseover: function (e) {
                    const targetLayer = e.target;
                    if (hoveredLayerRef.current && hoveredLayerRef.current !== targetLayer) {
                        if (geoJsonLayerRef.current) {
                            geoJsonLayerRef.current.resetStyle(hoveredLayerRef.current);
                        }
                        hoveredLayerRef.current.closeTooltip();
                    }
                    hoveredLayerRef.current = targetLayer;

                    if (!targetLayer.options.originalStyle) targetLayer.options.originalStyle = { ...targetLayer.options };
                    targetLayer.setStyle({ weight: 3, color: '#CEFA05', fillOpacity: 1 });
                },
                mouseout: function (e) {
                    const targetLayer = e.target;
                    if (geoJsonLayerRef.current) geoJsonLayerRef.current.resetStyle(targetLayer);
                    else if (targetLayer.options.originalStyle) targetLayer.setStyle(targetLayer.options.originalStyle);
                    
                    targetLayer.closeTooltip();
                    if (hoveredLayerRef.current === targetLayer) {
                        hoveredLayerRef.current = null;
                    }
                }
            });
        }
    }, [getValueFromFeature, filters.visualizacao, isLabelsMode, isTotalMode]);

    useEffect(() => {
        const handleFocusLoss = () => {
            if (geoJsonLayerRef.current) {
                geoJsonLayerRef.current.eachLayer((layer) => {
                    layer.closeTooltip();
                    geoJsonLayerRef.current.resetStyle(layer);
                });
                hoveredLayerRef.current = null;
            }
        };
        window.addEventListener('blur', handleFocusLoss);
        document.addEventListener('mouseleave', handleFocusLoss);
        return () => {
            window.removeEventListener('blur', handleFocusLoss);
            document.removeEventListener('mouseleave', handleFocusLoss);
        };
    }, []);

    // Atualiza o mapa se o zoom passar pelo limite do Zoom 9 ou Zoom 12
    const layerKey = `${filters.visualizacao}-${filters.tipologia}-${filters.tempo}-T${isTotalMode}-L${isLabelsMode}`;

    return {
        geoData, loading, geoJsonLayerRef, mapStats, styleFeature, onEachFeature, layerKey
    };
}