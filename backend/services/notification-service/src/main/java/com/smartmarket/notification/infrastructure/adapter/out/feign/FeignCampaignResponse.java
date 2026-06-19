package com.smartmarket.notification.infrastructure.adapter.out.feign;

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
public class FeignCampaignResponse {
    private UUID id;
    private UUID supermercadoId;
    private String nome;
    private String segmento;
    private Integer raio;
    private String status;
    private Integer pushesEnviados;
    private Integer conversoes;
    private LocalDateTime criadoEm;
}
