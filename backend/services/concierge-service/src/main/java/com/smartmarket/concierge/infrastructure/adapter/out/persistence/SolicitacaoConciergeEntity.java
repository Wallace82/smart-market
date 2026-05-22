package com.smartmarket.concierge.infrastructure.adapter.out.persistence;

import com.smartmarket.concierge.domain.model.ConciergeStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "solicitacoes_concierge")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoConciergeEntity {

    @Id
    private UUID id;

    @Column(name = "supermercado_id", nullable = false)
    private UUID supermercadoId;

    @Column(name = "atendente_id")
    private UUID atendenteId;

    @Column(nullable = false)
    private String titulo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConciergeStatus status;

    @Column(name = "sla_definido_horas", nullable = false)
    private Integer slaDefinidoHoras;

    @Column(name = "prioridade_score", precision = 10, scale = 4)
    private BigDecimal prioridadeScore;

    @Column(name = "complexidade")
    private Integer complexidade;

    @Column(name = "plano_cliente")
    private String planoCliente;

    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_inicio_processamento")
    private LocalDateTime dataInicioProcessamento;

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;

    @Column(name = "lock_at")
    private LocalDateTime lockAt;

    @Column(name = "url_arquivo_original", length = 1024)
    private String urlArquivoOriginal;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "encarte_id")
    private UUID encarteId;

    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnexoConciergeEntity> anexos = new ArrayList<>();
}
