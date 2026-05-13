package com.smartmarket.supermarket.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.supermarket.domain.model.Filial;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.FilialEntity;
import org.springframework.stereotype.Component;

@Component
public class FilialMapper {

    public Filial toDomain(FilialEntity entity) {
        if (entity == null) return null;
        Filial domain = new Filial();
        domain.setId(entity.getId());
        domain.setSupermercadoId(entity.getSupermercadoId());
        domain.setNome(entity.getNome());
        domain.setEndereco(entity.getEndereco());
        domain.setCep(entity.getCep());
        domain.setCidade(entity.getCidade());
        domain.setEstado(entity.getEstado());
        domain.setLatitude(entity.getLatitude());
        domain.setLongitude(entity.getLongitude());
        domain.setTelefone(entity.getTelefone());
        domain.setEmail(entity.getEmail());
        domain.setAtivo(entity.isAtivo());
        domain.setCriadoEm(entity.getCriadoEm());
        domain.setAtualizadoEm(entity.getAtualizadoEm());
        return domain;
    }

    public FilialEntity toEntity(Filial domain) {
        if (domain == null) return null;
        FilialEntity entity = new FilialEntity();
        entity.setId(domain.getId());
        entity.setSupermercadoId(domain.getSupermercadoId());
        entity.setNome(domain.getNome());
        entity.setEndereco(domain.getEndereco());
        entity.setCep(domain.getCep());
        entity.setCidade(domain.getCidade());
        entity.setEstado(domain.getEstado());
        entity.setLatitude(domain.getLatitude());
        entity.setLongitude(domain.getLongitude());
        entity.setTelefone(domain.getTelefone());
        entity.setEmail(domain.getEmail());
        entity.setAtivo(domain.isAtivo());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());
        return entity;
    }
}
