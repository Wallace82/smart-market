package com.smartmarket.billing.application.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SubscriptionDTO {
    private UUID id;
    private UUID supermarketId;
    private PlanDTO plan;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime renewalDate;
    private Boolean autoRenew;
}
