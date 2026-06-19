package com.smartmarket.notification.infrastructure.adapter.out.feign;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeignEncarteResponse {
    private UUID id;
    private UUID supermercadoId;
    private String status; // RASCUNHO, ATIVO, ENCERRADO
}
