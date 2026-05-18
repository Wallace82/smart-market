package com.smartmarket.billing.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "planos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanoEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(name = "limite_ofertas_mensais")
    private Integer limiteOfertasMensais;

    @Column(name = "limite_encartes_ativos")
    private Integer limiteEncartesAtivos;

    @Column(name = "raio_atuacao_km")
    private Integer raioAtuacaoKm;

    @Column(name = "limite_notificacoes_mensais")
    private Integer limiteNotificacoesMensais;

    @Column(name = "possui_concierge", nullable = false)
    private boolean possuiConcierge;

    @Column(name = "concierge_uploads_mensais")
    private Integer conciergeUploadsMensais;

    @Column(name = "sla_atendimento_horas")
    private Integer slaAtendimentoHoras;

    @Column(name = "prioridade_fila")
    private String prioridadeFila;

    @Column(name = "preco_mensal", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoMensal;

    @Column(name = "preco_semestral", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoSemestral;

    @Column(name = "preco_anual", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoAnual;

    @Column(nullable = false)
    private boolean ativo = true;
}
