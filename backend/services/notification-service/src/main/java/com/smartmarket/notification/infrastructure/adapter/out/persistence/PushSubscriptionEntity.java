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
@Table(name = "notification_subscriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PushSubscriptionEntity {
    @Id
    private UUID id;

    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @Column(name = "endpoint", nullable = false, unique = true, length = 2048)
    private String endpoint;

    @Column(name = "auth_key", nullable = false)
    private String authKey;

    @Column(name = "p256dh_key", nullable = false)
    private String p256dhKey;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
