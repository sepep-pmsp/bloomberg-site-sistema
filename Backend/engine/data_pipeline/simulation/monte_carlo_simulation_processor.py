import pandas as pd
import numpy as np
import json
import os
from scipy.stats import gaussian_kde

def processar_monte_carlo_completo():
    path_silver = '/app/data/raw/calculo-emissao-poluentes-diario_2026-01-01_silver.csv'
    output_dir = '/app/src/modules/api/content'
    
    print("--- 🎲 Iniciando Varredura de Monte Carlo (Múltiplos Cenários) ---")
    
    if not os.path.exists(path_silver):
        print(f"❌ Erro: Arquivo {path_silver} não encontrado.")
        return

    df_silver = pd.read_csv(path_silver)
    df_diesel = df_silver[df_silver['tecnologia'] != 'Elétrico'].copy()
    
    N_ITERACÕES = 2000
    DIAS_PROJECAO = 365
    inicio = 5
    fim = 10000
    passo = 50
    limite_frota = min(len(df_diesel), 10000)
    cenarios_frota = [inicio] + list(range(passo, fim + 1, passo))
    
    poluentes = {
        "emissao_co2": "CO2",
        "emissao_nox": "NOx",
        "emissao_mp": "MP"
    }

    resultado_estatico = {
        "metadata": {
            "total_diesel_disponivel": len(df_diesel),
            "iteracoes_por_cenario": N_ITERACÕES,
            "poluentes_simulados": list(poluentes.values())
        },
        "cenarios": {}
    }

    for Y in cenarios_frota:
        print(f"🔄 Calculando cenário: {Y} ônibus...")
        
        resumo_cenario = {
            "n_onibus": Y,
            "poluentes": {}
        }
        indices = np.random.choice(df_diesel.index, size=(N_ITERACÕES, Y), replace=True)
        
        for col_p, nome_p in poluentes.items():
            amostras = df_diesel.loc[indices.flatten(), col_p].values.reshape(N_ITERACÕES, Y)
            resultados_diarios = amostras.sum(axis=1) / 1000 
            media_dia = np.mean(resultados_diarios)
            p75_dia = np.percentile(resultados_diarios, 75)
            max_dia = np.max(resultados_diarios)
            
            kde = gaussian_kde(resultados_diarios)
            x_plot = np.linspace(resultados_diarios.min(), resultados_diarios.max(), 50)
            y_plot = kde(x_plot)

            resumo_cenario["poluentes"][nome_p] = {
                "media_diaria": round(float(media_dia), 5),
                "p75_diaria": round(float(p75_dia), 5),
                "max_diaria": round(float(max_dia), 5),
                "acumulado_anual": round(float(media_dia * DIAS_PROJECAO), 2),
                "distribuicao": {
                    "x": x_plot.tolist(),
                    "y": y_plot.tolist()
                }
            }
        
        resultado_estatico["cenarios"][str(Y)] = resumo_cenario

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    with open(f'{output_dir}/simulacao_monte_carlo.json', 'w', encoding='utf-8') as f:
        json.dump(resultado_estatico, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Sucesso: simulacao_monte_carlo.json gerado com {len(cenarios_frota)} cenários.")

if __name__ == "__main__":
    processar_monte_carlo_completo()