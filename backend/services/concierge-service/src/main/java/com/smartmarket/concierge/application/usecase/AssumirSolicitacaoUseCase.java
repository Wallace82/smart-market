package com.smartmarket.concierge.application.usecase;

import com.smartmarket.concierge.domain.model.ConciergeStatus;
import com.smartmarket.concierge.domain.model.SolicitacaoConcierge;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeEntity;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeRepository;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.mapper.ConciergeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AssumirSolicitacaoUseCase {

    private final SolicitacaoConciergeRepository repository;
    private final ConciergeMapper mapper;

    public AssumirSolicitacaoUseCase(SolicitacaoConciergeRepository repository, ConciergeMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    /**
     * Tenta assumir uma solicitação garantindo que ela ainda esteja PENDENTE.
     * 
     * @param solicitacaoId ID da solicitação
     * @param atendenteId ID do atendente que está assumindo
     * @return Solicitacao atualizada
     * @throws IllegalStateException se a solicitação já tiver sido assumida por outro atendente
     */
    @Transactional
    public SolicitacaoConcierge execute(UUID solicitacaoId, UUID atendenteId) {
        SolicitacaoConciergeEntity entity = repository.findById(solicitacaoId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada: " + solicitacaoId));

        if (entity.getStatus() != ConciergeStatus.PENDENTE && entity.getStatus() != ConciergeStatus.REJEITADO) {
            throw new IllegalStateException("Esta solicitação não está disponível para atendimento.");
        }

        if (entity.getAtendenteId() != null) {
            throw new IllegalStateException("Esta solicitação já possui um atendente atribuído.");
        }

        // Aplica o Lock e atualiza status
        entity.setStatus(ConciergeStatus.EM_PROCESSAMENTO);
        entity.setAtendenteId(atendenteId);
        entity.setDataInicioProcessamento(LocalDateTime.now());
        entity.setLockAt(LocalDateTime.now());

        SolicitacaoConciergeEntity saved = repository.save(entity);
        return mapper.toDomain(saved);
    }
}
