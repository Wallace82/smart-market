package com.smartmarket.product.domain.repository;

import com.smartmarket.product.domain.model.OfertaSupermercado;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OfertaDomainRepository {
    Optional<OfertaSupermercado> findById(UUID id);
    List<OfertaSupermercado> findBySupermercadoId(UUID supermercadoId);
    boolean existsBySupermercadoIdAndProdutoBaseIdAndAtivoTrue(UUID supermercadoId, UUID produtoBaseId);
    OfertaSupermercado save(OfertaSupermercado oferta);
}
