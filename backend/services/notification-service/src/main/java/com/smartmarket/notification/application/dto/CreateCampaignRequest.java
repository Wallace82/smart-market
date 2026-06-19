package com.smartmarket.notification.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCampaignRequest {
    @NotNull(message = "supermarketId é obrigatório")
    private UUID supermarketId;

    @NotBlank(message = "title é obrigatório")
    private String title;

    @NotBlank(message = "message é obrigatória")
    private String message;

    @NotNull(message = "radiusMeters é obrigatório")
    private Integer radiusMeters;

    @NotNull(message = "dailyLimitPerClient é obrigatório")
    private Integer dailyLimitPerClient;

    private CampaignTargetDto target;
}
