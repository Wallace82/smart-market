# Script para gerar o relatório de cobertura de testes em Markdown
$modules = @("auth-service", "client-service", "product-service", "supermarket-service", "api-gateway", "notification-service", "recommendation-service")
$reportPath = "../docs/test_coverage_report.md"

$report = "# Backend Test Coverage Report`n`n"
$report += "Este relatório é gerado automaticamente a partir dos dados do JaCoCo.`n`n"
$report += "| Módulo | Instruções Cobertas | Instruções Perdidas | Cobertura % |`n"
$report += "| --- | --- | --- | --- |`n"

foreach ($module in $modules) {
    $csvPath = "services/$module/target/site/jacoco/jacoco.csv"
    if ($module -eq "api-gateway") { $csvPath = "api-gateway/target/site/jacoco/jacoco.csv" }
    
    if (Test-Path $csvPath) {
        $csv = Import-Csv $csvPath
        $covered = 0
        $missed = 0
        foreach ($row in $csv) {
            $covered += [int]$row.INSTRUCTION_COVERED
            $missed += [int]$row.INSTRUCTION_MISSED
        }
        $total = $covered + $missed
        $percentage = if ($total -gt 0) { [math]::Round(($covered / $total) * 100, 2) } else { 0 }
        $report += "| $module | $covered | $missed | $percentage% |`n"
    } else {
        $report += "| $module | 0 | 0 | 0% (Sem dados) |`n"
    }
}

$report += "`n*Última atualização: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')*`n"
$report | Out-File -FilePath $reportPath -Encoding utf8
Write-Host "Relatório de cobertura gerado em: $reportPath"
