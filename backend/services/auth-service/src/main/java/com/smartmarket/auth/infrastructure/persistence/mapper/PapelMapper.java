package com.smartmarket.auth.infrastructure.persistence.mapper;

import com.smartmarket.auth.domain.model.Papel;
import com.smartmarket.auth.infrastructure.persistence.PapelEntity;
import org.springframework.stereotype.Component;

@Component
public class PapelMapper {

    public Papel toDomain(PapelEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Papel(
            entity.getId(),
            entity.getNome(),
            entity.getDescricao()
        );
    }

    public PapelEntity toEntity(Papel domain) {
        if (domain == null) {
            return null;
        }
        PapelEntity entity = new PapelEntity();
        entity.setId(domain.getId());
        entity.setNome(domain.getNome());
        entity.setDescricao(domain.getDescricao());
        return entity;
    }
}
