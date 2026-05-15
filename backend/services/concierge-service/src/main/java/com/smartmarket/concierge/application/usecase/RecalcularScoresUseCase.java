package com.smartmarket.concierge.application.usecase;

import com.smartmarket.concierge.domain.model.ConciergeStatus;
import com.smartmarket.concierge.domain.model.SolicitacaoConcierge;
import com.smartmarket.concierge.domain.service.PriorityCalculatorService;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeEntity;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeRepository;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.mapper.ConciergeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
public class RecalcularScoresUseCase {

    private static final Logger logger = LoggerFactory.getLogger(RecalcularScoresUseCase.class);

    private final SolicitacaoConciergeRepository repository;
    private final PriorityCalculatorService calculatorService;
    private final ConciergeMapper mapper;

    public RecalcularScoresUseCase(SolicitacaoConciergeRepository repository,
                                   PriorityCalculatorService calculatorService,
                                   ConciergeMapper mapper) {
        this.repository = repository;
        this.calculatorService = calculatorService;
        this.mapper = mapper;
    }

    @Transactional
    public void execute() {
        logger.info("Iniciando recalculo periodico de scores de prioridade...");

        List<ConciergeStatus> statusesToUpdate = Arrays.asList(
                ConciergeStatus.PENDENTE, 
                ConciergeStatus.EM_PROCESSAMENTO
        );

        List<SolicitacaoConciergeEntity> solicitacoes = repository.findAll().stream()
                .filter(s -> statusesToUpdate.contains(s.getStatus()))
                .toList();

        for (SolicitacaoConciergeEntity entity : solicitacoes) {
            SolicitacaoConcierge domain = mapper.toDomain(entity);
            BigDecimal novoScore = calculatorService.calcularScore(domain);
            
            if (entity.getPrioridadeScore() == null || novoScore.compareTo(entity.getPrioridadeScore()) != 0) {
                entity.setPrioridadeScore(novoScore);
                repository.save(entity);
                logger.debug("Score da solicitacao {} atualizado para {}", entity.getId(), novoScore);
            }
        }

        logger.info("Recalculo finalizado. {} solicitacoes atualizadas.", solicitacoes.size());
    }
}
