package com.smartmarket.billing.application.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CriarPlanoRequest {
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
    private boolean ativo;
}
