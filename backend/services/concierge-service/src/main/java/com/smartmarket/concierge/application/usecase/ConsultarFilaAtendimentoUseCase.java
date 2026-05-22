package com.smartmarket.concierge.application.usecase;

import com.smartmarket.concierge.application.dto.ConciergeQueueResponse;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeEntity;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultarFilaAtendimentoUseCase {

    private final SolicitacaoConciergeRepository repository;

    public ConsultarFilaAtendimentoUseCase(SolicitacaoConciergeRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ConciergeQueueResponse> execute() {
        List<SolicitacaoConciergeEntity> entities = repository.findTopPriorities();

        return entities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ConciergeQueueResponse mapToResponse(SolicitacaoConciergeEntity entity) {
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime deadline = entity.getDataCriacao().plusHours(entity.getSlaDefinidoHoras());
        
        long tempoEmFila = Duration.between(entity.getDataCriacao(), agora).toMinutes();
        long tempoRestante = Duration.between(agora, deadline).toMinutes();
        
        return ConciergeQueueResponse.builder()
                .id(entity.getId())
                .supermercadoId(entity.getSupermercadoId())
                .titulo(entity.getTitulo())
                .status(entity.getStatus())
                .score(entity.getPrioridadeScore())
                .faixaPrioridade(definirFaixaPrioridade(tempoRestante, entity.getSlaDefinidoHoras()))
                .dataCriacao(entity.getDataCriacao())
                .tempoEmFilaMinutos(tempoEmFila)
                .tempoRestanteSlaMinutos(tempoRestante)
                .complexidade(entity.getComplexidade())
                .plano(entity.getPlanoCliente())
                .atendenteId(entity.getAtendenteId())
                .urlArquivoOriginal(entity.getUrlArquivoOriginal())
                .observacoes(entity.getObservacoes())
                .encarteId(entity.getEncarteId())
                .build();
    }

    private String definirFaixaPrioridade(long tempoRestanteMinutos, int slaTotalHoras) {
        long slaTotalMinutos = (long) slaTotalHoras * 60;
        double ratio = (double) tempoRestanteMinutos / slaTotalMinutos;

        if (ratio <= 0.2) return "URGENTE";
        if (ratio <= 0.5) return "NORMAL";
        return "BAIXA";
    }
}
