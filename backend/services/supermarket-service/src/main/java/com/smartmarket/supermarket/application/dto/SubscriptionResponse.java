package com.smartmarket.supermarket.application.dto;

import java.util.UUID;
import java.time.LocalDateTime;

public class SubscriptionResponse {
    private UUID id;
    private UUID supermarketId;
    private UUID planId;
    private String status;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Boolean autoRenew;

    public SubscriptionResponse() {}

    public SubscriptionResponse(UUID id, UUID supermarketId, UUID planId, String status, LocalDateTime startAt, LocalDateTime endAt, Boolean autoRenew) {
        this.id = id;
        this.supermarketId = supermarketId;
        this.planId = planId;
        this.status = status;
        this.startAt = startAt;
        this.endAt = endAt;
        this.autoRenew = autoRenew;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSupermarketId() { return supermarketId; }
    public void setSupermarketId(UUID supermarketId) { this.supermarketId = supermarketId; }
    public UUID getPlanId() { return planId; }
    public void setPlanId(UUID planId) { this.planId = planId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }
    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }
    public Boolean getAutoRenew() { return autoRenew; }
    public void setAutoRenew(Boolean autoRenew) { this.autoRenew = autoRenew; }
}

