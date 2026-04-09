[CmdletBinding()]
param(
    [switch]$Build
)

$ErrorActionPreference = 'Stop'
$composeDir = Join-Path $PSScriptRoot "..\compose"
$localYaml = Join-Path $composeDir "docker-compose.local.yml"
$overrideYaml = Join-Path $composeDir "docker-compose.override.yml"

Write-Host "Subindo ambiente local SmartMarket..." -ForegroundColor Cyan

$buildArg = ""
if ($Build) {
    $buildArg = "--build"
    Write-Host "Modo de build ativado. Compilando imagens..." -ForegroundColor Yellow
}

$cmd = "docker compose -f `"$localYaml`""
if (Test-Path $overrideYaml) {
    $cmd += " -f `"$overrideYaml`""
}
$cmd += " up -d $buildArg"

Invoke-Expression $cmd

Write-Host "Ambiente iniciado. Verifique com: docker compose -f `"$localYaml`" ps" -ForegroundColor Green
