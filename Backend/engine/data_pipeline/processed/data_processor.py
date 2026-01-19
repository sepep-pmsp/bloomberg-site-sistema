import pandas as pd
import json
import os

def testar_engine():
    csv_emissao = '/app/data/raw/calculo-emissao-poluentes-diario_2026-01-01_silver.csv'
    csv_pos_cons = '/app/data/raw/df_posicoes_consolidado.csv'
    csv_km_real = '/app/data/raw/km_calculado.csv'
    output_dir = '/app/src/modules/api/content'

    try:
        print(f"📂 Lendo bases para consolidação final...")
        df_emissao = pd.read_csv(csv_emissao)
        df_pos = pd.read_csv(csv_pos_cons)
        df_km = pd.read_csv(csv_km_real)

        for df in [df_emissao, df_pos, df_km]:
            df.columns = df.columns.str.strip()
            if 'codigo_onibus' in df.columns:
                df['codigo_onibus'] = df['codigo_onibus'].astype(str).str.replace('.0', '', regex=False).str.strip()

        df_master = pd.merge(df_emissao, df_km, on='codigo_onibus', how='left')
        df_master = pd.merge(df_master, df_pos, on='codigo_onibus', how='left', suffixes=('_emi', '_pos'))
        tabela_json = []

        print(f"⚙️ Processando {len(df_master)} veículos com Validação de Conteúdo...")
        def get_value(row, keywords, invalid_val=None):
            for col in row.index:
                for key in keywords:
                    if key in col.lower():
                        val = row[col]
                        if pd.notna(val) and str(val).lower() not in ['nan', 'none', '', 'n/a']:
                            val_str = str(val).strip()
                            if invalid_val and val_str.replace('.0', '') == invalid_val:
                                continue  
                            return val_str
            return "N/A"

        for i, row in df_master.iterrows():
            onibus_id = str(row['codigo_onibus']).replace('.0', '')
            cod_lin = get_value(row, ['codigo_linha', 'cl', 'linha', 'codigo_onibus'], invalid_val=onibus_id)
            nom_lin = get_value(row, ['nome_linha', 'c', 'letreiro'], invalid_val=onibus_id)
            modelo  = get_value(row, ['modelo', 'tipo_veiculo', 'tecnologia'])
            fase = get_value(row, ['fase', 'fase_mobilidade', 'fase_conama'])
            km_val = row.get('dist_km') if pd.notna(row.get('dist_km')) else row.get('distancia_percorrida', 0)
            vel_val = get_value(row, ['velocidade_media'])
            if vel_val == "N/A": vel_val = 0

            tabela_json.append({
                "id": i + 1,
                "codigo_linha": str(cod_lin).replace('.0', ''),
                "nome_linha": str(nom_lin),
                "codigo_onibus": onibus_id,
                "modelo": str(modelo),
                "fase_conama": str(fase),
                "km_rodados": f"{float(km_val):.2f}",
                "velocidade_media": f"{float(vel_val):.2f}",
                "emissoes": {
                    "co2": f"{float(row.get('emissao_co2', 0)):.4f}",
                    "mp": f"{float(row.get('emissao_mp', 0)):.6f}",
                    "nox": f"{float(row.get('emissao_nox', 0)):.5f}"
                }
            })
        os.makedirs(output_dir, exist_ok=True)
        with open(f'{output_dir}/frota_tabela.json', 'w', encoding='utf-8') as f:
            json.dump(tabela_json, f, ensure_ascii=False, indent=4)

        print(f"✅ Sucesso! JSON gerado corrigindo IDs duplicados e buscando Modelos.")

    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    testar_engine()