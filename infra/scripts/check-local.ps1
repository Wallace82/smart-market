param(
    [int]$TimeoutSeconds = 5
)

$ErrorActionPreference = "Stop"

$services = @(
    @{ Name = "api-gateway"; Url = "http://localhost:8080/health" },
    @{ Name = "auth-service"; Url = "http://localhost:8081/health" },
    @{ Name = "supermarket-service"; Url = "http://localhost:8082/health" },
    @{ Name = "product-service"; Url = "http://localhost:8083/health" },
    @{ Name = "client-service"; Url = "http://localhost:8084/health" },
    @{ Name = "notification-service"; Url = "http://localhost:8085/health" },
    @{ Name = "recommendation-service"; Url = "http://localhost:8086/health" }
)

$allHealthy = $true

Write-Host "Verificando saude dos servicos SmartMarket..." -ForegroundColor Cyan

foreach ($service in $services) {
    try {
        $response = Invoke-RestMethod -Method Get -Uri $service.Url -TimeoutSec $TimeoutSeconds
        if ($response.status -eq "UP") {
            Write-Host "[OK] $($service.Name) -> UP" -ForegroundColor Green
        } else {
            Write-Host "[WARN] $($service.Name) -> resposta inesperada" -ForegroundColor Yellow
            $allHealthy = $false
        }
    } catch {
        Write-Host "[FAIL] $($service.Name) -> indisponivel ($($_.Exception.Message))" -ForegroundColor Red
        $allHealthy = $false
    }
}

if ($allHealthy) {
    Write-Host "Todos os servicos estao saudaveis." -ForegroundColor Green
    exit 0
}

Write-Host "Ha servicos indisponiveis ou com resposta inesperada." -ForegroundColor Yellow
exit 1
