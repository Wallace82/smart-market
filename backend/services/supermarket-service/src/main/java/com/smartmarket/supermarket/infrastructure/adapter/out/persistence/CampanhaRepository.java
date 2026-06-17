package com.smartmarket.supermarket.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CampanhaRepository extends JpaRepository<CampanhaEntity, UUID> {
    List<CampanhaEntity> findBySupermercadoId(UUID supermercadoId);
}
