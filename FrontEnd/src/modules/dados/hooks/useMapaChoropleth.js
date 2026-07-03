import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import proj4 from 'proj4';
import { getDistritosData } from '../service/DadosService';

const utm23s = '+proj=utm +zone=23 +south +datum=WGS84 +units=m +no_defs';

export const normalizeString = (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
};

export const formatValueForTooltip = (val, filterType) => {
    if (val == null || isNaN(val) || val === 0) return 'Sem dados';

    if (filterType === 'populacao') return '';

    const casasDecimais = val < 1 ? 3 : 1;
    return val.toLocaleString('pt-BR', { maximumFractionDigits: casasDecimais }) + ' t';
};

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

const converterPontoUtmParaLatLng = ([x, y]) => {
    if (Math.abs(x) <= 180 && Math.abs(y) <= 90) return [x, y];

    const [lng, lat] = proj4(utm23s, 'WGS84', [x, y]);
    return [lng, lat];
};

const converterCoordenadas = (coords) => {
    if (!Array.isArray(coords)) return coords;

    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        return converterPontoUtmParaLatLng(coords);
    }

    return coords.map(converterCoordenadas);
};

const prepararFeature = (feature) => {
    const properties = feature.properties || {};

    return {
        ...feature,
        properties: {
            ...properties,
            nome_exibicao: properties.nm_distrito || properties.ds_nome || properties.nome || 'Distrito',
            co2_emissao: Number(properties.co2_emissao) || 0,
            nox_emissao: Number(properties.nox_emissao) || 0,
            mp_emissao: Number(properties.mp_emissao) || 0,
            populacao: null,
        },
        geometry: feature.geometry
            ? {
                ...feature.geometry,
                coordinates: converterCoordenadas(feature.geometry.coordinates),
            }
            : feature.geometry,
    };
};

export function useMapaChoropleth(filters, isTotalMode, isLabelsMode) {
    const [geoData, setGeoData] = useState(null);
    const [loading, setLoading] = useState(true);

    const geoJsonLayerRef = useRef();
    const hoveredLayerRef = useRef(null);

    useEffect(() => {
        async function load() {
            setLoading(true);

            try {
                const apiDataRaw = await getDistritosData(filters.tipologia);
                const apiData = typeof apiDataRaw === 'string' ? JSON.parse(apiDataRaw) : apiDataRaw;

                if (!apiData || apiData.type !== 'FeatureCollection') {
                    throw new Error('GeoJSON de distritos inválido ou não encontrado.');
                }

                const geoJson = {
                    ...apiData,
                    features: (apiData.features || []).map(prepararFeature),
                };

                setGeoData(geoJson);
            } catch (error) {
                console.error('Erro ao processar o mapa e os dados:', error);
                setGeoData(null);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [filters.tipologia]);

    const getValueFromFeature = useCallback((feature) => {
        if (filters.visualizacao === 'populacao') return 0;

        const campo = `${filters.visualizacao}_emissao`;
        const valorKg = Number(feature.properties?.[campo]) || 0;

        return valorKg / 1000;
    }, [filters.visualizacao]);

    const mapStats = useMemo(() => {
        if (!geoData || !geoData.features) return { max: 1, min: 0, total: 0 };

        const values = geoData.features
            .map(f => getValueFromFeature(f))
            .filter(v => v > 0);

        if (values.length === 0) return { max: 1, min: 0, total: 0 };

        return {
            max: Math.max(...values),
            min: Math.min(...values),
            total: values.reduce((acc, curr) => acc + curr, 0),
        };
    }, [geoData, getValueFromFeature]);

    const styleFeature = useCallback((feature) => {
        if (isTotalMode) {
            return {
                fillColor: '#D9D9D9',
                weight: 1,
                opacity: 1,
                color: '#D9D9D9',
                fillOpacity: 0.9,
            };
        }

        const value = getValueFromFeature(feature);

        return {
            fillColor: getColor(value, mapStats.min, mapStats.max),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.9,
        };
    }, [getValueFromFeature, mapStats, isTotalMode]);

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
                },
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
                },
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

    const layerKey = `${filters.visualizacao}-${filters.tipologia}-${filters.tempo}-T${isTotalMode}-L${isLabelsMode}`;

    return {
        geoData,
        loading,
        geoJsonLayerRef,
        mapStats,
        styleFeature,
        onEachFeature,
        layerKey,
    };
}
