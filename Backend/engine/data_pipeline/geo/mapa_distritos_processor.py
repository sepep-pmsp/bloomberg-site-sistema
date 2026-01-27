import pandas as pd
import geopandas as gpd
import json
import os

def processar_mapa_distritos():
    path_shp = '/app/data/distritos/distritos_final.shp'
    path_posicoes = '/app/data/raw/df_posicoes_dagster.csv'
    path_silver = '/app/data/raw/calculo-emissao-poluentes-diario_2026-01-01_silver.csv'
    output_dir = '/app/src/modules/api/content'

    print("--- 🌍 Iniciando Cruzamento Geográfico (Spatial Join) ---")

    try:
        distritos = gpd.read_file(path_shp)
        df_pos = pd.read_csv(path_posicoes)
        df_silver = pd.read_csv(path_silver)
        df_pos_clean = df_pos[['codigo_onibus', 'x', 'y']].drop_duplicates(subset='codigo_onibus')
        df_pos_clean['codigo_onibus'] = df_pos_clean['codigo_onibus'].astype(str)
        df_silver['codigo_onibus'] = df_silver['codigo_onibus'].astype(str)

        print("🔗 Unindo coordenadas do GPS com dados de emissão...")
        df_completo = pd.merge(df_pos_clean, df_silver, on='codigo_onibus', how='inner')
        gdf_onibus = gpd.GeoDataFrame(
            df_completo, 
            geometry=gpd.points_from_xy(df_completo.x, df_completo.y),
            crs="EPSG:4326"
        )

        if distritos.crs != "EPSG:4326":
            distritos = distritos.to_crs(epsg=4326)
        print("⚙️ Fazendo o Spatial Join (Pontos -> Distritos)...")
        sj = gpd.sjoin(gdf_onibus, distritos, predicate='within')

        print("📊 Agregando totais por distrito...")
        mapa_stats = sj.groupby('nm_distrit').agg({
            'emissao_co2': 'sum',
            'emissao_mp': 'sum',
            'emissao_nox': 'sum',
            'distancia_percorrida': 'sum'
        }).reset_index()

        resultado_mapa = {}
        for _, row in mapa_stats.iterrows():
            nome = str(row['nm_distrit'])
            resultado_mapa[nome] = {
                "co2": round(row['emissao_co2'], 4),
                "mp": round(row['emissao_mp'], 6),
                "nox": round(row['emissao_nox'], 5),
                "km_total": round(row['distancia_percorrida'], 2)
            }

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        with open(f'{output_dir}/mapas_distritos.json', 'w', encoding='utf-8') as f:
            json.dump(resultado_mapa, f, ensure_ascii=False, indent=4)

        print(f"✅ Sucesso: {len(resultado_mapa)} distritos processados!")

    except Exception as e:
        print(f"❌ Erro no processamento do mapa: {e}")


if __name__ == "__main__":
    processar_mapa_distritos()