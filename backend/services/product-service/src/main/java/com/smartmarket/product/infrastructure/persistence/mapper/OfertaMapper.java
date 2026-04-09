package com.smartmarket.product.infrastructure.persistence.mapper;

import com.smartmarket.product.domain.model.OfertaSupermercado;
import com.smartmarket.product.infrastructure.persistence.OfertaSupermercadoEntity;
import org.springframework.stereotype.Component;

@Component
public class OfertaMapper {

    private final ProdutoBaseMapper produtoBaseMapper;

    public OfertaMapper(ProdutoBaseMapper produtoBaseMapper) {
        this.produtoBaseMapper = produtoBaseMapper;
    }

    public OfertaSupermercado toDomain(OfertaSupermercadoEntity entity) {
        if (entity == null) {
            return null;
        }
        OfertaSupermercado domain = new OfertaSupermercado();
        domain.setId(entity.getId());
        domain.setSupermercadoId(entity.getSupermercadoId());
        domain.setProdutoBase(produtoBaseMapper.toDomain(entity.getProdutoBase()));
        domain.setPrecoAtual(entity.getPrecoAtual());
        domain.setPrecoPromocional(entity.getPrecoPromocional());
        domain.setDataInicioPromocao(entity.getDataInicioPromocao());
        domain.setDataFimPromocao(entity.getDataFimPromocao());
        domain.setAtivo(entity.isAtivo());
        domain.setCriadoEm(entity.getCriadoEm());
        domain.setAtualizadoEm(entity.getAtualizadoEm());
        return domain;
    }

    public OfertaSupermercadoEntity toEntity(OfertaSupermercado domain) {
        if (domain == null) {
            return null;
        }
        OfertaSupermercadoEntity entity = new OfertaSupermercadoEntity();
        entity.setId(domain.getId());
        entity.setSupermercadoId(domain.getSupermercadoId());
        entity.setProdutoBase(produtoBaseMapper.toEntity(domain.getProdutoBase()));
        entity.setPrecoAtual(domain.getPrecoAtual());
        entity.setPrecoPromocional(domain.getPrecoPromocional());
        entity.setDataInicioPromocao(domain.getDataInicioPromocao());
        entity.setDataFimPromocao(domain.getDataFimPromocao());
        entity.setAtivo(domain.isAtivo());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());
        return entity;
    }
}
