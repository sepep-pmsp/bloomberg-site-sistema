"""
@autor: Yuri Idalgo de Matos da Silva
criado em: 18/06/2026
atualizado em: 19/06/2026
descrição: Script para realizar a simulação de Monte Carlo
para emissões de poluentes em CO2, NOx e MP, considerando diferentes cenários de frota de ônibus.
"""

# Importações
import pandas as pd
import numpy as np
import json
import os
import matplotlib.pyplot as plt


# Realizando limpeza dos dados com os dados de teste, pode ser ajustado conforme a estrutura do seu CSV

# Retirando os outliers.
# Visualização
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

# Plot da Distribuição

def k_sturge(n):
    return 1 + np.log2(n)

def plot_hist(name_sample, data_frame, colInt : str, teste=False, plot_simetria=True):
    lista_dados = np.array(data_frame[colInt].to_list())
    n_total = len(lista_dados)
    k = int(k_sturge(n_total))

    # --- Lógica do Histograma ---
    amplitude = max(lista_dados) - min(lista_dados)
    bin_width = amplitude / k
    lista_ordenada = np.sort(lista_dados)

    tabela = []
    valor_min = min(lista_dados)

    for i in range(k):
        valor_max = valor_min + bin_width
        if i == k - 1:
            cont = np.sum((lista_ordenada >= valor_min) & (lista_ordenada <= valor_max))
        else:
            cont = np.sum((lista_ordenada >= valor_min) & (lista_ordenada < valor_max))

        freq_i = cont / n_total
        dens_i = freq_i / bin_width
        tabela.append([f"[{valor_min:.2f},{valor_max:.2f})", cont, freq_i, dens_i])
        valor_min = valor_max

    # --- Lógica de Simetria (Tratando Par/Ímpar) ---
    mediana = np.median(lista_ordenada)
    # Se n é ímpar, removemos a mediana exata para parear os lados
    # Se n é par, dividimos o array exatamente ao meio
    m = n_total // 2

    # u_i: distâncias da mediana para os menores valores (em ordem crescente de distância)
    # v_i: distâncias dos maiores valores para a mediana (em ordem crescente de distância)
    abaixo_mediana = lista_ordenada[:m]
    acima_mediana = lista_ordenada[-m:]

    u_i = mediana - abaixo_mediana[::-1] # Inverte para ter a menor distância primeiro
    v_i = acima_mediana - mediana

    # --- Plotagem do Histograma ---
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6)) if plot_simetria else (plt.figure(figsize=(10,6)), plt.gca())

    intervalos = [linha[0] for linha in tabela]
    densidades = [linha[3] for linha in tabela]
    contagens = [linha[1] for linha in tabela]

    bars = ax1.bar(intervalos, densidades, width=1.0, edgecolor='black', color='skyblue')
    ax1.set_title('Histograma de Densidade')
    ax1.set_xlabel('Intervalos de Classes')
    ax1.set_ylabel('Densidade')
    ax1.tick_params(axis='x', rotation=45)

    for bar, oc in zip(bars, contagens):
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height(), int(oc),
                 ha='center', va='bottom', fontweight='bold', color='navy')

    # --- Plotagem da Simetria ---
    if plot_simetria:
        ax2.scatter(u_i, v_i, color='blue', edgecolor='black', marker = ".", alpha=0.7)
        lims = [0, max(ax2.get_xlim()[1], ax2.get_ylim()[1])]
        ax2.plot(lims, lims, 'r--', label="Simetria Perfeita")
        ax2.set_title(f"Gráfico de Simetria (n={n_total})")
        ax2.set_xlabel("Distância à Esquerda (Mediana - $x_{(i)}$)")
        ax2.set_ylabel("Distância à Direita ($x_{(n-i+1)}$ - Mediana)")
        ax2.legend()
        ax2.grid(True, linestyle=':', alpha=0.6)
        ax2.ticklabel_format(style='sci', axis='both', scilimits=(0,0))


    plt.suptitle(f"{name_sample}")
    plt.tight_layout()
    plt.savefig(f"{name_sample}.png")
    plt.show()

    if teste:
        print(f"Mediana: {mediana}")
        print(f"Tamanho dos vetores de simetria: {len(u_i)}")


