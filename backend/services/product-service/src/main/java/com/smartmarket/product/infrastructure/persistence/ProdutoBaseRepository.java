package com.smartmarket.product.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProdutoBaseRepository extends JpaRepository<ProdutoBaseEntity, UUID> {
    List<ProdutoBaseEntity> findByNomeContainingIgnoreCase(String nome);
}
