# FinStream ETL (Python)

Python ETL pipeline that cleans source files, loads tables into Postgres, computes metrics, and writes forecast data.

## Requirements
- Python 3.10+
- pip

## Install Dependencies
```bash
cd /home/runner/work/FinStream/FinStream/etl-python
pip install -r requirements.txt
```

## Environment
Create `/home/runner/work/FinStream/FinStream/etl-python/.env` with:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
```

## Run Full Pipeline
```bash
python etl_pipeline.py
```

## Run ETL for Uploaded Source Type
Used by backend integration:
```bash
python etl_pipeline.py <filepath> <source_type>
```
Where `<source_type>` is one of:
- `invoices`
- `payroll`
- `opex`
