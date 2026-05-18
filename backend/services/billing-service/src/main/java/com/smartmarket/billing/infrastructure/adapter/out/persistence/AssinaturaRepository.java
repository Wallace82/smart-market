package com.smartmarket.billing.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssinaturaRepository extends JpaRepository<AssinaturaEntity, UUID> {
    Optional<AssinaturaEntity> findBySupermercadoId(UUID supermercadoId);
}
