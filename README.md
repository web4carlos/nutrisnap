# NutriSnap

**Beautiful software. Intelligent decisions. Healthier lives.**

NutriSnap is an AI-first nutrition platform. This repository currently contains the `v0.1.0-alpha` backend foundation.

## Included

- FastAPI application factory
- Versioned API routing under `/api/v1`
- SQLAlchemy 2.x with MySQL and PyMySQL
- Alembic migration foundation
- Environment-based configuration
- CORS middleware
- Structured logging
- Health and database-readiness endpoints
- Pytest test suite
- Windows PowerShell setup scripts
- GitHub Actions backend tests on Windows

## Windows PowerShell setup

From the repository root:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup.ps1
```

Open `backend\.env` and enter the correct MySQL values. Then start the API:

```powershell
.\run.ps1
```

Open:

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/api/v1/health`
- Database readiness: `http://127.0.0.1:8000/api/v1/health/ready`

Run tests in another PowerShell window:

```powershell
.\test.ps1
```

## First commit

```powershell
git add .
git commit -m "feat: initial project foundation"
git push -u origin main
```

## Next milestone

EPIC-002 adds users, profiles, refresh tokens, JWT authentication, registration, login, refresh, logout, and `/auth/me`.
