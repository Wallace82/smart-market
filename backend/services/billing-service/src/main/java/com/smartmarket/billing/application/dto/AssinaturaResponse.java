package com.smartmarket.billing.application.dto;

import com.smartmarket.billing.domain.model.CicloCobranca;
import com.smartmarket.billing.domain.model.StatusAssinatura;
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
public class AssinaturaResponse {
    private UUID id;
    private UUID supermercadoId;
    private PlanoResponse plano;
    private CicloCobranca ciclo;
    private StatusAssinatura status;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private boolean renovacaoAutomatica;
}
