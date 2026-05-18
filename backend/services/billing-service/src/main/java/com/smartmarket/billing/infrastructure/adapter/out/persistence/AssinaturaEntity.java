package com.smartmarket.billing.infrastructure.adapter.out.persistence;

import com.smartmarket.billing.domain.model.CicloCobranca;
import com.smartmarket.billing.domain.model.StatusAssinatura;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assinaturas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssinaturaEntity {

    @Id
    private UUID id;

    @Column(name = "supermercado_id", nullable = false)
    private UUID supermercadoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plano_id", nullable = false)
    private PlanoEntity plano;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CicloCobranca ciclo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAssinatura status;

    @Column(name = "data_inicio", nullable = false)
    private LocalDateTime dataInicio;

    @Column(name = "data_fim")
    private LocalDateTime dataFim;

    @Column(name = "renovacao_automatica", nullable = false)
    private boolean renovacaoAutomatica = true;
}
