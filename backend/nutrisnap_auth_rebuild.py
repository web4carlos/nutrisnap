from __future__ import annotations

import ast
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
APP = ROOT / "app"
STAMP = datetime.now().strftime("%Y%m%d_%H%M%S")
BACKUP_DIR = ROOT / f"auth_rebuild_backup_{STAMP}"


def backup(path: Path) -> None:
    if not path.exists():
        return
    destination = BACKUP_DIR / path.relative_to(ROOT)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, destination)


def replace_text(path: Path, replacements: list[tuple[str, str]]) -> bool:
    if not path.exists():
        print(f"[SKIP] Missing: {path.relative_to(ROOT)}")
        return False
    original = path.read_text(encoding="utf-8")
    updated = original
    for old, new in replacements:
        updated = updated.replace(old, new)
    if updated == original:
        print(f"[OK] No changes needed: {path.relative_to(ROOT)}")
        return False
    backup(path)
    path.write_text(updated, encoding="utf-8")
    print(f"[PATCHED] {path.relative_to(ROOT)}")
    return True


def ensure_dependencies_module() -> None:
    path = APP / "auth" / "dependencies.py"
    if not path.exists():
        raise FileNotFoundError(path)

    source = path.read_text(encoding="utf-8")
    source = source.replace("```python\n", "").replace("\n```", "")

    replacements = [
        ("from app.auth.jwt import decode_access_token", "from app.auth.security import decode_token"),
        ("from app.auth.security import decode_access_token", "from app.auth.security import decode_token"),
        ("decode_access_token(token)", "decode_token(token)"),
        ("from app.db.base import Base", "from app.database.base_class import Base"),
        ("from app.db.session import get_db", "from app.database.session import SessionLocal"),
        ("from app.database.session import get_session", "from app.database.session import SessionLocal"),
    ]
    for old, new in replacements:
        source = source.replace(old, new)

    if "from app.database.session import SessionLocal" in source and "def get_db(" not in source:
        insertion = """\ndef get_db():\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\n\n"""
        marker = "oauth2_scheme ="
        if marker in source:
            index = source.index(marker)
            source = source[:index] + insertion + source[index:]
        else:
            source += "\n" + insertion

    source = source.replace("Depends(get_session)", "Depends(get_db)")

    backup(path)
    path.write_text(source, encoding="utf-8")
    print(f"[REBUILT] {path.relative_to(ROOT)}")


def patch_auth_router() -> None:
    path = APP / "api" / "v1" / "auth.py"
    replacements = [
        ("from app.db.session import get_db", "from app.auth.dependencies import get_db"),
        ("from app.database.session import get_session", "from app.auth.dependencies import get_db"),
        ("Depends(get_session)", "Depends(get_db)"),
    ]
    replace_text(path, replacements)


def patch_user_model() -> None:
    path = APP / "models" / "user.py"
    replacements = [
        ("from app.db.base import Base", "from app.database.base_class import Base"),
        ("from app.database.base import Base", "from app.database.base_class import Base"),
    ]
    replace_text(path, replacements)


def patch_all_legacy_app_db_imports() -> None:
    mappings = {
        "from app.db.base import Base": "from app.database.base_class import Base",
        "from app.db.session import get_db": "from app.auth.dependencies import get_db",
        "from app.db.session import SessionLocal": "from app.database.session import SessionLocal",
    }
    for path in APP.rglob("*.py"):
        original = path.read_text(encoding="utf-8")
        updated = original
        for old, new in mappings.items():
            updated = updated.replace(old, new)
        if updated != original:
            backup(path)
            path.write_text(updated, encoding="utf-8")
            print(f"[LEGACY PATCH] {path.relative_to(ROOT)}")


def validate_python_syntax() -> None:
    errors: list[str] = []
    for path in APP.rglob("*.py"):
        try:
            ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
        except SyntaxError as exc:
            errors.append(f"{path.relative_to(ROOT)}: {exc}")
    if errors:
        print("\n[ERROR] Syntax validation failed:")
        for error in errors:
            print(f"  - {error}")
        raise SystemExit(1)
    print("[OK] Python syntax validation passed")


def validate_imports() -> None:
    commands = [
        ("User model", "from app.models.user import User"),
        ("Auth dependencies", "from app.auth.dependencies import get_current_user"),
        ("FastAPI application", "from app.main import app"),
    ]
    for label, statement in commands:
        result = subprocess.run([sys.executable, "-c", statement], cwd=ROOT, text=True, capture_output=True)
        if result.returncode == 0:
            print(f"[OK] {label}")
        else:
            print(f"\n[FAILED] {label}")
            print(result.stderr.strip())
            print("\nThe files were backed up. Send this exact error output for the next project-specific correction.")
            raise SystemExit(result.returncode)


def main() -> None:
    if not APP.exists():
        raise SystemExit(r"Place and run this script from C:\projects\nutrisnap\backend")

    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    print("NutriSnap authentication native integration repair")
    print(f"Project: {ROOT}")
    print(f"Backup:  {BACKUP_DIR.name}\n")

    ensure_dependencies_module()
    patch_auth_router()
    patch_user_model()
    patch_all_legacy_app_db_imports()
    validate_python_syntax()
    validate_imports()

    print("\nSUCCESS: NutriSnap application imports correctly.")
    print("\nStart the server with:")
    print(r".\venv\Scripts\python.exe -m uvicorn app.main:app --reload")


if __name__ == "__main__":
    main()
