package com.smartmarket.auth.infrastructure.persistence.adapter;

import com.smartmarket.auth.domain.model.Usuario;
import com.smartmarket.auth.domain.repository.UsuarioDomainRepository;
import com.smartmarket.auth.infrastructure.persistence.UsuarioEntity;
import com.smartmarket.auth.infrastructure.persistence.UsuarioRepository;
import com.smartmarket.auth.infrastructure.persistence.mapper.UsuarioMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class UsuarioRepositoryAdapter implements UsuarioDomainRepository {

    private final UsuarioRepository jpaRepository;
    private final UsuarioMapper mapper;

    public UsuarioRepositoryAdapter(UsuarioRepository jpaRepository, UsuarioMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Usuario> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(mapper::toDomain);
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioEntity entity = mapper.toEntity(usuario);
        UsuarioEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }
}
