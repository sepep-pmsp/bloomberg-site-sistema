import pandas as pd
import json
import glob
import os
from math import radians, cos, sin, asin, sqrt

def haversine(lon1, lat1, lon2, lat2):
    """Calcula a distância em km entre dois pontos GPS"""
    if pd.isna([lon1, lat1, lon2, lat2]).any(): return 0
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon, dlat = lon2 - lon1, lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    return 6371 * 2 * asin(sqrt(a))

def processar_telemetria_completa():
    input_path = '/app/data/raw/posicoes_json/*.json'
    output_csv = '/app/data/raw/df_posicoes_consolidado.csv'
    output_km = '/app/data/raw/km_calculado.csv'
    
    arquivos = sorted(glob.glob(input_path))
    print(f"🚀 Lendo {len(arquivos)} arquivos de telemetria...")

    dados_lista = []
    for arquivo in arquivos:
        with open(arquivo, 'r', encoding='utf-8') as f:
            content = json.load(f)
            hr = content.get('hr')
            for linha in content.get('l', []):
                for v in linha.get('vs', []):
                    dados_lista.append({
                        'codigo_onibus': str(v.get('p')),
                        'codigo_linha': linha.get('cl'),
                        'nome_linha': linha.get('c'),
                        'timestamp': v.get('ta'),
                        'lon': v.get('px'),
                        'lat': v.get('py')
                    })
    df = pd.DataFrame(dados_lista)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values(['codigo_onibus', 'timestamp'])
    df.to_csv(output_csv, index=False, encoding='utf-8')
    print(f"✅ CSV consolidado salvo com {len(df)} linhas.")

    print("📏 Calculando quilometragem real por veículo...")
    df['lon_next'] = df.groupby('codigo_onibus')['lon'].shift(-1)
    df['lat_next'] = df.groupby('codigo_onibus')['lat'].shift(-1)
    df['dist_km'] = df.apply(lambda r: haversine(r['lon'], r['lat'], r['lon_next'], r['lat_next']), axis=1)
    km_final = df.groupby('codigo_onibus')['dist_km'].sum().reset_index()
    km_final.to_csv(output_km, index=False, encoding='utf-8')
    print(f"✅ Resumo de KM finalizado para {len(km_final)} ônibus.")

if __name__ == "__main__":
    processar_telemetria_completa()