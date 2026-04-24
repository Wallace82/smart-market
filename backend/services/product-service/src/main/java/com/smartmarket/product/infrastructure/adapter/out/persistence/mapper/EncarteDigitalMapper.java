package com.smartmarket.product.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.infrastructure.adapter.out.persistence.EncarteDigitalEntity;
import com.smartmarket.product.infrastructure.adapter.out.persistence.EncarteItemEntity;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class EncarteDigitalMapper {

    public EncarteDigitalEntity toEntity(EncarteDigital domain) {
        if (domain == null) return null;
        EncarteDigitalEntity entity = new EncarteDigitalEntity();
        entity.setId(domain.getId());
        entity.setSupermercadoId(domain.getSupermercadoId());
        entity.setTemaId(domain.getTemaId());
        entity.setTitulo(domain.getTitulo());
        entity.setDataInicio(domain.getDataInicio());
        entity.setDataFim(domain.getDataFim());
        entity.setStatus(domain.getStatus());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());

        if (domain.getItens() != null) {
            entity.setItens(domain.getItens().stream().map(this::toItemEntity).collect(Collectors.toList()));
            entity.getItens().forEach(item -> item.setEncarteDigital(entity));
        }

        return entity;
    }

    public EncarteDigital toDomain(EncarteDigitalEntity entity) {
        if (entity == null) return null;
        EncarteDigital domain = new EncarteDigital();
        domain.setId(entity.getId());
        domain.setSupermercadoId(entity.getSupermercadoId());
        domain.setTemaId(entity.getTemaId());
        domain.setTitulo(entity.getTitulo());
        domain.setDataInicio(entity.getDataInicio());
        domain.setDataFim(entity.getDataFim());
        domain.setStatus(entity.getStatus());
        domain.setCriadoEm(entity.getCriadoEm());
        domain.setAtualizadoEm(entity.getAtualizadoEm());

        if (entity.getItens() != null) {
            domain.setItens(entity.getItens().stream().map(this::toItemDomain).collect(Collectors.toList()));
        }

        return domain;
    }

    public EncarteItemEntity toItemEntity(EncarteItem domain) {
        if (domain == null) return null;
        EncarteItemEntity entity = new EncarteItemEntity();
        entity.setId(domain.getId());
        entity.setOfertaId(domain.getOfertaId());
        entity.setOrdemExibicao(domain.getOrdemExibicao());
        entity.setDestaque(domain.isDestaque());
        // encarteDigital is set in toEntity
        return entity;
    }

    public EncarteItem toItemDomain(EncarteItemEntity entity) {
        if (entity == null) return null;
        EncarteItem domain = new EncarteItem();
        domain.setId(entity.getId());
        if (entity.getEncarteDigital() != null) {
            domain.setEncarteId(entity.getEncarteDigital().getId());
        }
        domain.setOfertaId(entity.getOfertaId());
        domain.setOrdemExibicao(entity.getOrdemExibicao());
        domain.setDestaque(entity.isDestaque());
        return domain;
    }
}