# Função para realizar a simulação de Monte Carlo
def simMonteCarlo(df_consume_tabele, Y, N = 2000, days = 365):
    df_filtered = df_consume_tabele[df_consume_tabele['tecnologia'] != 'Elétrico'].copy()
    try:
        emissons_pool_co2 = df_filtered['emissao_co2(t)'].to_numpy()
        # conferir se a unidade da coluna esta de acordo com as dimensões de emissões
        emissons_pool_nox = df_filtered['emissao_nox(t)'].to_numpy()
        emissons_pool_mp = df_filtered['emissao_mp(t)'].to_numpy()
    except KeyError as e:
        print(f"Erro: Coluna {e} não encontrada no DataFrame.")
        return None

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
            'mean(t)': np.mean(year_cumulative_co2).round(3),
            'p75 (t)': np.percentile(year_cumulative_co2, 75).round(3),
            'max (t)': np.max(year_cumulative_co2).round(3)
        },
        'nox': {
            'mean(t)': np.mean(year_cumulative_nox).round(3),
            'p75 (t)': np.percentile(year_cumulative_nox, 75).round(3),
            'max (t)': np.max(year_cumulative_nox).round(3)
        },
        'mp': {
            'mean(t)': np.mean(year_cumulative_mp).round(3),
            'p75 (t)': np.percentile(year_cumulative_mp, 75).round(3),
            'max (t)': np.max(year_cumulative_mp).round(3)
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


#path_df_consume_tabele = "path_to_your_csv_file.csv"  # Substitua pelo caminho real do seu arquivo CSV
#output_dir = '/app/src/modules/api/content' # Substitua pelo caminho real do diretório onde deseja salvar os resultados

path_df_consume_tabele_test = r"C:\Users\x432601\Downloads\SIMULACAO_MONTE_CARLO\data_testes\data\calculo-emissao-poluentes-diario_2026-01-01_silver_corrigido.csv"
output_dir = r"C:\Users\x432601\Downloads\SIMULACAO_MONTE_CARLO\data_testes\output"

df_consume_table = pd.read_csv(path_df_consume_tabele_test, sep = ",")
df_consume_table['distancia_percorrida'] = df_consume_table['distancia_percorrida']/1000 # Convertendo de metros para quilômetros, ajuste conforme a unidade original da coluna
df_consume_table = df_consume_table[df_consume_table['distancia_percorrida'] >= 15] # Filtrando para considerar apenas os ônibus que percorreram mais de 15 km, ajuste conforme a necessidade do seu cenário
df_consume_table = remove_outliers_mad(df_consume_table, 'emissao_co2(t)')
df_consume_table = remove_outliers_mad(df_consume_table, 'emissao_nox(t)')
df_consume_table = remove_outliers_mad(df_consume_table, 'emissao_mp(t)')

plot_hist("Emissões de CO2 (t) - Dados Filtrados", df_consume_table, 'emissao_co2(t)', teste=True, plot_simetria=True) # Conferindo a distribuição dos dados filtrados, pode ser ajustado para as outras colunas de emissão conforme necessário
plot_hist("Emissões de NOx (t) - Dados Filtrados", df_consume_table, 'emissao_nox(t)', teste=True, plot_simetria=True)
plot_hist("Emissões de MP (t) - Dados Filtrados", df_consume_table, 'emissao_mp(t)', teste=True, plot_simetria=True)

simulation_results = simMonteCarlo(df_consume_table, Y, N=2000, days=days)

df_simulation_results = pd.DataFrame(simulation_results) # Teste de Salvamento em CSV, pode ser ajustado conforme a estrutura dos resultados retornados pela função simMonteCarlo
df_simulation_results.to_csv(os.path.join(output_dir, f'simulation_results_{Y}_onibus_{days}_dias.csv'), index=False)

# Salvando os resultados em um arquivo JSON
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

with open(os.path.join(output_dir, f'simulation_results_{Y}_onibus_{days}_dias.json'), 'w') as f:
    json.dump(simulation_results, f, ensure_ascii=False, indent=2)

print(f"Simulação concluída para {Y} ônibus e {days} dias. Resultados salvos em {output_dir}.")
# Para exibir os resultados formatados na tela:
print("\n--- RESULTADOS DA SIMULAÇÃO ---")
print(json.dumps(simulation_results, indent=4, ensure_ascii=False))