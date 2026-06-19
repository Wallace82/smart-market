package com.smartmarket.notification.infrastructure.adapter.out.persistence;

import com.smartmarket.notification.application.port.out.NotificationDeliveryRepositoryPort;
import com.smartmarket.notification.domain.model.NotificationDelivery;
import com.smartmarket.notification.infrastructure.adapter.out.persistence.mapper.NotificationDeliveryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class NotificationDeliveryPersistenceAdapter implements NotificationDeliveryRepositoryPort {

    private final SpringDataNotificationDeliveryRepository jpaRepository;
    private final NotificationDeliveryMapper mapper;

    @Override
    public NotificationDelivery save(NotificationDelivery delivery) {
        NotificationDeliveryEntity entity = mapper.toEntity(delivery);
        NotificationDeliveryEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public List<NotificationDelivery> findHistory(UUID campaignId, UUID clientId, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return jpaRepository.findHistoryFiltered(campaignId, clientId, status, pageable).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long countHistory(UUID campaignId, UUID clientId, String status) {
        Pageable pageable = Pageable.unpaged();
        return jpaRepository.findHistoryFiltered(campaignId, clientId, status, pageable).getTotalElements();
    }

    @Override
    public boolean existsDuplicate(UUID campaignId, UUID clientId, String messageHash) {
        return jpaRepository.existsByCampaignIdAndClientIdAndMessageHashAndStatus(
                campaignId, clientId, messageHash, "ENVIADA"
        );
    }

    @Override
    public long countDeliveriesToday(UUID clientId, UUID campaignId) {
        // Limite inferior do dia (meia-noite)
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        return jpaRepository.countByClientIdAndCampaignIdAndSentAtAfter(clientId, campaignId, startOfDay);
    }
}
