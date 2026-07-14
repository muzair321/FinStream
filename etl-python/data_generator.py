import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Set seed for realistic, matching data numbers
np.random.seed(42)
records_count = 5000  

print("⏳ Generating company-size enterprise datasets... Please wait.")

# 1. GENERATE ACCESS LEGACY ERP DATA (PAYROLL)
departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Executive']
payroll_data = {
    'employee_id': range(1001, 1151),  # 150 employees
    'department': np.random.choice(departments, 150, p=[0.4, 0.2, 0.2, 0.1, 0.1]),
    'monthly_salary_pkr': np.random.randint(90000, 450000, 150) # Realistic salaries in PKR
}
df_payroll = pd.DataFrame(payroll_data)
# Save as CSV - you can import this directly into MS Access in 2 clicks!
df_payroll.to_csv('access_internal_payroll.csv', index=False)


# 2. GENERATE MESSY DEPARTMENTAL EXCEL TRACKER (OPSEX)
start_date = datetime(2025, 1, 1)
date_list = [start_date + timedelta(days=x) for x in range(365)]
expense_categories = ['AWS Cloud Hosting', 'Marketing Ads', 'Software Licenses', 'Office Rent', 'Travel Expenses']

excel_rows = []
for date in date_list:
    for cat in expense_categories:
        budget = random.randint(2000, 15000)
        # Introduce a 5% chance of missing data (NaN) to give your Python ETL something to clean!
        actual = budget * random.uniform(0.85, 1.35) if random.random() > 0.05 else np.nan
        excel_rows.append([date.strftime('%Y-%m-%d'), cat, budget, actual])

df_excel = pd.DataFrame(excel_rows, columns=['expense_date', 'expense_category', 'allocated_budget_usd', 'actual_spent_usd'])
df_excel.to_excel('departmental_opsex_2025.xlsx', sheet_name='Marketing_&_Ops_OpsEx', index=False)


# 3. GENERATE STRIPE BILLING TRANSACTION DATA (FOR UZAIR'S SQL DATABASE)
invoice_plans = ['Basic', 'Professional', 'Enterprise']
invoice_status = ['Paid', 'Paid', 'Paid', 'Failed', 'Refunded'] 

stripe_rows = []
for i in range(1, records_count + 1):
    inv_date = start_date + timedelta(days=random.randint(0, 364))
    plan = np.random.choice(invoice_plans, p=[0.5, 0.3, 0.2])
    amount = 49.00 if plan == 'Basic' else (199.00 if plan == 'Professional' else 999.00)
    
    stripe_rows.append({
        'invoice_id': f'INV-STRIPE-{100000 + i}',
        'customer_id': f'CUST-{random.randint(5000, 9999)}',
        'amount_usd': amount,
        'status': np.random.choice(invoice_status),
        'created_at': inv_date.strftime('%Y-%m-%d %H:%M:%S'),
        'subscription_plan': plan
    })

df_stripe = pd.DataFrame(stripe_rows)
df_stripe.to_csv('stripe_invoices_staging.csv', index=False)

print("🚀 Success! Generated 3 corporate data layers:")
print("  1. 'access_internal_payroll.csv' -> Import this into MS Access.")
print("  2. 'departmental_opsex_2025.xlsx' -> Your messy Excel budget tracker.")
print("  3. 'stripe_invoices_staging.csv' -> For Uzair to load into the SQL DB.")
