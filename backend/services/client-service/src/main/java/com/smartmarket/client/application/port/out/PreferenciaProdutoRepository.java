package com.smartmarket.client.application.port.out;

import com.smartmarket.client.domain.model.PreferenciaProduto;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PreferenciaProdutoRepository {
    List<PreferenciaProduto> findAllByClienteAuthId(UUID clienteAuthId);
    Optional<PreferenciaProduto> findById(UUID id);
    Optional<PreferenciaProduto> findByClienteAuthIdAndProdutoBaseId(UUID clienteAuthId, UUID produtoBaseId);
    PreferenciaProduto save(PreferenciaProduto preferencia);
    void delete(UUID id);
}
