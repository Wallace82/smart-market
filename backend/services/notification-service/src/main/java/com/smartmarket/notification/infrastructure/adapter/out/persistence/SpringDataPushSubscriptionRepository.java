package com.smartmarket.notification.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataPushSubscriptionRepository extends JpaRepository<PushSubscriptionEntity, UUID> {
    Optional<PushSubscriptionEntity> findByClientId(UUID clientId);
    List<PushSubscriptionEntity> findAllByClientId(UUID clientId);
    Optional<PushSubscriptionEntity> findByEndpoint(String endpoint);
}
