import pandas as pd

df = pd.read_excel('/Users/douglas/Desktop/inteligencia-mercado-imob/public/pptrodrigo/Incentivo Marqueting R$ 100.000,00.xlsx', skiprows=1)
# Column 1 is GPI, Column 2 is Imob, Column 3 is Valor R$
df.columns = ['GPI', 'Imob', 'Valor']
df = df.dropna(subset=['Imob', 'Valor'])
imob_sums = df.groupby('Imob')['Valor'].sum().reset_index()
imob_sums = imob_sums.sort_values(by='Valor', ascending=False)
for index, row in imob_sums.iterrows():
    print(f"{row['Imob']}: {row['Valor']}")

