import pandas as pd

df = pd.read_excel('/Users/douglas/Desktop/inteligencia-mercado-imob/public/pptrodrigo/Incentivo Marqueting R$ 100.000,00.xlsx')
# the dataframe has some merged headers
# let's just print the raw first few rows and all columns
for col in df.columns:
    print(col)
print("----------")
print(df.head(10))

