"""
FinStream ETL Pipeline
----------------------
Reads the 3 mock data sources (Stripe invoices, Access payroll, Excel opex),
cleans/normalizes them, writes clean tables into Postgres (Neon), and computes
the core financial metrics (MRR, burn rate, runway, budget variance %).

Run with:  python etl_pipeline.py
Requires a .env file next to this script with:
    DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
"""

import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from datetime import datetime
from sqlalchemy.dialects.postgresql import insert

# ---------------------------------------------------------------------------
# 0. SETUP — load DB connection string from .env, never hardcode it
# ---------------------------------------------------------------------------
load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Create a .env file next to this script with:\n"
        "DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require"
    )

engine = create_engine(DATABASE_URL)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

EXCHANGE_RATE_PKR_TO_USD = 278  # static rate; swap for a live FX API call later if you want


# ---------------------------------------------------------------------------
# 1. EXTRACT + TRANSFORM — one function per source type
# ---------------------------------------------------------------------------

def process_invoices(filepath: str) -> pd.DataFrame:
    """Reads Stripe-style invoice CSV, does light cleanup, returns a clean DataFrame."""
    df = pd.read_csv(filepath)

    # Basic sanity cleanup: strip whitespace, drop exact duplicate invoice_ids
    df["invoice_id"] = df["invoice_id"].str.strip()
    df = df.drop_duplicates(subset="invoice_id")

    # Make sure created_at is a real datetime, not just a string
    df["created_at"] = pd.to_datetime(df["created_at"])

    return df


def process_payroll(filepath: str) -> pd.DataFrame:
    """Reads payroll CSV, converts PKR -> USD, returns a clean DataFrame."""
    df = pd.read_csv(filepath)
    df["monthly_salary_usd"] = (df["monthly_salary_pkr"] / EXCHANGE_RATE_PKR_TO_USD).round(2)
    return df


def process_opex(filepath: str) -> pd.DataFrame:
    """Reads the messy Excel opex tracker, forward-fills missing spend values."""
    df = pd.read_excel(filepath, sheet_name="Marketing_&_Ops_OpsEx")

    missing_before = df["actual_spent_usd"].isna().sum()
    df["actual_spent_usd"] = df["actual_spent_usd"].ffill()


    df["expense_date"] = pd.to_datetime(df["expense_date"]).dt.date
    return df


# ---------------------------------------------------------------------------
# 2. LOAD — write each clean DataFrame into its Postgres table safely
# ---------------------------------------------------------------------------

def upsert_invoices(df: pd.DataFrame):
    """Inserts invoices, updating records if the invoice_id already exists (Upsert)."""
    # Convert dataframe to a list of dictionaries for SQLAlchemy core execution
    records = df.to_dict(orient="records")
    if not records:
        return

    # Use Postgres-specific dialect features via SQLAlchemy
    with engine.begin() as conn:
        metadata = pd.io.sql.SQLDatabase(engine).meta
        metadata.reflect(bind=engine, only=['invoices'])
        invoices_table = metadata.tables['invoices']
        
        # Create an ON CONFLICT Statement
        stmt = insert(invoices_table).values(records)
        upsert_stmt = stmt.on_conflict_do_update(
            index_elements=['invoice_id'],
            set_={c.name: c for c in stmt.excluded if c.name != 'invoice_id'}
        )
        conn.execute(upsert_stmt)
    print("✅ Invoices upserted successfully (no duplicates created).")

def load_opex_with_scoped_delete(df: pd.DataFrame):
    """Deletes matching year/month/departments before appending new rows."""
    if df.empty:
        return

    # Find the unique combinations of Year, Month, and Department in the incoming file
    df_temp = df.copy()
    df_temp['expense_date'] = pd.to_datetime(df_temp['expense_date'])
    df_temp['year'] = df_temp['expense_date'].dt.year
    df_temp['month'] = df_temp['expense_date'].dt.month
    
    # We look at the unique combinations to clear out old matching records
    scopes = df_temp[['year', 'month', 'expense_category']].drop_duplicates().values

    with engine.begin() as conn:
        for year, month, dept in scopes:
            # Targeted wipe query
            delete_query = text("""
                DELETE FROM departmental_opex 
                WHERE EXTRACT(YEAR FROM expense_date) = :year 
                  AND EXTRACT(MONTH FROM expense_date) = :month
                  AND expense_category = :dept
            """)
            conn.execute(delete_query, {"year": int(year), "month": int(month), "dept": dept})
            print(f"🧹 Cleared existing data for: {dept} ({month}/{year})")
        
        # Append the new records safely now that the scope is clean
        df.to_sql('departmental_opex', conn, if_exists='append', index=False)
    print("✅ New OpEx data appended successfully.")

def load_table(df: pd.DataFrame, table_name: str):
    """Executes the wipe and insert atomically inside a single transaction."""
    # Using engine.begin() forces a BEGIN TRANSACTION and a COMMIT at the end
    with engine.begin() as conn:
        # 1. Clear the old data
        conn.execute(text(f"TRUNCATE TABLE {table_name} RESTART IDENTITY CASCADE;"))
        
        # 2. Insert the new data using the same connection context
        df.to_sql(table_name, conn, if_exists="append", index=False)
