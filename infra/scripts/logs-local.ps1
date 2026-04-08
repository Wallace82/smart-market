param(
    [string]$Service = "",
    [switch]$Follow
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
    Write-Host "Exibindo logs do servico: $Service" -ForegroundColor Cyan
    if ($Follow) {
        docker compose -f $baseFile -f $overrideFile logs -f $Service
    } else {
        docker compose -f $baseFile -f $overrideFile logs $Service
    }
} else {
    Write-Host "Exibindo logs de todos os servicos" -ForegroundColor Cyan
    if ($Follow) {
        docker compose -f $baseFile -f $overrideFile logs -f
    } else {
        docker compose -f $baseFile -f $overrideFile logs
    }
}
