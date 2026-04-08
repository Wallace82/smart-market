param(
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

Write-Host "Subindo ambiente local SmartMarket..." -ForegroundColor Cyan
if ($Build) {
    docker compose -f $baseFile -f $overrideFile up -d --build
} else {
    docker compose -f $baseFile -f $overrideFile up -d
}

Write-Host "Ambiente iniciado. Verifique com: docker compose -f `"$baseFile`" -f `"$overrideFile`" ps" -ForegroundColor Green
