package com.smartmarket.notification.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "campaigns")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignEntity {
    @Id
    private UUID id;

    @Column(name = "supermarket_id", nullable = false)
    private UUID supermarketId;

    @Column(name = "title", nullable = false, length = 120)
    private String title;

    @Column(name = "message", nullable = false, length = 500)
    private String message;

    @Column(name = "radius_meters", nullable = false)
    private Integer radiusMeters;

    @Column(name = "daily_limit_per_client", nullable = false)
    private Integer dailyLimitPerClient;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // ATIVA, PAUSADA

    @Column(name = "target_type", length = 20)
    private String targetType; // PRODUCT, FLYER

    @Column(name = "target_reference_id")
    private UUID targetReferenceId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
