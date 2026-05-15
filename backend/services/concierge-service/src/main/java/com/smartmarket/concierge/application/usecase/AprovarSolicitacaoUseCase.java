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

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AprovarSolicitacaoUseCase {

    private final SolicitacaoConciergeRepository repository;
    private final AuditoriaConciergeRepository auditoriaRepository;
    private final ConciergeMapper mapper;

    public AprovarSolicitacaoUseCase(SolicitacaoConciergeRepository repository, 
                                     AuditoriaConciergeRepository auditoriaRepository, 
                                     ConciergeMapper mapper) {
        this.repository = repository;
        this.auditoriaRepository = auditoriaRepository;
        this.mapper = mapper;
    }

    @Transactional
    public SolicitacaoConcierge execute(UUID solicitacaoId, UUID gestorId) {
        SolicitacaoConciergeEntity entity = repository.findById(solicitacaoId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada: " + solicitacaoId));

        if (entity.getStatus() != ConciergeStatus.AGUARDANDO_APROVACAO) {
            throw new IllegalStateException("Apenas solicitações aguardando aprovação podem ser aprovadas.");
        }

        entity.setStatus(ConciergeStatus.APROVADO);
        entity.setDataConclusao(LocalDateTime.now());

        SolicitacaoConciergeEntity saved = repository.save(entity);

        // Registro de Auditoria
        auditoriaRepository.save(AuditoriaConciergeEntity.builder()
                .id(UUID.randomUUID())
                .solicitacaoId(solicitacaoId)
                .usuarioId(gestorId)
                .acao("APROVACAO_GESTOR")
                .statusDe("AGUARDANDO_APROVACAO")
                .statusPara("APROVADO")
                .detalhes("Gestor aprovou o cadastro das ofertas.")
                .build());

        return mapper.toDomain(saved);
    }
}
