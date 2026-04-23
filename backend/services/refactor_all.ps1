$ErrorActionPreference = "Stop"

$services = @(
    @{ name = "client-service"; pkg = "client" },
    @{ name = "notification-service"; pkg = "notification" },
    @{ name = "recommendation-service"; pkg = "recommendation" },
    @{ name = "supermarket-service"; pkg = "supermarket" }
)

foreach ($svc in $services) {
    $serviceName = $svc.name
    $pkgName = $svc.pkg
    Write-Host "Refactoring $serviceName..."
    
    $baseDir = "c:\Users\Foton\git\smart-market\backend\services\$serviceName\src\main\java\com\smartmarket\$pkgName"
    
    $domainRepo = "$baseDir\domain\repository"
    $appPortOut = "$baseDir\application\port\out"
    
    $infraWebDto = "$baseDir\infrastructure\web\dto"
    $appDto = "$baseDir\application\dto"
    
    $infraWeb = "$baseDir\infrastructure\web"
    $adapterInWeb = "$baseDir\infrastructure\adapter\in\web"
    
    $infraPersistence = "$baseDir\infrastructure\persistence"
    $adapterOutPersistence = "$baseDir\infrastructure\adapter\out\persistence"
    
    $infraMessaging = "$baseDir\infrastructure\messaging"
    $adapterInMessaging = "$baseDir\infrastructure\adapter\in\messaging"
    $adapterOutMessaging = "$baseDir\infrastructure\adapter\out\messaging"

    # Create new directories
    if (-not (Test-Path $appPortOut)) { New-Item -ItemType Directory -Force -Path $appPortOut | Out-Null }
    if (-not (Test-Path $appDto)) { New-Item -ItemType Directory -Force -Path $appDto | Out-Null }
    if (-not (Test-Path $adapterInWeb)) { New-Item -ItemType Directory -Force -Path $adapterInWeb | Out-Null }
    if (-not (Test-Path $adapterOutPersistence)) { New-Item -ItemType Directory -Force -Path $adapterOutPersistence | Out-Null }

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
        $webMapper = "$infraWeb\mapper"
        if (Test-Path $webMapper) {
            New-Item -ItemType Directory -Force -Path "$adapterInWeb\mapper" | Out-Null
            Get-ChildItem -Path $webMapper -File | Move-Item -Destination "$adapterInWeb\mapper"
            Remove-Item -Path $webMapper -Recurse -Force
        }
    }

    # Move infrastructure/persistence to infrastructure/adapter/out/persistence
    if (Test-Path $infraPersistence) {
        Get-ChildItem -Path $infraPersistence -File | Move-Item -Destination $adapterOutPersistence
        Get-ChildItem -Path $infraPersistence -Directory | Move-Item -Destination $adapterOutPersistence
    }

    # Cleanup empty old dirs
    if (Test-Path $infraWeb) { Remove-Item -Path $infraWeb -Recurse -Force }
    if (Test-Path $infraPersistence) { Remove-Item -Path $infraPersistence -Recurse -Force }

    # Apply replacements
    $srcDir = "c:\Users\Foton\git\smart-market\backend\services\$serviceName\src\main\java\com\smartmarket\$pkgName"
    
    Get-ChildItem -Path $srcDir -File -Recurse -Filter *.java | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $changed = $false
        
        if ($content -match "com\.smartmarket\.$pkgName\.domain\.repository") {
            $content = $content -replace "com\.smartmarket\.$pkgName\.domain\.repository", "com.smartmarket.$pkgName.application.port.out"
            $changed = $true
        }
        if ($content -match "com\.smartmarket\.$pkgName\.infrastructure\.web\.dto") {
            $content = $content -replace "com\.smartmarket\.$pkgName\.infrastructure\.web\.dto", "com.smartmarket.$pkgName.application.dto"
            $changed = $true
        }
        if ($content -match "com\.smartmarket\.$pkgName\.infrastructure\.web\.mapper") {
            $content = $content -replace "com\.smartmarket\.$pkgName\.infrastructure\.web\.mapper", "com.smartmarket.$pkgName.infrastructure.adapter.in.web.mapper"
            $changed = $true
        }
        if ($content -match "com\.smartmarket\.$pkgName\.infrastructure\.web") {
            $content = $content -replace "com\.smartmarket\.$pkgName\.infrastructure\.web", "com.smartmarket.$pkgName.infrastructure.adapter.in.web"
            $changed = $true
        }
        if ($content -match "com\.smartmarket\.$pkgName\.infrastructure\.persistence") {
            $content = $content -replace "com\.smartmarket\.$pkgName\.infrastructure\.persistence", "com.smartmarket.$pkgName.infrastructure.adapter.out.persistence"
            $changed = $true
        }
        
        if ($changed) {
            Set-Content -Path $_.FullName -Value $content
        }
    }
    
    Write-Host "Completed refactoring for $serviceName."
}

Write-Host "All remaining services have been structurally refactored."
