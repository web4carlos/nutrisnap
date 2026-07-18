$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\backend"

$python = ".\venv\Scripts\python.exe"
if (-not (Test-Path $python)) {
    throw "Virtual environment not found. Run .\setup.ps1 first."
}

& $python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
