import pandas as pd

try:
    df_vendas = pd.read_excel('/Users/douglas/Desktop/inteligencia-mercado-imob/public/pptrodrigo/Vendas 2026 app (1) (2).xlsx')
    
    df_maio = df_vendas[df_vendas['Mês'].astype(str).str.contains('maio|May|5', case=False, na=False)]

    print("\nEmpreendimentos in Vendas (maio):")
    print(df_maio['Empreendimento'].value_counts())
        
except Exception as e:
    print("Error:", e)
