package com.smartmarket.auth.domain.repository;

import com.smartmarket.auth.domain.model.Usuario;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioDomainRepository {
    Optional<Usuario> findById(UUID id);
    Optional<Usuario> findByEmail(String email);
    Usuario save(Usuario usuario);
}
