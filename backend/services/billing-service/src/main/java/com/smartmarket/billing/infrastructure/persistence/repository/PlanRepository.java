package com.smartmarket.billing.infrastructure.persistence.repository;

import com.smartmarket.billing.infrastructure.persistence.entity.PlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlanRepository extends JpaRepository<PlanEntity, UUID> {
    List<PlanEntity> findByActiveTrue();
}
