"""
@autor: Yuri Idalgo de Matos da Silva
criado em: 18/06/2026
atualizado em: 23/06/2026
descrição: Script para realizar a simulação de Monte Carlo
para emissões de poluentes em CO2, NOx e MP, considerando diferentes cenários de frota de ônibus.
"""

import argparse
import json
import pandas as pd
import numpy as np
from scipy.stats import median_abs_deviation


# Exemplo de função para filtrar usando o MAD (Median Absolute Deviation)
def remove_outliers_mad(df, coluna, threshold=3.5):
    dados = df[coluna]
    mediana = np.median(dados)
    mad = median_abs_deviation(dados)

    # Evita divisão por zero se o MAD for 0
    if mad == 0:
        return df

    z_scores_modificados = 0.6745 * (dados - mediana) / mad
    return df[np.abs(z_scores_modificados) < threshold]


def simMonteCarlo(df_consume_tabele, Y, days, N=2000):
    df_filtered = df_consume_tabele[df_consume_tabele['tecnologia'] != 'Elétrico'].copy()

    emissions_pool_co2 = df_filtered['emissao_co2(t)'].to_numpy()
    emissions_pool_nox = df_filtered['emissao_nox(t)'].to_numpy()
    emissions_pool_mp = df_filtered['emissao_mp(t)'].to_numpy()

    shape = (N, days, Y)

    sim_emissions_co2 = np.random.choice(emissions_pool_co2, size=shape, replace=True)
    sim_emissions_nox = np.random.choice(emissions_pool_nox, size=shape, replace=True)
    sim_emissions_mp = np.random.choice(emissions_pool_mp, size=shape, replace=True)

    daily_emissions_co2 = sim_emissions_co2.sum(axis=2)
    daily_emissions_nox = sim_emissions_nox.sum(axis=2)
    daily_emissions_mp = sim_emissions_mp.sum(axis=2)

    cumulative_co2 = daily_emissions_co2.sum(axis=1)
    cumulative_nox = daily_emissions_nox.sum(axis=1)
    cumulative_mp = daily_emissions_mp.sum(axis=1)

    return {
        "onibus": Y,
        "dias": days,
        "co2": {
            "media": float(np.mean(cumulative_co2)),
            "provavel": float(np.percentile(cumulative_co2, 75)),
            "max": float(np.max(cumulative_co2))
        },
        "nox": {
            "media": float(np.mean(cumulative_nox)),
            "provavel": float(np.percentile(cumulative_nox, 75)),
            "max": float(np.max(cumulative_nox))
        },
        "mp": {
            "media": float(np.mean(cumulative_mp)),
            "provavel": float(np.percentile(cumulative_mp, 75)),
            "max": float(np.max(cumulative_mp))
        }
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--onibus", type=int, required=True)
    parser.add_argument("--dias", type=int, required=True)
    parser.add_argument("--csv", type=str, required=True)
    args = parser.parse_args()

    # Estrutura padrão de resposta para o Back-end / Front-end
    resposta = {"sucesso": False, "dados": None, "erro": None}

    try:
        # Validações internas
        if args.onibus <= 0 or args.onibus > 1000:
            raise ValueError("O número de ônibus deve estar entre 1 e 1000.")
        if args.dias <= 0 or args.dias > 365:
            raise ValueError("O número de dias deve estar entre 1 e 365.")
        
        # Leitura dos dados e pré-processamento
        df = pd.read_csv(args.csv)
        df['distancia_percorrida'] = df['distancia_percorrida'] / 1000  # Convertendo de metros para quilômetros, ajuste conforme a unidade original da coluna
        df = df[df['distancia_percorrida'] >= 15 ]  # Filtrando para considerar apenas os ônibus que percorreram mais de 15 km, ajuste conforme a necessidade do seu cenário# Filtrando registros com distância percorrida maior que zero
        df = remove_outliers_mad(df, 'emissao_co2(t)')
        df = remove_outliers_mad(df, 'emissao_nox(t)')
        df = remove_outliers_mad(df, 'emissao_mp(t)')
        

        # Execução
        resultado = simMonteCarlo(df_consume_tabele=df, Y=args.onibus, days=args.dias, N=2000)
        
        resposta["sucesso"] = True
        resposta["dados"] = resultado

    except Exception as e:
        # Se qualquer coisa falhar (arquivo não existe, validação, etc) o JSON avisa o Back-end de forma amigável
        resposta["sucesso"] = False
        resposta["erro"] = str(e)

    # O print final é SEMPRE um JSON válido, facilitando a vida do Front/Back-end
    print(json.dumps(resposta, ensure_ascii=False))