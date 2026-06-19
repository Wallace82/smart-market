package com.smartmarket.notification.infrastructure.adapter.out.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDeliveryEntity {
    @Id
    private UUID id;

    @Column(name = "campaign_id", nullable = false)
    private UUID campaignId;

    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "block_reason", length = 100)
    private String blockReason;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @Column(name = "message_hash", nullable = false, length = 64)
    private String messageHash;

    @Column(name = "deep_link", length = 255)
    private String deepLink;
}
