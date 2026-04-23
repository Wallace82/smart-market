package com.smartmarket.product.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EncarteDigitalRepository extends JpaRepository<EncarteDigitalEntity, UUID> {
    List<EncarteDigitalEntity> findBySupermercadoId(UUID supermercadoId);
}

