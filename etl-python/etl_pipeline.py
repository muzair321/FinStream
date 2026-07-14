import pandas as pd
import sqlite3
import os

print("🔄 Initializing FinStream ETL Pipeline Engine...")

desktop_path = os.path.dirname(os.path.abspath(__file__))
excel_file = os.path.join(desktop_path, 'departmental_opsex_2025.xlsx')
access_csv_backup = os.path.join(desktop_path, 'access_internal_payroll.csv')
output_db = os.path.join(desktop_path, 'finstream_analytics.db')

# Output paths for Power BI native connection
clean_opsex_output = os.path.join(desktop_path, 'clean_analytics_opsex.csv')
clean_payroll_output = os.path.join(desktop_path, 'clean_analytics_payroll.csv')

print("📥 Extracting data from corporate operational silos...")
df_opsex = pd.read_excel(excel_file, sheet_name='Marketing_&_Ops_OpsEx')
df_payroll = pd.read_csv(access_csv_backup)

print("🧼 Transforming and normalizing financial figures...")
df_opsex['actual_spent_usd'] = df_opsex['actual_spent_usd'].ffill()

exchange_rate_pkr_to_usd = 278
df_payroll['monthly_salary_usd'] = (df_payroll['monthly_salary_pkr'] / exchange_rate_pkr_to_usd).round(2)

print("📤 Loading clean analytical layers into SQL Database & CSVs...")
# Keep your database storage perfectly intact for the architecture
conn = sqlite3.connect(output_db)
df_opsex.to_sql('analytics_departmental_opsex', conn, if_exists='replace', index=False)
df_payroll.to_sql('analytics_internal_payroll', conn, if_exists='replace', index=False)
conn.close()

# Export clean CSV files for easy Power BI drag-and-drop ingestion
df_opsex.to_csv(clean_opsex_output, index=False)
df_payroll.to_csv(clean_payroll_output, index=False)

print("🚀 ETL Pipeline Completed Successfully! Clean reporting layers generated.")
