export const interpolate = (x, x0, y0, x1, y1) => {
    if (x1 === x0) return y0;
    return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
};

export const fetchSimulacoesData = async () => {
    try {
        const response = await fetch('http://10.80.14.29:3001/api/simulacao');
        if (!response.ok) throw new Error("Erro ao buscar dados da simulação");
        return await response.json();
    } catch (error) {
        console.error("Erro na API de Simulação:", error);
        return null;
    }
};

export const calcularCenarioInterpolado = (apiData, qtdOnibus) => {
    if (!apiData || !apiData.cenarios) return null;

    const cenarios = apiData.cenarios;
    const keys = Object.keys(cenarios).map(Number).sort((a, b) => a - b);

    let x0 = 0, x1 = keys[0];
    let c0 = null, c1 = cenarios[x1];
    for (let i = 0; i < keys.length; i++) {
        if (qtdOnibus === keys[i]) {
            x0 = keys[i]; x1 = keys[i];
            c0 = cenarios[keys[i]]; c1 = cenarios[keys[i]];
            break;
        }
        if (qtdOnibus > keys[i]) {
            x0 = keys[i];
            c0 = cenarios[keys[i]];
            if (i + 1 < keys.length) {
                x1 = keys[i + 1];
                c1 = cenarios[keys[i + 1]];
            } else {
                x1 = x0; c1 = c0;
            }
        }
    }

    const calcValor = (poluente, campo) => {
        if (!c0) return interpolate(qtdOnibus, 0, 0, x1, c1.poluentes[poluente][campo]);
        if (x0 === x1) return c0.poluentes[poluente][campo];
        return interpolate(qtdOnibus, x0, c0.poluentes[poluente][campo], x1, c1.poluentes[poluente][campo]);
    };
    const popMedia = qtdOnibus * 8630; 

    return {
        co2: {
            media: calcValor('CO2', 'media_diaria'),
            provavel: calcValor('CO2', 'p75_diaria'),
            max: calcValor('CO2', 'max_diaria')
        },
        nox: {
            media: calcValor('NOx', 'media_diaria'),
            provavel: calcValor('NOx', 'p75_diaria'),
            max: calcValor('NOx', 'max_diaria')
        },
        mp: {
            media: calcValor('MP', 'media_diaria'),
            provavel: calcValor('MP', 'p75_diaria'),
            max: calcValor('MP', 'max_diaria')
        },
        pop: {
            media: popMedia,
            provavel: popMedia * 1.5,
            max: popMedia * 2.5
        }
    };
};