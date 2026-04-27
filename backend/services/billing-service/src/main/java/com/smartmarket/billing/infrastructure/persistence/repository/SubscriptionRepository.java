package com.smartmarket.billing.infrastructure.persistence.repository;

import com.smartmarket.billing.infrastructure.persistence.entity.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, UUID> {
    Optional<SubscriptionEntity> findBySupermarketIdAndStatusIn(UUID supermarketId, java.util.List<String> statuses);
}
