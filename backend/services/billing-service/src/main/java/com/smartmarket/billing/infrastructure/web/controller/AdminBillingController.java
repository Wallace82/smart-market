package com.smartmarket.billing.infrastructure.web.controller;

import com.smartmarket.billing.application.dto.FinancialSummaryDTO;
import com.smartmarket.billing.application.service.AdminBillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/billing")
@RequiredArgsConstructor
public class AdminBillingController {

    private final AdminBillingService adminBillingService;

    @GetMapping("/summary")
    public ResponseEntity<FinancialSummaryDTO> getSummary() {
        return ResponseEntity.ok(adminBillingService.getFinancialSummary());
    }
}
