package com.smartmarket.concierge.application.usecase;

import com.smartmarket.concierge.domain.model.ConciergeStatus;
import com.smartmarket.concierge.domain.model.SolicitacaoConcierge;
import com.smartmarket.concierge.domain.service.ConciergeStorageService;
import com.smartmarket.concierge.domain.service.PriorityCalculatorService;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.*;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.mapper.ConciergeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.UUID;

@Service
public class ReplicarSolicitacaoUseCase {

    private final SolicitacaoConciergeRepository solicitacaoRepository;
    private final AnexoConciergeRepository anexoRepository;
    private final AuditoriaConciergeRepository auditoriaRepository;
    private final ConciergeStorageService storageService;
    private final PriorityCalculatorService priorityCalculatorService;
    private final ConciergeMapper mapper;

    public ReplicarSolicitacaoUseCase(SolicitacaoConciergeRepository solicitacaoRepository,
                                      AnexoConciergeRepository anexoRepository,
                                      AuditoriaConciergeRepository auditoriaRepository,
                                      ConciergeStorageService storageService,
                                      PriorityCalculatorService priorityCalculatorService,
                                      ConciergeMapper mapper) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.anexoRepository = anexoRepository;
        this.auditoriaRepository = auditoriaRepository;
        this.storageService = storageService;
        this.priorityCalculatorService = priorityCalculatorService;
        this.mapper = mapper;
    }

    @Transactional
    public SolicitacaoConcierge execute(UUID solicitacaoId, UUID gestorId, String observacoesReplica,
                                       String fileName, InputStream inputStream,
                                       String contentType, Long size) {

        SolicitacaoConciergeEntity entity = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada: " + solicitacaoId));

        if (entity.getStatus() != ConciergeStatus.REJEITADO) {
            throw new IllegalStateException("Apenas solicitações rejeitadas podem receber réplicas.");
        }

        // Se um novo arquivo foi enviado na réplica, fazer o upload e vincular
        if (fileName != null && inputStream != null && contentType != null && size != null && size > 0) {
            String fileUrl = storageService.upload(fileName, inputStream, contentType, size);
            entity.setUrlArquivoOriginal(fileUrl);

            AnexoConciergeEntity anexo = AnexoConciergeEntity.builder()
                    .id(UUID.randomUUID())
                    .solicitacao(entity)
                    .nomeArquivo(fileName)
                    .urlMinio(fileUrl)
                    .tipoMime(contentType)
                    .tamanhoBytes(size)
                    .build();
            anexoRepository.save(anexo);
        }

        // Atualizar status e observações
        entity.setStatus(ConciergeStatus.PENDENTE);
        entity.setAtendenteId(null);
        entity.setLockAt(null);
        
        String novasObservacoes = entity.getObservacoes() != null ? entity.getObservacoes() : "";
        entity.setObservacoes(novasObservacoes + "\n[Gestor - Réplica]: " + observacoesReplica);

        // Recalcular pontuação de prioridade
        SolicitacaoConcierge domainModel = mapper.toDomain(entity);
        BigDecimal score = priorityCalculatorService.calcularScore(domainModel);
        entity.setPrioridadeScore(score);

        SolicitacaoConciergeEntity saved = solicitacaoRepository.save(entity);

        // Registro de Auditoria
        auditoriaRepository.save(AuditoriaConciergeEntity.builder()
                .id(UUID.randomUUID())
                .solicitacaoId(solicitacaoId)
                .usuarioId(gestorId)
                .acao("REPLICA_GESTOR")
                .statusDe("REJEITADO")
                .statusPara("PENDENTE")
                .detalhes("Gestor enviou uma réplica com novos detalhes e/ou arquivo. Feedback: " + observacoesReplica)
                .build());

        return mapper.toDomain(saved);
    }
}
