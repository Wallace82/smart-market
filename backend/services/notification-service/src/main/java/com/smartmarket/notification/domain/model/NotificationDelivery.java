package com.smartmarket.notification.domain.model;

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
public class NotificationDelivery {
    private UUID id;
    private UUID campaignId;
    private UUID clientId;
    private String status; // PENDENTE, ENVIADA, FALHA, BLOQUEADA
    private String blockReason; // FREQUENCY_CAP_EXCEEDED, DUPLICATE_MESSAGE, CONSENT_REVOKED
    private LocalDateTime sentAt;
    private String messageHash;
    private String deepLink;
}
