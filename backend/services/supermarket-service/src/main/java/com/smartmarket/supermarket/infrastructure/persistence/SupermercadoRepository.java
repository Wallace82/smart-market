package com.smartmarket.supermarket.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SupermercadoRepository extends JpaRepository<SupermercadoEntity, UUID> {
    List<SupermercadoEntity> findByGestorId(UUID gestorId);
    boolean existsByCnpj(String cnpj);
}
