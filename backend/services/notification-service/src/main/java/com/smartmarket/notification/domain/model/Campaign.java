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
public class Campaign {
    private UUID id;
    private UUID supermarketId;
    private String title;
    private String message;
    private Integer radiusMeters;
    private Integer dailyLimitPerClient;
    private String status; // ATIVA, PAUSADA
    private CampaignTarget target;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
