import pandas as pd

vendas_file = '/Users/douglas/Desktop/inteligencia-mercado-imob/public/pptrodrigo/Vendas 2026 app (1) (2).xlsx'
df_vendas = pd.read_excel(vendas_file)

print("Months available in Vendas:", df_vendas['Mês'].unique() if 'Mês' in df_vendas.columns else "No 'Mês' column")

# Let's find "março" and "maio"
df_mar = df_vendas[df_vendas['Mês'].astype(str).str.contains('mar|Mar|03', na=False, case=False)] if 'Mês' in df_vendas.columns else pd.DataFrame()
df_mai = df_vendas[df_vendas['Mês'].astype(str).str.contains('mai|Mai|05', na=False, case=False)] if 'Mês' in df_vendas.columns else pd.DataFrame()

print(f"\nMarch Sales Count: {len(df_mar)}")
if len(df_mar) > 0:
    print("March VGV:", pd.to_numeric(df_mar['VGV Contrato'], errors='coerce').sum())
    print("March Products:")
    print(df_mar['Empreendimento'].value_counts())

print(f"\nMay Sales Count: {len(df_mai)}")
if len(df_mai) > 0:
    print("May VGV:", pd.to_numeric(df_mai['VGV Contrato'], errors='coerce').sum())
    print("May Products:")
    print(df_mai['Empreendimento'].value_counts())

# Total VGV alcançado
vgv_total = pd.to_numeric(df_vendas['VGV Contrato'], errors='coerce').sum()
print("\nTotal VGV Alcançado (Semester):", vgv_total)

