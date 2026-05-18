package com.smartmarket.billing.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlanoRepository extends JpaRepository<PlanoEntity, UUID> {
    List<PlanoEntity> findByAtivoTrue();
}
