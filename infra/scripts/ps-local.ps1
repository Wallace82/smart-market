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

docker compose -f $baseFile -f $overrideFile ps
