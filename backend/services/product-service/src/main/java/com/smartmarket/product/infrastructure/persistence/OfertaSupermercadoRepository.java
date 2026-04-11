package com.smartmarket.product.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OfertaSupermercadoRepository extends JpaRepository<OfertaSupermercadoEntity, UUID> {
    List<OfertaSupermercadoEntity> findBySupermercadoId(UUID supermercadoId);
}
