# Architecture

NutriSnap follows a modular backend structure.

```text
API -> Service -> Repository -> Database
```

The initial foundation includes:

- Versioned FastAPI routes
- Environment-driven configuration
- SQLAlchemy session management
- Alembic migrations
- Health and readiness checks
- Automated tests
