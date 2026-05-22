package com.smartmarket.concierge.application.usecase;

import com.smartmarket.concierge.domain.model.ConciergeStatus;
import com.smartmarket.concierge.domain.model.SolicitacaoConcierge;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.AuditoriaConciergeEntity;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.AuditoriaConciergeRepository;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeEntity;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeRepository;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.mapper.ConciergeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class RejeitarSolicitacaoUseCase {

    private final SolicitacaoConciergeRepository repository;
    private final AuditoriaConciergeRepository auditoriaRepository;
    private final ConciergeMapper mapper;

    public RejeitarSolicitacaoUseCase(SolicitacaoConciergeRepository repository,
                                      AuditoriaConciergeRepository auditoriaRepository,
                                      ConciergeMapper mapper) {
        this.repository = repository;
        this.auditoriaRepository = auditoriaRepository;
        this.mapper = mapper;
    }

    @Transactional
    public SolicitacaoConcierge execute(UUID solicitacaoId, UUID gestorId, String observacoesGestor) {
        SolicitacaoConciergeEntity entity = repository.findById(solicitacaoId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada: " + solicitacaoId));

        if (entity.getStatus() != ConciergeStatus.AGUARDANDO_APROVACAO) {
            throw new IllegalStateException("Apenas solicitações aguardando aprovação podem ser rejeitadas.");
        }

        entity.setStatus(ConciergeStatus.REJEITADO);
        entity.setAtendenteId(null);
        entity.setLockAt(null);
        entity.setObservacoes(entity.getObservacoes() + "\n[Gestor - Rejeitado]: " + observacoesGestor);

        SolicitacaoConciergeEntity saved = repository.save(entity);

        // Registro de Auditoria
        auditoriaRepository.save(AuditoriaConciergeEntity.builder()
                .id(UUID.randomUUID())
                .solicitacaoId(solicitacaoId)
                .usuarioId(gestorId)
                .acao("REJEICAO_GESTOR")
                .statusDe("AGUARDANDO_APROVACAO")
                .statusPara("REJEITADO")
                .detalhes("Gestor rejeitou o cadastro e solicitou correções. Feedback: " + observacoesGestor)
                .build());

        return mapper.toDomain(saved);
    }
}
