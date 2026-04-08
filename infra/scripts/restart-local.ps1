param(
    [string]$Service = "",
    [switch]$Build
)

$ErrorActionPreference = "Stop"

$composePath = Join-Path $PSScriptRoot "..\compose"
$baseFile = Join-Path $composePath "docker-compose.local.yml"
$overrideFile = Join-Path $composePath "docker-compose.override.yml"

if (!(Test-Path $baseFile)) {
    throw "Arquivo nao encontrado: $baseFile"
}

if (!(Test-Path $overrideFile)) {
    throw "Arquivo nao encontrado: $overrideFile"
}

if ($Service -ne "") {
    Write-Host "Reiniciando servico: $Service" -ForegroundColor Yellow
    if ($Build) {
        docker compose -f $baseFile -f $overrideFile up -d --build $Service
    } else {
        docker compose -f $baseFile -f $overrideFile restart $Service
    }
} else {
    Write-Host "Reiniciando todo o ambiente local SmartMarket..." -ForegroundColor Yellow
    if ($Build) {
        docker compose -f $baseFile -f $overrideFile down
        docker compose -f $baseFile -f $overrideFile up -d --build
    } else {
        docker compose -f $baseFile -f $overrideFile restart
    }
}

Write-Host "Reinicio concluido." -ForegroundColor Green
