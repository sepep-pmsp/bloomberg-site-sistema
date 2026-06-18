"""
@autor: Yuri Idalgo de Matos da Silva
criado em: 18/06/2026
atualizado em: 18/06/2026
descrição: Script para realizar a simulação de Monte Carlo
para emissões de poluentes em CO2, NOx e MP, considerando diferentes cenários de frota de ônibus.
"""

# Importações
import pandas as pd
import numpy as np
import json
import os


# Função para realizar a simulação de Monte Carlo
def simMonteCarlo(df_consume_tabele, Y, N = 2000, days):
    df_filtered = df_consume_tabele[df_consume_tabele['tecnologia'] != 'Elétrico'].copy()
    emissons_pool_co2 = df_filtered['emissao_co2(t)'].to_numpuy()
    # conferir se a unidade da coluna esta de acordo com as dimensões de emissões
    emissons_pool_nox = df_filtered['emissao_nox(t)'].to_numpy() 
    emissons_pool_mp = df_filtered['emissao_mp(t)'].to_numpy()

    shape = (N,days,Y)
    sim_emissons_co2 = np.random.choice(emissons_pool_co2, size = shape, replace = True)
    sim_emissons_nox = np.random.choice(emissons_pool_nox, size = shape, replace = True)
    sim_emissons_mp = np.random.choice(emissons_pool_mp, size = shape, replace = True)

    # 1. Calcular as emissões diárias para cada cenário
    daily_emissions_co2 = sim_emissons_co2.sum(axis=2)
    daily_emissions_nox = sim_emissons_nox.sum(axis=2)
    daily_emissions_mp = sim_emissons_mp.sum(axis=2)
    
    # 2. Soma o consumo dos dias para ter o total de cada ano
    year_cumulative_co2 = daily_emissions_co2.sum(axis=1)
    year_cumulative_nox = daily_emissions_nox.sum(axis=1)
    year_cumulative_mp = daily_emissions_mp.sum(axis=1)

    # 3. Estatísticas descritivas
    stats = {
        'co2': {
            'mean': np.mean(year_cumulative_co2),
            'p75': np.percentile(year_cumulative_co2, 75),
            'max': np.max(year_cumulative_co2)
        },
        'nox': {
            'mean': np.mean(year_cumulative_nox),
            'p75': np.percentile(year_cumulative_nox, 75),
            'max': np.max(year_cumulative_nox)
        },
        'mp': {
            'mean': np.mean(year_cumulative_mp),
            'p75': np.percentile(year_cumulative_mp, 75),
            'max': np.max(year_cumulative_mp)
        }
    }

    return stats 


Y = int(input("Digite o número de ônibus para a simulação: "))

# Validação do número de ônibus
while Y <= 0 or Y > 1000:
    print("O número de ônibus deve ser maior que zero e menor ou igual a 1000.")
    Y = int(input("Digite o número de ônibus para a simulação: "))

days = int(input("Digite o número de dias para a projeção: "))

# Validação do número de dias
while days <= 0 or days > 365:
    print("O número de dias deve ser maior que zero e menor ou igual a 365.")
    days = int(input("Digite o número de dias para a projeção: "))


path_df_consume_tabele = "path_to_your_csv_file.csv"  # Substitua pelo caminho real do seu arquivo CSV
output_dir = '/app/src/modules/api/content' # Substitua pelo caminho real do diretório onde deseja salvar os resultados

df_consume_tabele = pd.read_csv(path_df_consume_tabele)

simulation_results = simMonteCarlo(df_consume_tabele, Y, N=2000, days=days)

df_simulation_results = pd.DataFrame(simulation_results) # Teste de Salvamento em CSV, pode ser ajustado conforme a estrutura dos resultados retornados pela função simMonteCarlo
df_simulation_results.to_csv(os.path.join(output_dir, f'simulation_results_{Y}_onibus_{days}_dias.csv'), index=False)

# Salvando os resultados em um arquivo JSON
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

with open(os.path.join(output_dir, f'simulation_results_{Y}_onibus_{days}_dias.json'), 'w') as f:
    json.dump(simulation_results, f, ensure_ascii=False, indent=2)

print(f"Simulação concluída para {Y} ônibus e {days} dias. Resultados salvos em {output_dir}.")
