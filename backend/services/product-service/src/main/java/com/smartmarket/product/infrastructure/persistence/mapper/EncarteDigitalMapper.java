package com.smartmarket.product.infrastructure.persistence.mapper;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.infrastructure.persistence.EncarteDigitalEntity;
import com.smartmarket.product.infrastructure.persistence.EncarteItemEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class EncarteDigitalMapper {

    public EncarteDigitalEntity toEntity(EncarteDigital domain) {
        if (domain == null) {
            return null;
        }
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

        Optional.ofNullable(domain.getItens()).orElse(Collections.emptyList()).stream()
                .map(itemDomain -> toItemEntity(itemDomain, entity))
                .collect(Collectors.toList())
                .forEach(entity::addEncarteItem); // Supondo um método addEncarteItem na entidade

        return entity;
    }

    public EncarteDigital toDomain(EncarteDigitalEntity entity) {
        if (entity == null) {
            return null;
        }
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
        domain.setItens(Optional.ofNullable(entity.getItens()).orElse(Collections.emptyList()).stream()
                .map(this::toItemDomain)
                .collect(Collectors.toList()));
        return domain;
    }

    public EncarteItemEntity toItemEntity(EncarteItem domain, EncarteDigitalEntity encarteDigitalEntity) {
        if (domain == null) {
            return null;
        }
        EncarteItemEntity entity = new EncarteItemEntity();
        entity.setId(domain.getId());
        entity.setEncarteDigital(encarteDigitalEntity);
        entity.setOfertaId(domain.getOfertaId());
        entity.setOrdemExibicao(domain.getOrdemExibicao());
        entity.setDestaque(domain.isDestaque());
        return entity;
    }

    public EncarteItem toItemDomain(EncarteItemEntity entity) {
        if (entity == null) {
            return null;
        }
        EncarteItem domain = new EncarteItem();
        domain.setId(entity.getId());
        domain.setEncarteId(entity.getEncarteDigital().getId()); // Associa o ID do encarte
        domain.setOfertaId(entity.getOfertaId());
        domain.setOrdemExibicao(entity.getOrdemExibicao());
        domain.setDestaque(entity.isDestaque());
        return domain;
    }
}
