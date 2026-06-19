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
public class FeignOfferResponse {
    private UUID id;
    private UUID supermercadoId;
    private boolean ativo;
    private LocalDateTime dataFimPromocao;
}
