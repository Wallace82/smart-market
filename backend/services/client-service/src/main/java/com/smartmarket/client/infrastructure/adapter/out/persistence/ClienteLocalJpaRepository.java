package com.smartmarket.client.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClienteLocalJpaRepository extends JpaRepository<ClienteLocalEntity, UUID> {

    List<ClienteLocalEntity> findAllByClienteAuthIdOrderByCriadoEmDesc(UUID clienteAuthId);

    Optional<ClienteLocalEntity> findByClienteAuthIdAndAtivoTrue(UUID clienteAuthId);

    int countByClienteAuthId(UUID clienteAuthId);

    @Modifying
    @Query("UPDATE ClienteLocalEntity e SET e.ativo = false WHERE e.clienteAuthId = :clienteAuthId")
    void desativarTodosDoCliente(@Param("clienteAuthId") UUID clienteAuthId);
}
