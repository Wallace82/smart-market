package com.smartmarket.billing.application.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PlanDTO {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private String billingCycle;
    private Integer maxOffers;
    private Integer maxPushNotifications;
    private Boolean allowCustomerPreferences;
    private Integer trialDays;
    private Boolean active;
}
