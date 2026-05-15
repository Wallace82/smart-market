package com.smartmarket.concierge.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "auditoria_concierge")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditoriaConciergeEntity {

    @Id
    private UUID id;

    @Column(name = "solicitacao_id", nullable = false)
    private UUID solicitacaoId;

    @Column(name = "usuario_id", nullable = false)
    private UUID usuarioId;

    @Column(nullable = false)
    private String acao;

    @Column(name = "status_de")
    private String statusDe;

    @Column(name = "status_para")
    private String statusPara;

    @Column(columnDefinition = "TEXT")
    private String detalhes;

    @CreationTimestamp
    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
