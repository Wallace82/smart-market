package com.smartmarket.client.application.port.in;

import com.smartmarket.client.domain.model.LocalFavorito;

import java.util.List;
import java.util.UUID;

public interface GerenciarLocaisPort {
    List<LocalFavorito> listar(UUID clienteAuthId);
    LocalFavorito salvar(UUID clienteAuthId, LocalFavorito local);
    void remover(UUID clienteAuthId, UUID localId);
    LocalFavorito definirAtivo(UUID clienteAuthId, UUID localId);
}
