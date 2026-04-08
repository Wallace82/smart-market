package com.smartmarket.auth.infrastructure.persistence.mapper;

import com.smartmarket.auth.domain.model.Usuario;
import com.smartmarket.auth.infrastructure.persistence.UsuarioEntity;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UsuarioMapper {

    private final PapelMapper papelMapper;

    public UsuarioMapper(PapelMapper papelMapper) {
        this.papelMapper = papelMapper;
    }

    public Usuario toDomain(UsuarioEntity entity) {
        if (entity == null) {
            return null;
        }

        Usuario usuario = new Usuario();
        usuario.setId(entity.getId());
        usuario.setNome(entity.getNome());
        usuario.setEmail(entity.getEmail());
        usuario.setSenhaHash(entity.getSenhaHash());
        usuario.setStatus(entity.getStatus());
        usuario.setUltimoLoginEm(entity.getUltimoLoginEm());
        usuario.setCriadoEm(entity.getCriadoEm());
        usuario.setAtualizadoEm(entity.getAtualizadoEm());

        if (entity.getPapeis() != null) {
            usuario.setPapeis(entity.getPapeis().stream()
                    .map(papelMapper::toDomain)
                    .collect(Collectors.toSet()));
        }

        return usuario;
    }

    public UsuarioEntity toEntity(Usuario domain) {
        if (domain == null) {
            return null;
        }

        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(domain.getId());
        entity.setNome(domain.getNome());
        entity.setEmail(domain.getEmail());
        entity.setSenhaHash(domain.getSenhaHash());
        entity.setStatus(domain.getStatus());
        entity.setUltimoLoginEm(domain.getUltimoLoginEm());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());

        if (domain.getPapeis() != null) {
            entity.setPapeis(domain.getPapeis().stream()
                    .map(papelMapper::toEntity)
                    .collect(Collectors.toSet()));
        }

        return entity;
    }
}
