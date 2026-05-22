package com.smartmarket.concierge.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.concierge.domain.model.SolicitacaoConcierge;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeEntity;
import org.springframework.stereotype.Component;

@Component
public class ConciergeMapper {

    public SolicitacaoConciergeEntity toEntity(SolicitacaoConcierge domain) {
        if (domain == null) return null;
        return SolicitacaoConciergeEntity.builder()
                .id(domain.getId())
                .supermercadoId(domain.getSupermercadoId())
                .atendenteId(domain.getAtendenteId())
                .titulo(domain.getTitulo())
                .status(domain.getStatus())
                .slaDefinidoHoras(domain.getSlaDefinidoHoras())
                .prioridadeScore(domain.getPrioridadeScore())
                .complexidade(domain.getComplexidade())
                .planoCliente(domain.getPlanoCliente())
                .dataCriacao(domain.getDataCriacao())
                .dataInicioProcessamento(domain.getDataInicioProcessamento())
                .dataConclusao(domain.getDataConclusao())
                 .lockAt(domain.getLockAt())
                .urlArquivoOriginal(domain.getUrlArquivoOriginal())
                .observacoes(domain.getObservacoes())
                .encarteId(domain.getEncarteId())
                .build();
    }

    public SolicitacaoConcierge toDomain(SolicitacaoConciergeEntity entity) {
        if (entity == null) return null;
        return SolicitacaoConcierge.builder()
                .id(entity.getId())
                .supermercadoId(entity.getSupermercadoId())
                .atendenteId(entity.getAtendenteId())
                .titulo(entity.getTitulo())
                .status(entity.getStatus())
                .slaDefinidoHoras(entity.getSlaDefinidoHoras())
                .prioridadeScore(entity.getPrioridadeScore())
                .complexidade(entity.getComplexidade())
                .planoCliente(entity.getPlanoCliente())
                .dataCriacao(entity.getDataCriacao())
                .dataInicioProcessamento(entity.getDataInicioProcessamento())
                .dataConclusao(entity.getDataConclusao())
                .lockAt(entity.getLockAt())
                .urlArquivoOriginal(entity.getUrlArquivoOriginal())
                .observacoes(entity.getObservacoes())
                .encarteId(entity.getEncarteId())
                .build();
    }
}
