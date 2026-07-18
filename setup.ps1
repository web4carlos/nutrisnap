$ErrorActionPreference = "Stop"

Write-Host "NutriSnap Foundation Setup" -ForegroundColor Cyan

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    throw "Python was not found. Install Python 3.13 and reopen PowerShell."
}

Set-Location "$PSScriptRoot\backend"

if (-not (Test-Path ".\venv")) {
    python -m venv venv
}

$python = ".\venv\Scripts\python.exe"
& $python -m pip install --upgrade pip
& $python -m pip install -r requirements.txt

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created backend\.env. Update the MySQL credentials before using the readiness endpoint." -ForegroundColor Yellow
}

Write-Host "Setup completed." -ForegroundColor Green
Write-Host "Run: .\run.ps1"
