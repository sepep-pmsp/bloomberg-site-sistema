import pandas as pd
import json
import os
import ast

def gerar_mapas_geojson():
    path_posicoes = '/app/data/raw/df_posicoes_dagster.csv'
    path_trips = '/app/data/raw/df_trips.csv'
    output_dir = '/app/src/modules/api/content'
    
    os.makedirs(output_dir, exist_ok=True)
    
    print("🗺️ Iniciando motor Geoespacial...")

    # ==============================================================================
    # 1. GERAR MAPA DE PONTOS (Bolinhas dos Ônibus + Heatmap)
    # ==============================================================================
    try:
        print(f"📍 Processando Posições em Tempo Real (df_posicoes_dagster)...")
        if os.path.exists(path_posicoes):
            df_pos = pd.read_csv(path_posicoes)
            df_pos.columns = df_pos.columns.str.strip()

            features_pontos = []
            df_pos = df_pos.dropna(subset=['x', 'y'])

            for _, row in df_pos.iterrows():
                try:
                    tech = str(row.get('tecnologia', '')).lower()
                    is_eletrico = 'eletrico' in tech or 'elétrico' in tech

                    feature = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [float(row['x']), float(row['y'])]
                        },
                        "properties": {
                            "id": str(row.get('codigo_onibus', '')).replace('.0', ''),
                            "linha": str(row.get('codigo_linha', 'N/A')),
                            "letreiro": str(row.get('letreiro', 'N/A')),
                            "co2": float(row.get('emissao_co2', 0)),
                            "tipo": "eletrico" if is_eletrico else "diesel",
                            "modelo": str(row.get('modelo', 'Padron'))
                        }
                    }
                    features_pontos.append(feature)
                except ValueError:
                    continue

            with open(f'{output_dir}/frota_pontos.geojson', 'w', encoding='utf-8') as f:
                json.dump({"type": "FeatureCollection", "features": features_pontos}, f, ensure_ascii=False, indent=2)
            
            print(f"✅ Pontos gerados: {len(features_pontos)} veículos.")
        else:
            print(f"⚠️ Arquivo de posições não encontrado: {path_posicoes}")

    except Exception as e:
        print(f"❌ Erro ao gerar pontos: {e}")

    # ==============================================================================
    # 2. GERAR MAPA DE ROTAS (Linhas Coloridas - Elétrico vs Diesel)
    # ==============================================================================
    try:
        print(f"🛣️ Processando Trajetos das Linhas (df_trips)...")
        if os.path.exists(path_trips):
            df_trips = pd.read_csv(path_trips)
            df_trips.columns = df_trips.columns.str.strip()

            features_rotas = []

            for _, row in df_trips.iterrows():
                try:
                    coords_str = row.get('coordinates')
                    if pd.isna(coords_str): continue
                    coords_list = ast.literal_eval(coords_str)
                    is_eletrico = str(row.get('is_eletrico', '')).lower() in ['true', '1', 's', 'sim']

                    feature = {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": coords_list
                        },
                        "properties": {
                            "linha": str(row.get('linha', 'N/A')),
                            "is_eletrico": is_eletrico,
                            "emissao_total": float(row.get('emissao_co2', 0)),
                            "stroke": "#00FF00" if is_eletrico else "#808080"
                        }
                    }
                    features_rotas.append(feature)
                except Exception as ex:
                    continue

            with open(f'{output_dir}/frota_rotas.geojson', 'w', encoding='utf-8') as f:
                json.dump({"type": "FeatureCollection", "features": features_rotas}, f, ensure_ascii=False, indent=2)

            print(f"✅ Rotas geradas: {len(features_rotas)} trajetos.")
        else:
            print(f"⚠️ Arquivo de trips não encontrado: {path_trips}")

    except Exception as e:
        print(f"❌ Erro ao gerar rotas: {e}")

if __name__ == "__main__":
    gerar_mapas_geojson()