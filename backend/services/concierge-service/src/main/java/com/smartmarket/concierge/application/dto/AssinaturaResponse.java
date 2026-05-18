package com.smartmarket.concierge.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssinaturaResponse {
    private UUID id;
    private UUID supermercadoId;
    private PlanoResponse plano;
    private String status;
}
