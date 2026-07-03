const API_BASE_URL = import.meta.env.VITE_API_URL || "http://10.80.14.29:3001";

export const interpolate = (x, x0, y0, x1, y1) => {
    if (x1 === x0) return y0;
    return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const iniciarJobSimulacao = async ({ onibus, dias }) => {
    const response = await fetch(`${API_BASE_URL}/api/simulacao/jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ onibus, dias }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erro ao iniciar a simulação.");
    }

    return data;
};

export const consultarJobSimulacao = async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/api/simulacao/jobs/${jobId}`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erro ao consultar a simulação.");
    }

    return data;
};

export const fetchSimulacoesData = async ({ onibus, dias } = {}) => {
    try {
        // Modelo novo: simulação dinâmica via job
        if (onibus && dias) {
            const jobCriado = await iniciarJobSimulacao({ onibus, dias });

            for (let tentativa = 0; tentativa < 120; tentativa++) {
                const job = await consultarJobSimulacao(jobCriado.jobId);

                if (job.status === "done") {
                    return job.result;
                }

                if (job.status === "error") {
                    throw new Error(job.error || "Erro na execução da simulação.");
                }

                await sleep(1500);
            }

            throw new Error("Tempo limite excedido ao aguardar a simulação.");
        }

        // Fallback antigo, caso alguma tela ainda use o JSON estático
        const response = await fetch(`${API_BASE_URL}/api/simulacao`);

        if (!response.ok) {
            throw new Error("Erro ao buscar dados da simulação");
        }

        return await response.json();
    } catch (error) {
        console.error("Erro na API de Simulação:", error);
        return null;
    }
};

export const calcularCenarioInterpolado = (apiData, qtdOnibus) => {
    if (!apiData) return null;

    const popMedia = qtdOnibus * 8630;

    // Modelo novo: backend já devolve o resultado calculado pelo Python
    if (apiData.co2 && apiData.nox && apiData.mp) {
        return {
            co2: {
                media: apiData.co2.media,
                provavel: apiData.co2.provavel,
                max: apiData.co2.max,
            },
            nox: {
                media: apiData.nox.media,
                provavel: apiData.nox.provavel,
                max: apiData.nox.max,
            },
            mp: {
                media: apiData.mp.media,
                provavel: apiData.mp.provavel,
                max: apiData.mp.max,
            },
            pop: {
                media: popMedia,
                provavel: popMedia * 1.5,
                max: popMedia * 2.5,
            },
        };
    }

    // Modelo antigo: JSON com cenários interpolados
    if (!apiData.cenarios) return null;

    const cenarios = apiData.cenarios;
    const keys = Object.keys(cenarios).map(Number).sort((a, b) => a - b);

    let x0 = 0;
    let x1 = keys[0];
    let c0 = null;
    let c1 = cenarios[x1];

    for (let i = 0; i < keys.length; i++) {
        if (qtdOnibus === keys[i]) {
            x0 = keys[i];
            x1 = keys[i];
            c0 = cenarios[keys[i]];
            c1 = cenarios[keys[i]];
            break;
        }

        if (qtdOnibus > keys[i]) {
            x0 = keys[i];
            c0 = cenarios[keys[i]];

            if (i + 1 < keys.length) {
                x1 = keys[i + 1];
                c1 = cenarios[keys[i + 1]];
            } else {
                x1 = x0;
                c1 = c0;
            }
        }
    }

    const calcValor = (poluente, campo) => {
        if (!c0) {
            return interpolate(qtdOnibus, 0, 0, x1, c1.poluentes[poluente][campo]);
        }

        if (x0 === x1) {
            return c0.poluentes[poluente][campo];
        }

        return interpolate(
            qtdOnibus,
            x0,
            c0.poluentes[poluente][campo],
            x1,
            c1.poluentes[poluente][campo]
        );
    };

    return {
        co2: {
            media: calcValor("CO2", "media_diaria"),
            provavel: calcValor("CO2", "p75_diaria"),
            max: calcValor("CO2", "max_diaria"),
        },
        nox: {
            media: calcValor("NOx", "media_diaria"),
            provavel: calcValor("NOx", "p75_diaria"),
            max: calcValor("NOx", "max_diaria"),
        },
        mp: {
            media: calcValor("MP", "media_diaria"),
            provavel: calcValor("MP", "p75_diaria"),
            max: calcValor("MP", "max_diaria"),
        },
        pop: {
            media: popMedia,
            provavel: popMedia * 1.5,
            max: popMedia * 2.5,
        },
    };
};