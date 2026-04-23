$ErrorActionPreference = "Stop"

$baseDir = "src/main/java/com/smartmarket/product"
$domainRepo = "$baseDir/domain/repository"
$appPortOut = "$baseDir/application/port/out"

$infraWebDto = "$baseDir/infrastructure/web/dto"
$appDto = "$baseDir/application/dto"

$infraWeb = "$baseDir/infrastructure/web"
$adapterInWeb = "$baseDir/infrastructure/adapter/in/web"

$infraPersistence = "$baseDir/infrastructure/persistence"
$adapterOutPersistence = "$baseDir/infrastructure/adapter/out/persistence"

$infraStorage = "$baseDir/infrastructure/storage"
$adapterOutStorage = "$baseDir/infrastructure/adapter/out/storage"

# Create new directories
New-Item -ItemType Directory -Force -Path $appPortOut | Out-Null
New-Item -ItemType Directory -Force -Path $appDto | Out-Null
New-Item -ItemType Directory -Force -Path $adapterInWeb | Out-Null
New-Item -ItemType Directory -Force -Path $adapterOutPersistence | Out-Null
New-Item -ItemType Directory -Force -Path $adapterOutStorage | Out-Null

# Move domain/repository to application/port/out
if (Test-Path $domainRepo) {
    Get-ChildItem -Path $domainRepo -File | Move-Item -Destination $appPortOut
    Remove-Item -Path $domainRepo -Recurse -Force
}

# Move infrastructure/web/dto to application/dto
if (Test-Path $infraWebDto) {
    Get-ChildItem -Path $infraWebDto -File | Move-Item -Destination $appDto
    Remove-Item -Path $infraWebDto -Recurse -Force
}

# Move infrastructure/web to infrastructure/adapter/in/web
if (Test-Path $infraWeb) {
    Get-ChildItem -Path $infraWeb -File | Move-Item -Destination $adapterInWeb
    Get-ChildItem -Path $infraWeb -Directory | Where-Object { $_.Name -ne "dto" -and $_.Name -ne "mapper" } | Move-Item -Destination $adapterInWeb
    # The mapper was created in web/mapper
    $webMapper = "$infraWeb/mapper"
    if (Test-Path $webMapper) {
        New-Item -ItemType Directory -Force -Path "$adapterInWeb/mapper" | Out-Null
        Get-ChildItem -Path $webMapper -File | Move-Item -Destination "$adapterInWeb/mapper"
        Remove-Item -Path $webMapper -Recurse -Force
    }
}

# Move infrastructure/persistence to infrastructure/adapter/out/persistence
if (Test-Path $infraPersistence) {
    Get-ChildItem -Path $infraPersistence -File | Move-Item -Destination $adapterOutPersistence
    Get-ChildItem -Path $infraPersistence -Directory | Move-Item -Destination $adapterOutPersistence
}

# Move infrastructure/storage to infrastructure/adapter/out/storage
if (Test-Path $infraStorage) {
    Get-ChildItem -Path $infraStorage -File | Move-Item -Destination $adapterOutStorage
    Get-ChildItem -Path $infraStorage -Directory | Move-Item -Destination $adapterOutStorage
    Remove-Item -Path $infraStorage -Recurse -Force
}

# Cleanup empty old dirs
if (Test-Path $infraWeb) { Remove-Item -Path $infraWeb -Recurse -Force }
if (Test-Path $infraPersistence) { Remove-Item -Path $infraPersistence -Recurse -Force }

# Replacements function
function Replace-StringInFiles {
    param(
        [string]$Path,
        [string]$Old,
        [string]$New
    )
    Get-ChildItem -Path $Path -File -Recurse -Filter *.java | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -match [regex]::Escape($Old)) {
            $newContent = $content -replace [regex]::Escape($Old), $New
            Set-Content -Path $_.FullName -Value $newContent
        }
    }
}

# Apply replacements
$srcDir = "src/main/java/com/smartmarket/product"
Replace-StringInFiles -Path $srcDir -Old "com.smartmarket.product.domain.repository" -New "com.smartmarket.product.application.port.out"
Replace-StringInFiles -Path $srcDir -Old "com.smartmarket.product.infrastructure.web.dto" -New "com.smartmarket.product.application.dto"
Replace-StringInFiles -Path $srcDir -Old "com.smartmarket.product.infrastructure.web.mapper" -New "com.smartmarket.product.infrastructure.adapter.in.web.mapper"
Replace-StringInFiles -Path $srcDir -Old "com.smartmarket.product.infrastructure.web" -New "com.smartmarket.product.infrastructure.adapter.in.web"
Replace-StringInFiles -Path $srcDir -Old "com.smartmarket.product.infrastructure.persistence" -New "com.smartmarket.product.infrastructure.adapter.out.persistence"
Replace-StringInFiles -Path $srcDir -Old "com.smartmarket.product.infrastructure.storage" -New "com.smartmarket.product.infrastructure.adapter.out.storage"

Write-Host "Refactoring script completed."
