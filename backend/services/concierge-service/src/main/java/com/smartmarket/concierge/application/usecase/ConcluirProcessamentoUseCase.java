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
public class ConcluirProcessamentoUseCase {

    private final SolicitacaoConciergeRepository repository;
    private final AuditoriaConciergeRepository auditoriaRepository;
    private final ConciergeMapper mapper;

    public ConcluirProcessamentoUseCase(SolicitacaoConciergeRepository repository, 
                                        AuditoriaConciergeRepository auditoriaRepository, 
                                        ConciergeMapper mapper) {
        this.repository = repository;
        this.auditoriaRepository = auditoriaRepository;
        this.mapper = mapper;
    }

    @Transactional
    public SolicitacaoConcierge execute(UUID solicitacaoId, UUID atendenteId, String observacoesAtendente) {
        SolicitacaoConciergeEntity entity = repository.findById(solicitacaoId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada: " + solicitacaoId));

        if (entity.getStatus() != ConciergeStatus.EM_PROCESSAMENTO) {
            throw new IllegalStateException("Apenas solicitações em processamento podem ser concluídas.");
        }

        if (!entity.getAtendenteId().equals(atendenteId)) {
            throw new IllegalStateException("Esta solicitação está atribuída a outro atendente.");
        }

        entity.setStatus(ConciergeStatus.AGUARDANDO_APROVACAO);
        entity.setObservacoes(entity.getObservacoes() + "\n[Atendente]: " + observacoesAtendente);

        SolicitacaoConciergeEntity saved = repository.save(entity);

        // Registro de Auditoria
        auditoriaRepository.save(AuditoriaConciergeEntity.builder()
                .id(UUID.randomUUID())
                .solicitacaoId(solicitacaoId)
                .usuarioId(atendenteId)
                .acao("CONCLUSAO_PROCESSAMENTO")
                .statusDe("EM_PROCESSAMENTO")
                .statusPara("AGUARDANDO_APROVACAO")
                .detalhes("Atendente concluiu o cadastro e enviou para aprovação do gestor.")
                .build());

        return mapper.toDomain(saved);
    }
}
