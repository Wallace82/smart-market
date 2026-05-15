package com.smartmarket.product.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.product.domain.model.TemaEncarte;
import com.smartmarket.product.infrastructure.adapter.out.persistence.TemaEncarteEntity;
import org.springframework.stereotype.Component;

@Component
public class TemaEncarteMapper {

    public TemaEncarteEntity toEntity(TemaEncarte domain) {
        if (domain == null) {
            return null;
        }
        TemaEncarteEntity entity = new TemaEncarteEntity();
        entity.setId(domain.getId());
        entity.setNome(domain.getNome());
        entity.setUrlBackgroundDecorativo(domain.getUrlBackgroundDecorativo());
        entity.setCorFundoHex(domain.getCorFundoHex());
        entity.setCorDestaqueHex(domain.getCorDestaqueHex());
        entity.setAtivo(domain.isAtivo());
        entity.setCriadoEm(domain.getCriadoEm());
        return entity;
    }

    public TemaEncarte toDomain(TemaEncarteEntity entity) {
        if (entity == null) {
            return null;
        }
        TemaEncarte domain = new TemaEncarte();
        domain.setId(entity.getId());
        domain.setNome(entity.getNome());
        domain.setUrlBackgroundDecorativo(entity.getUrlBackgroundDecorativo());
        domain.setCorFundoHex(entity.getCorFundoHex());
        domain.setCorDestaqueHex(entity.getCorDestaqueHex());
        domain.setAtivo(entity.isAtivo());
        domain.setCriadoEm(entity.getCriadoEm());
        return domain;
    }
}

