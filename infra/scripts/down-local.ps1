param(
    [switch]$RemoveVolumes
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

Write-Host "Parando ambiente local SmartMarket..." -ForegroundColor Yellow
if ($RemoveVolumes) {
    docker compose -f $baseFile -f $overrideFile down -v
} else {
    docker compose -f $baseFile -f $overrideFile down
}

Write-Host "Ambiente finalizado." -ForegroundColor Green
