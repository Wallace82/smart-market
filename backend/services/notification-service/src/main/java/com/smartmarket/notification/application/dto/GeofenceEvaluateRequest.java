package com.smartmarket.notification.application.dto;

import jakarta.validation.constraints.NotNull;
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
public class GeofenceEvaluateRequest {
    @NotNull(message = "clientId é obrigatório")
    private UUID clientId;

    @NotNull(message = "latitude é obrigatória")
    private Double latitude;

    @NotNull(message = "longitude é obrigatória")
    private Double longitude;

    @NotNull(message = "eventAt é obrigatório")
    private LocalDateTime eventAt;
}
