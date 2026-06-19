package com.smartmarket.notification.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCampaignStatusRequest {
    @NotBlank(message = "status é obrigatório")
    private String status; // ATIVA, PAUSADA
}
