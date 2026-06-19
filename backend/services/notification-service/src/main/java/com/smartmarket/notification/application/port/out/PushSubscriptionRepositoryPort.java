package com.smartmarket.notification.application.port.out;

import com.smartmarket.notification.domain.model.PushSubscription;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PushSubscriptionRepositoryPort {
    PushSubscription save(PushSubscription subscription);
    Optional<PushSubscription> findByClientId(UUID clientId);
    List<PushSubscription> findAllByClientId(UUID clientId);
    Optional<PushSubscription> findByEndpoint(String endpoint);
    void delete(PushSubscription subscription);
}
