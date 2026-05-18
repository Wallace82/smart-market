package com.smartmarket.billing.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanoResponse {
    private UUID id;
    private String nome;
    private Integer limiteOfertasMensais;
    private Integer limiteEncartesAtivos;
    private Integer raioAtuacaoKm;
    private Integer limiteNotificacoesMensais;
    private boolean possuiConcierge;
    private Integer conciergeUploadsMensais;
    private Integer slaAtendimentoHoras;
    private String prioridadeFila;
    private BigDecimal precoMensal;
    private BigDecimal precoSemestral;
    private BigDecimal precoAnual;
}
