package com.smartmarket.concierge.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AnexoConciergeRepository extends JpaRepository<AnexoConciergeEntity, UUID> {
}
