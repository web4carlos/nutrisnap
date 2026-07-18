$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\backend"

$python = ".\venv\Scripts\python.exe"
if (-not (Test-Path $python)) {
    throw "Virtual environment not found. Run .\setup.ps1 first."
}

& $python -m pytest -q
