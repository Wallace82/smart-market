package com.smartmarket.client.application.port.out;

import com.smartmarket.client.domain.model.LocalFavorito;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LocalFavoritoRepository {
    List<LocalFavorito> findAllByClienteAuthId(UUID clienteAuthId);
    Optional<LocalFavorito> findById(UUID id);
    Optional<LocalFavorito> findAtivoByClienteAuthId(UUID clienteAuthId);
    LocalFavorito save(LocalFavorito local);
    void delete(UUID id);
    void desativarTodos(UUID clienteAuthId);
    int countByClienteAuthId(UUID clienteAuthId);
}
