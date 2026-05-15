package com.smartmarket.concierge.infrastructure.adapter.in.scheduler;

import com.smartmarket.concierge.application.usecase.RecalcularScoresUseCase;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PriorityRecalculationScheduler {

    private final RecalcularScoresUseCase recalcularScoresUseCase;

    public PriorityRecalculationScheduler(RecalcularScoresUseCase recalcularScoresUseCase) {
        this.recalcularScoresUseCase = recalcularScoresUseCase;
    }

    /**
     * Executa o recalculo a cada 1 minuto (conforme definido no REQUIREMENTS.md)
     */
    @Scheduled(fixedRateString = "${concierge.scheduler.recalculation-rate-ms:60000}")
    public void runRecalculation() {
        recalcularScoresUseCase.execute();
    }
}
