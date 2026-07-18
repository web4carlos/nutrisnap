# NutriSnap Backend

## Requirements

- Windows 10/11
- Python 3.13
- MySQL 8

## 1. Create the virtual environment

Open PowerShell inside the `backend` folder:

```powershell
py -3.13 -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

## 2. Install dependencies

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## 3. Configure environment variables

```powershell
Copy-Item .env.example .env
```

Edit `.env` and enter your MySQL password.

Create the database:

```sql
CREATE DATABASE nutrisnap
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

## 4. Apply migrations

```powershell
alembic upgrade head
```

## 5. Run the API

```powershell
python -m uvicorn app.main:app --reload
```

Open:

- API: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/api/v1/health
- Readiness: http://127.0.0.1:8000/api/v1/health/ready

## Run tests

```powershell
pytest
```
