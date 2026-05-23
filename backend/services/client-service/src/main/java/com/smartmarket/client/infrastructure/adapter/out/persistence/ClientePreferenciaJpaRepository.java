package com.smartmarket.client.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClientePreferenciaJpaRepository extends JpaRepository<ClientePreferenciaEntity, UUID> {

    List<ClientePreferenciaEntity> findAllByClienteAuthIdOrderByCriadoEmDesc(UUID clienteAuthId);

    Optional<ClientePreferenciaEntity> findByClienteAuthIdAndProdutoBaseId(UUID clienteAuthId, UUID produtoBaseId);
}
