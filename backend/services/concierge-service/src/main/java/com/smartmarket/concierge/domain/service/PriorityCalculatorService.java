package com.smartmarket.concierge.domain.service;

import com.smartmarket.concierge.domain.model.SolicitacaoConcierge;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Serviço de domínio responsável pelo cálculo dinâmico do Score de Prioridade.
 * 
 * Fórmula: Score = (W1 * Urgência) + (W2 * Plano) + (W3 * Espera) - (W4 * Complexidade)
 */
@Service
public class PriorityCalculatorService {

    @Value("${concierge.pesos.sla:0.4}")
    private double pesoSla;

    @Value("${concierge.pesos.plano:0.3}")
    private double pesoPlano;

    @Value("${concierge.pesos.tempo:0.2}")
    private double pesoTempo;

    @Value("${concierge.pesos.complexidade:0.1}")
    private double pesoComplexidade;

    public BigDecimal calcularScore(SolicitacaoConcierge solicitacao) {
        double urgencia = calcularUrgencia(solicitacao);
        double prioridadePlano = converterPlanoParaPrioridade(solicitacao.getPlanoCliente());
        double tempoEspera = calcularFatorTempoEspera(solicitacao);
        double complexidade = solicitacao.getComplexidade() != null ? solicitacao.getComplexidade() : 1.0;

        double score = (pesoSla * urgencia)
                     + (pesoPlano * prioridadePlano)
                     + (pesoTempo * tempoEspera)
                     - (pesoComplexidade * complexidade);

        return BigDecimal.valueOf(score).setScale(4, RoundingMode.HALF_UP);
    }

    /**
     * Urgência aumenta à medida que o tempo para o SLA diminui.
     * 0.0 (início) -> 1.0 (deadline atingido ou ultrapassado)
     */
    private double calcularUrgencia(SolicitacaoConcierge solicitacao) {
        LocalDateTime deadline = solicitacao.getDataCriacao().plusHours(solicitacao.getSlaDefinidoHoras());
        LocalDateTime agora = LocalDateTime.now();
        
        if (agora.isAfter(deadline)) return 1.5; // Bônus de urgência para chamados atrasados

        Duration tempoRestante = Duration.between(agora, deadline);
        Duration tempoTotal = Duration.ofHours(solicitacao.getSlaDefinidoHoras());

        double ratio = (double) tempoRestante.toMinutes() / tempoTotal.toMinutes();
        return Math.max(0, 1.0 - ratio);
    }

    private double converterPlanoParaPrioridade(String plano) {
        if (plano == null) return 1.0;
        return switch (plano.toUpperCase()) {
            case "PREMIUM" -> 3.0;
            case "PRO" -> 2.0;
            default -> 1.0;
        };
    }

    /**
     * Fator de espera para evitar starvation.
     * Incrementa o score proporcionalmente ao tempo em fila.
     */
    private double calcularFatorTempoEspera(SolicitacaoConcierge solicitacao) {
        Duration espera = Duration.between(solicitacao.getDataCriacao(), LocalDateTime.now());
        // Normaliza: ganha 1.0 de score a cada 12 horas de espera
        return (double) espera.toMinutes() / 720.0;
    }
}
