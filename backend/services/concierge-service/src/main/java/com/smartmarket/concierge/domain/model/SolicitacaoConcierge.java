package com.smartmarket.concierge.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoConcierge {
    private UUID id;
    private UUID supermercadoId;
    private UUID atendenteId;
    private String titulo;
    private ConciergeStatus status;
    private Integer slaDefinidoHoras;
    private BigDecimal prioridadeScore;
    private Integer complexidade;
    private String planoCliente;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataInicioProcessamento;
    private LocalDateTime dataConclusao;
    private LocalDateTime lockAt;
    private String urlArquivoOriginal;
    private String observacoes;
}
