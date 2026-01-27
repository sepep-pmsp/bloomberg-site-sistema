#!/bin/bash

# Garante que o script rode a partir da pasta 'engine'
cd "$(dirname "$0")/.."

echo "=================================================="
echo "🚀 INICIANDO PIPELINE DE DADOS SPTRANS (V2.0)"
echo "=================================================="

# Instalação de dependências (Opcional se já estiver no Dockerfile)
echo "📦 Verificando dependências..."
pip install --no-cache-dir -r requirements.txt --break-system-packages --prefer-binary > /dev/null 2>&1

# Definindo o caminho base onde salvamos os scripts Python
# (Baseado no que fizemos nos passos anteriores: engine/data_pipeline/processed)
SCRIPTS_PROS="data_pipeline/processed"
SCRIPTS_GEO="data_pipeline/geo"
SCRIPTS_SIM="data_pipeline/simulation"

# ---------------------------------------------------------
# 1. INTELIGÊNCIA (Processa Silver -> Calcula KM e Velocidade)
# ---------------------------------------------------------
echo "🧠 [1/5] Processando Inteligência da Camada Silver..."
if [ -f "$SCRIPTS_PROS/process_silver_intelligence.py" ]; then
    python3 "$SCRIPTS_PROS/process_silver_intelligence.py"
else
    echo "⚠️ Aviso: process_silver_intelligence.py não encontrado."
fi

# ---------------------------------------------------------
# 2. SIMULAÇÃO (Gera JSON do Monte Carlo)
# ---------------------------------------------------------
echo "🎲 [2/5] Rodando Simulação de Monte Carlo..."
if [ -f "$SCRIPTS_SIM/monte_carlo_simulation_processor.py" ]; then
    python3 "$SCRIPTS_SIM/monte_carlo_simulation_processor.py"
else
    echo "⚠️ Aviso: monte_carlo_simulation_processor.py não encontrado."
fi

# ---------------------------------------------------------
# 3. TABELAS (Gera frota_tabela.json)
# ---------------------------------------------------------
echo "📊 [3/5] Gerando Tabela Consolidada..."
if [ -f "$SCRIPTS_PROS/data_processor.py" ]; then
    python3 "$SCRIPTS_PROS/data_processor.py"
else
    echo "⚠️ Aviso: data_processor.py não encontrado."
fi

# ---------------------------------------------------------
# 4. GEOESPACIAL (Gera frota_pontos.geojson e frota_rotas.geojson)
# ---------------------------------------------------------
echo "🗺️ [4/5] Gerando GeoJSON de Pontos e Rotas..."
if [ -f "$SCRIPTS_GEO/geo_processor.py" ]; then
    python3 "$SCRIPTS_GEO/geo_processor.py"
else
    echo "⚠️ Aviso: geo_processor.py não encontrado."
fi

# ---------------------------------------------------------
# 5. DISTRITOS (Gera distritos_dados.json ou mapas_distritos.json)
# ---------------------------------------------------------
echo "🏙️ [5/5] Atualizando Mapa de Distritos..."
if [ -f "$SCRIPTS_GEO/mapa_distritos_processor.py" ]; then
    python3 "$SCRIPTS_GEO/mapa_distritos_processor.py"
else
    echo "⚠️ Aviso: mapa_distritos_processor.py não encontrado."
fi

echo "=================================================="
echo "✅ PIPELINE CONCLUÍDO!"
echo "📂 Verifique a pasta /src/modules/api/content"
echo "=================================================="