# ---------------------------------------------------------------------------
# 3. COMPUTE METRICS — the actual "financial analytics" part
# ---------------------------------------------------------------------------

def compute_metrics(df_invoices: pd.DataFrame, df_payroll: pd.DataFrame, df_opex: pd.DataFrame) -> dict:
    """
    Computes the 4 headline metrics your Dashboard's KPI cards need:
    MRR, burn rate, runway (months), budget variance %.
    """

    # --- MRR: sum of amounts from Paid invoices in the most recent month present ---
    paid = df_invoices[df_invoices["status"] == "Paid"].copy()
    paid["month"] = paid["created_at"].dt.to_period("M")
    latest_month = paid["month"].max()
    mrr = paid[paid["month"] == latest_month]["amount_usd"].sum()

    # --- Burn rate: total monthly cost = payroll + actual opex spend (same latest month) ---
    total_payroll_usd = df_payroll["monthly_salary_usd"].sum()

    df_opex_copy = df_opex.copy()
    df_opex_copy["expense_date"] = pd.to_datetime(df_opex_copy["expense_date"])
    df_opex_copy["month"] = df_opex_copy["expense_date"].dt.to_period("M")
    latest_opex_month = df_opex_copy["month"].max()
    total_opex_latest_month = df_opex_copy[df_opex_copy["month"] == latest_opex_month]["actual_spent_usd"].sum()

    burn_rate = total_payroll_usd + total_opex_latest_month

    # --- Runway: how many months until cash runs out ---
    # NOTE: we don't have a real "cash in bank" figure anywhere in the mock data.
    # Using a placeholder assumed cash balance until a real one is wired in —
    # replace ASSUMED_CASH_BALANCE with a real number (or a new table) later.
    ASSUMED_CASH_BALANCE = 500_000
    net_burn = burn_rate - mrr
    runway_months = (ASSUMED_CASH_BALANCE / net_burn) if net_burn > 0 else float("inf")

    # --- Budget variance %: (actual - allocated) / allocated, across all opex rows ---
    total_allocated = df_opex["allocated_budget_usd"].sum()
    total_actual = df_opex["actual_spent_usd"].sum()
    budget_variance_pct = ((total_actual - total_allocated) / total_allocated) * 100

    return {
        "mrr": round(float(mrr), 2),
        "burn_rate": round(float(burn_rate), 2),
        "runway_months": round(float(runway_months), 2) if runway_months != float("inf") else None,
        "budget_variance_pct": round(float(budget_variance_pct), 2),
    }


def save_snapshot(metrics: dict):
    """Inserts one row into financial_snapshot with the metrics just computed."""
    with engine.begin() as conn:
        conn.execute(
            text("""
                INSERT INTO financial_snapshot (mrr, burn_rate, runway_months, budget_variance_pct, computed_at)
                VALUES (:mrr, :burn_rate, :runway_months, :budget_variance_pct, :computed_at)
            """),
            {**metrics, "computed_at": datetime.now()},
        )


# ---------------------------------------------------------------------------
# 4. MAIN — run the whole pipeline end to end
# ---------------------------------------------------------------------------
import sys

def run_pipeline():
    # 1. Fallback defaults if executed manually (for testing)
    invoice_path = os.path.join(BASE_DIR, "stripe_invoices_staging.csv")
    payroll_path = os.path.join(BASE_DIR, "access_internal_payroll.csv")
    opex_path = os.path.join(BASE_DIR, "departmental_opsex_2025.xlsx")

    # 2. Accept arguments passed from Spring Boot (if available)
    # Expected format from Java: python etl_pipeline.py <filepath> <source_type>
    if len(sys.argv) > 2:
        uploaded_filepath = sys.argv[1]
        source_type = sys.argv[2]
        
        if source_type == "invoices":
            df_invoices = process_invoices(uploaded_filepath)
            upsert_invoices(df_invoices)
            
        elif source_type == "payroll":
            # Payroll can use your safe absolute replace/append strategy 
            df_payroll = process_payroll(uploaded_filepath)
            with engine.begin() as conn:
                conn.execute(text("TRUNCATE TABLE payroll RESTART IDENTITY CASCADE;"))
            df_payroll.to_sql('payroll', engine, if_exists='append', index=False)
            
        elif source_type == "opex":
            df_opex = process_opex(uploaded_filepath)
            load_opex_with_scoped_delete(df_opex)

    # 3. Standard Processing Block
    df_invoices = process_invoices(invoice_path)
    load_table(df_invoices, "invoices")

    df_payroll = process_payroll(payroll_path)
    load_table(df_payroll, "payroll")

    df_opex = process_opex(opex_path)
    load_table(df_opex, "departmental_opex")

    # 4. Aggregate & Snapshot metrics
    metrics = compute_metrics(df_invoices, df_payroll, df_opex)
    save_snapshot(metrics)
    print("🚀 ETL Pipeline Completed Successfully! Clean reporting layers generated.")


if __name__ == "__main__":
    try:
        run_pipeline()
    except Exception as e:
        print(f"CRITICAL PIPELINE ERROR: {str(e)}", file=sys.stderr)
        sys.exit(1) # Exits with error code 1 so Spring Boot detects the failure cleanly
