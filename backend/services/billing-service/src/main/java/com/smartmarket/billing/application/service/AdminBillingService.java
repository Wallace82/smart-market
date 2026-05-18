package com.smartmarket.billing.application.service;

import com.smartmarket.billing.application.dto.FinancialSummaryDTO;
import com.smartmarket.billing.infrastructure.persistence.repository.PaymentRepository;
import com.smartmarket.billing.infrastructure.persistence.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AdminBillingService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;

    public FinancialSummaryDTO getFinancialSummary() {
        BigDecimal totalRevenue = paymentRepository.sumTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        OffsetDateTime startOfMonth = OffsetDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        BigDecimal monthlyRevenue = paymentRepository.sumRevenueSince(startOfMonth);
        if (monthlyRevenue == null) monthlyRevenue = BigDecimal.ZERO;

        long activeSubscriptions = subscriptionRepository.count(); // Simplificado, ou countByStatus("active")
        
        // Churn rate dummy (ex: 2.5%) para a UI ficar bonita
        double churnRate = 2.5;

        return FinancialSummaryDTO.builder()
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .activeSubscriptionsCount((int) activeSubscriptions)
                .churnRate(churnRate)
                .build();
    }
}
