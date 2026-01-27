import pandas as pd
import glob
import os

def processar_inteligencia_silver():
    silver_path = '/app/data/silver'
    output_km = '/app/data/raw/km_calculado.csv'
    output_base = '/app/data/raw/df_posicoes_consolidado.csv'

    print("🧠 Iniciando Processamento Massivo da Camada Silver...")

    files_dist = glob.glob(os.path.join(silver_path, "calculo-distancia-percorrida_*_silver.csv"))
    files_geo = glob.glob(os.path.join(silver_path, "corrigido_geometry_*_silver.csv"))

    if not files_dist:
        print(f"❌ Nenhum arquivo encontrado.")
        return

    def read_csv_clean(path, usecols=None):
        df = pd.read_csv(path, usecols=usecols)
        df.columns = df.columns.str.strip()
        return df
    df_dist_total = pd.concat([read_csv_clean(f) for f in files_dist], ignore_index=True)
    df_geo_total = pd.concat([read_csv_clean(f) for f in files_geo], ignore_index=True)
    dist_col = 'distancia_percorrida'
    time_col = 'segundos_deslocamento'
    df_dist_total[dist_col] = pd.to_numeric(df_dist_total[dist_col], errors='coerce').fillna(0)
    df_dist_total[time_col] = pd.to_numeric(df_dist_total[time_col], errors='coerce').fillna(0)
    df_dist_total['codigo_onibus'] = df_dist_total['codigo_onibus'].astype(str).str.strip()
    df_geo_total['codigo_onibus'] = df_geo_total['codigo_onibus'].astype(str).str.strip()

    print("⚙️ Cruzando dados e calculando performance...")
    df_geo_last = df_geo_total.drop_duplicates(subset='codigo_onibus', keep='last')
    df_merged = pd.merge(df_dist_total, df_geo_last, on='codigo_onibus', how='left')

    km_final = df_merged.groupby('codigo_onibus').agg({
        dist_col: 'sum',
        time_col: 'sum'
    }).reset_index()

    print("📏 Calculando velocidade média...")
    km_final['velocidade_media'] = 0.0
    mask = km_final[time_col] > 0
    km_final.loc[mask, 'velocidade_media'] = (km_final.loc[mask, dist_col] / km_final.loc[mask, time_col]) * 3.6
    km_final['dist_km'] = km_final[dist_col] / 1000
    os.makedirs(os.path.dirname(output_km), exist_ok=True)
    km_final.to_csv(output_km, index=False)
    df_merged.to_csv(output_base, index=False)

    print(f"✨ Concluído! {len(km_final)} veículos processados.")

if __name__ == "__main__":
    processar_inteligencia_silver()