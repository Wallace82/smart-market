package com.smartmarket.concierge.application.dto;

import com.smartmarket.concierge.domain.model.ConciergeStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ConciergeQueueResponse {
    private UUID id;
    private UUID supermercadoId;
    private String titulo;
    private ConciergeStatus status;
    private BigDecimal score;
    private String faixaPrioridade;
    private LocalDateTime dataCriacao;
    private Long tempoEmFilaMinutos;
    private Long tempoRestanteSlaMinutos;
    private Integer complexidade;
    private String plano;
}
