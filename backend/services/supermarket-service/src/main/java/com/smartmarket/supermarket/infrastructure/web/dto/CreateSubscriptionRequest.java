package com.smartmarket.supermarket.infrastructure.web.dto;

import java.util.UUID;
import java.time.LocalDateTime;

public class CreateSubscriptionRequest {
    private UUID planId;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Boolean autoRenew = true;

    public CreateSubscriptionRequest() {}

    public UUID getPlanId() { return planId; }
    public void setPlanId(UUID planId) { this.planId = planId; }
    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }
    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }
    public Boolean getAutoRenew() { return autoRenew; }
    public void setAutoRenew(Boolean autoRenew) { this.autoRenew = autoRenew; }
}
