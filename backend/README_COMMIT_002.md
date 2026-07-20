# NutriSnap Commit 002 — Authentication

Overlay for `backend/app`. Includes Argon2, JWT access/refresh tokens, refresh-token rotation/revocation, SQLAlchemy models, FastAPI endpoints, Alembic migration, tests, and a PowerShell installer.

## Install
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\install-auth.ps1 -ProjectRoot "C:\projects\nutrisnap"
cd C:\projects\nutrisnap\backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements-auth.txt
```

Add to `.env`:
```env
JWT_SECRET_KEY=replace-with-at-least-32-random-characters
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30
```
Generate a secret:
```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Expected foundation imports: `app.db.base.Base`, `app.db.session.get_db`, and `app.core.config.settings`. Add the four JWT settings to your existing settings class.

In `app/main.py`:
```python
from app.api.v1.auth import router as auth_router
app.include_router(auth_router, prefix="/api/v1")
```

Replace `REPLACE_WITH_FOUNDATION_REVISION` in the migration with the current Alembic revision, then run:
```powershell
alembic upgrade head
python -m pytest
```
