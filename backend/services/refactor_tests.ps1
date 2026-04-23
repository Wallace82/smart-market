$ErrorActionPreference = "Stop"

$services = @(
    @{ name = "auth-service"; pkg = "auth" },
    @{ name = "client-service"; pkg = "client" },
    @{ name = "notification-service"; pkg = "notification" },
    @{ name = "recommendation-service"; pkg = "recommendation" },
    @{ name = "supermarket-service"; pkg = "supermarket" },
    @{ name = "product-service"; pkg = "product" }
)

foreach ($svc in $services) {
    $serviceName = $svc.name
    $pkgName = $svc.pkg
    Write-Host "Refactoring tests for $serviceName..."
    
    $baseDir = "c:\Users\Foton\git\smart-market\backend\services\$serviceName\src\test\java\com\smartmarket\$pkgName"
    
    if (-not (Test-Path $baseDir)) {
        Write-Host "No tests found for $serviceName"
        continue
    }

    $domainRepo = "$baseDir\domain\repository"
    $appPortOut = "$baseDir\application\port\out"
    
    $infraWebDto = "$baseDir\infrastructure\web\dto"
    $appDto = "$baseDir\application\dto"
    
    $infraWeb = "$baseDir\infrastructure\web"
    $adapterInWeb = "$baseDir\infrastructure\adapter\in\web"
    
    $infraPersistence = "$baseDir\infrastructure\persistence"
    $adapterOutPersistence = "$baseDir\infrastructure\adapter\out\persistence"

    $infraSecurity = "$baseDir\infrastructure\security"
    $adapterOutSecurity = "$baseDir\infrastructure\adapter\out\security"
    
    # Create new directories
    if (-not (Test-Path $appPortOut)) { New-Item -ItemType Directory -Force -Path $appPortOut | Out-Null }
    if (-not (Test-Path $appDto)) { New-Item -ItemType Directory -Force -Path $appDto | Out-Null }
    if (-not (Test-Path $adapterInWeb)) { New-Item -ItemType Directory -Force -Path $adapterInWeb | Out-Null }
    if (-not (Test-Path $adapterOutPersistence)) { New-Item -ItemType Directory -Force -Path $adapterOutPersistence | Out-Null }
    if (-not (Test-Path $adapterOutSecurity)) { New-Item -ItemType Directory -Force -Path $adapterOutSecurity | Out-Null }

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

    # Move infrastructure/security to infrastructure/adapter/out/security
    if (Test-Path $infraSecurity) {
        Get-ChildItem -Path $infraSecurity -File | Move-Item -Destination $adapterOutSecurity
        Get-ChildItem -Path $infraSecurity -Directory | Move-Item -Destination $adapterOutSecurity
        Remove-Item -Path $infraSecurity -Recurse -Force
    }

    # Cleanup empty old dirs
    if (Test-Path $infraWeb) { Remove-Item -Path $infraWeb -Recurse -Force }
    if (Test-Path $infraPersistence) { Remove-Item -Path $infraPersistence -Recurse -Force }

    # Apply string replacements to fix imports and packages
    Get-ChildItem -Path $baseDir -File -Recurse -Filter *.java | ForEach-Object {
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
        if ($content -match "com\.smartmarket\.$pkgName\.infrastructure\.security") {
            $content = $content -replace "com\.smartmarket\.$pkgName\.infrastructure\.security", "com.smartmarket.$pkgName.infrastructure.adapter.out.security"
            $changed = $true
        }
        
        if ($changed) {
            Set-Content -Path $_.FullName -Value $content
        }
    }
}

Write-Host "Test refactoring script completed."
