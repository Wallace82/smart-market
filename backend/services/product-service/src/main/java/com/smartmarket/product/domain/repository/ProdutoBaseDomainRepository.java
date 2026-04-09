package com.smartmarket.product.domain.repository;

import com.smartmarket.product.domain.model.ProdutoBase;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProdutoBaseDomainRepository {
    Optional<ProdutoBase> findById(UUID id);
    List<ProdutoBase> findAll(int page, int size);
    List<ProdutoBase> findByNomeContainingIgnoreCase(String nome);
    ProdutoBase save(ProdutoBase produto);
    void deleteById(UUID id);
}
