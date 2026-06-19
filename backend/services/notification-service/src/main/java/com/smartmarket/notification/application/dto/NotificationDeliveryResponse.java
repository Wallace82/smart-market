package com.smartmarket.notification.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDeliveryResponse {
    private UUID id;
    private UUID campaignId;
    private UUID clientId;
    private String status;
    private LocalDateTime sentAt;
    private String blockReason;
    private String deepLink;
}
