package com.smartmarket.notification.infrastructure.adapter.out.persistence;

import com.smartmarket.notification.application.port.out.PushSubscriptionRepositoryPort;
import com.smartmarket.notification.domain.model.PushSubscription;
import com.smartmarket.notification.infrastructure.adapter.out.persistence.mapper.PushSubscriptionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class PushSubscriptionPersistenceAdapter implements PushSubscriptionRepositoryPort {

    private final SpringDataPushSubscriptionRepository jpaRepository;
    private final PushSubscriptionMapper mapper;

    @Override
    public PushSubscription save(PushSubscription subscription) {
        PushSubscriptionEntity entity = mapper.toEntity(subscription);
        PushSubscriptionEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<PushSubscription> findByClientId(UUID clientId) {
        return jpaRepository.findByClientId(clientId)
                .map(mapper::toDomain);
    }

    @Override
    public List<PushSubscription> findAllByClientId(UUID clientId) {
        return jpaRepository.findAllByClientId(clientId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PushSubscription> findByEndpoint(String endpoint) {
        return jpaRepository.findByEndpoint(endpoint)
                .map(mapper::toDomain);
    }

    @Override
    public void delete(PushSubscription subscription) {
        jpaRepository.delete(mapper.toEntity(subscription));
    }
}
