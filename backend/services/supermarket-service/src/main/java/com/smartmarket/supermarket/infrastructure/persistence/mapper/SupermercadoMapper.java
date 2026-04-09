package com.smartmarket.supermarket.infrastructure.persistence.mapper;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.infrastructure.persistence.SupermercadoEntity;
import org.springframework.stereotype.Component;

@Component
public class SupermercadoMapper {

    public Supermercado toDomain(SupermercadoEntity entity) {
        if (entity == null) {
            return null;
        }
        Supermercado domain = new Supermercado();
        domain.setId(entity.getId());
        domain.setNomeFantasia(entity.getNomeFantasia());
        domain.setCnpj(entity.getCnpj());
        domain.setStatus(entity.getStatus());
        domain.setEndereco(entity.getEndereco());
        domain.setLatitude(entity.getLatitude());
        domain.setLongitude(entity.getLongitude());
        domain.setRaioAtuacao(entity.getRaioAtuacao());
        domain.setGestorId(entity.getGestorId());
        
        domain.setUrlLogomarca(entity.getUrlLogomarca());
        domain.setCorPrimariaHex(entity.getCorPrimariaHex());
        domain.setCorSecundariaHex(entity.getCorSecundariaHex());
        
        domain.setCriadoEm(entity.getCriadoEm());
        domain.setAtualizadoEm(entity.getAtualizadoEm());
        return domain;
    }

    public SupermercadoEntity toEntity(Supermercado domain) {
        if (domain == null) {
            return null;
        }
        SupermercadoEntity entity = new SupermercadoEntity();
        entity.setId(domain.getId());
        entity.setNomeFantasia(domain.getNomeFantasia());
        entity.setCnpj(domain.getCnpj());
        entity.setStatus(domain.getStatus());
        entity.setEndereco(domain.getEndereco());
        entity.setLatitude(domain.getLatitude());
        entity.setLongitude(domain.getLongitude());
        entity.setRaioAtuacao(domain.getRaioAtuacao());
        entity.setGestorId(domain.getGestorId());
        
        entity.setUrlLogomarca(domain.getUrlLogomarca());
        entity.setCorPrimariaHex(domain.getCorPrimariaHex());
        entity.setCorSecundariaHex(domain.getCorSecundariaHex());

        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());
        return entity;
    }
}
