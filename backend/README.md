# FinStream Backend (Java)

Spring Boot backend for FinStream APIs, data access, uploads, and ETL orchestration.

## Project Location
Main Maven project:
- `/home/runner/work/FinStream/FinStream/backend/server`

## Requirements
- Java 26 (as configured in `pom.xml`)
- Maven Wrapper (`./mvnw` is included)

## Configure Environment
Set these variables before starting the server:
- `SPRING_DATABASE_URL`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `PYTHON_EXECUTABLE` (optional, defaults to `python3`)
- `ETL_SCRIPT_PATH` (optional, defaults to `/app/etl-python/etl_pipeline.py`)

## Run
```bash
cd /home/runner/work/FinStream/FinStream/backend/server
./mvnw spring-boot:run
```

## Test
```bash
./mvnw test
```

## API Base
Default local API base URL:
- `http://localhost:8080`
