package com.smartmarket.product.infrastructure.persistence.mapper;

import com.smartmarket.product.domain.model.ProdutoBase;
import com.smartmarket.product.infrastructure.persistence.ProdutoBaseEntity;
import org.springframework.stereotype.Component;

@Component
public class ProdutoBaseMapper {

    public ProdutoBase toDomain(ProdutoBaseEntity entity) {
        if (entity == null) {
            return null;
        }
        ProdutoBase domain = new ProdutoBase();
        domain.setId(entity.getId());
        domain.setNome(entity.getNome());
        domain.setDescricao(entity.getDescricao());
        domain.setMarca(entity.getMarca());
        domain.setUnidadeMedida(entity.getUnidadeMedida());
        domain.setPesoVolume(entity.getPesoVolume());
        domain.setUrlImagem(entity.getUrlImagem());
        domain.setCategoriaId(entity.getCategoriaId());
        domain.setAtivo(entity.isAtivo());
        domain.setCriadoEm(entity.getCriadoEm());
        domain.setAtualizadoEm(entity.getAtualizadoEm());
        return domain;
    }

    public ProdutoBaseEntity toEntity(ProdutoBase domain) {
        if (domain == null) {
            return null;
        }
        ProdutoBaseEntity entity = new ProdutoBaseEntity();
        entity.setId(domain.getId());
        entity.setNome(domain.getNome());
        entity.setDescricao(domain.getDescricao());
        entity.setMarca(domain.getMarca());
        entity.setUnidadeMedida(domain.getUnidadeMedida());
        entity.setPesoVolume(domain.getPesoVolume());
        entity.setUrlImagem(domain.getUrlImagem());
        entity.setCategoriaId(domain.getCategoriaId());
        entity.setAtivo(domain.isAtivo());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());
        return entity;
    }
}
