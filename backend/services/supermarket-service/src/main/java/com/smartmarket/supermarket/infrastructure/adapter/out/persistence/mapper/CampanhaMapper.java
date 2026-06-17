package com.smartmarket.supermarket.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.supermarket.domain.model.Campanha;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.CampanhaEntity;
import org.springframework.stereotype.Component;

@Component
public class CampanhaMapper {

    public Campanha toDomain(CampanhaEntity entity) {
        if (entity == null) return null;
        Campanha domain = new Campanha();
        domain.setId(entity.getId());
        domain.setSupermercadoId(entity.getSupermercadoId());
        domain.setNome(entity.getNome());
        domain.setSegmento(entity.getSegmento());
        domain.setRaio(entity.getRaio());
        domain.setStatus(entity.getStatus());
        domain.setPushesEnviados(entity.getPushesEnviados());
        domain.setConversoes(entity.getConversoes());
        domain.setCriadoEm(entity.getCriadoEm());
        return domain;
    }

    public CampanhaEntity toEntity(Campanha domain) {
        if (domain == null) return null;
        CampanhaEntity entity = new CampanhaEntity();
        entity.setId(domain.getId());
        entity.setSupermercadoId(domain.getSupermercadoId());
        entity.setNome(domain.getNome());
        entity.setSegmento(domain.getSegmento());
        entity.setRaio(domain.getRaio());
        entity.setStatus(domain.getStatus());
        entity.setPushesEnviados(domain.getPushesEnviados());
        entity.setConversoes(domain.getConversoes());
        entity.setCriadoEm(domain.getCriadoEm());
        return entity;
    }
}
