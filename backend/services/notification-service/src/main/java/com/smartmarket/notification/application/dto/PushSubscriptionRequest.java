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
public class PushSubscriptionRequest {
    @NotNull(message = "clientId é obrigatório")
    private UUID clientId;

    @NotBlank(message = "endpoint é obrigatório")
    private String endpoint;

    @NotBlank(message = "authKey é obrigatório")
    private String authKey;

    @NotBlank(message = "p256dhKey é obrigatório")
    private String p256dhKey;
}
