# FinStream

FinStream is a financial operations platform with three core parts:
- **Frontend**: React + Vite dashboard UI
- **Backend**: Java Spring Boot API and ETL trigger service
- **ETL**: Python pipeline for ingesting and transforming finance data

## Repository Structure
- `/home/runner/work/FinStream/FinStream/frontend` — UI app
- `/home/runner/work/FinStream/FinStream/backend` — Java backend project
- `/home/runner/work/FinStream/FinStream/etl-python` — Python ETL scripts and sample datasets

## Quick Start
1. Set up and run the backend (`backend/README.md`).
2. Set up and run the ETL pipeline (`etl-python/README.md`).
3. Set up and run the frontend (`frontend/README.md`).

## Environment Notes
- Frontend API target: `VITE_API_URL` (defaults to `http://localhost:8080`)
- Backend DB + ETL settings are provided via environment variables in Spring config.
- ETL pipeline requires `DATABASE_URL` in `/home/runner/work/FinStream/FinStream/etl-python/.env`.
