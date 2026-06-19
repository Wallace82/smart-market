package com.smartmarket.notification.application.port.out;

import com.smartmarket.notification.domain.model.NotificationDelivery;

import java.util.List;
import java.util.UUID;

public interface NotificationDeliveryRepositoryPort {
    NotificationDelivery save(NotificationDelivery delivery);
    List<NotificationDelivery> findHistory(UUID campaignId, UUID clientId, String status, int page, int size);
    long countHistory(UUID campaignId, UUID clientId, String status);
    boolean existsDuplicate(UUID campaignId, UUID clientId, String messageHash);
    long countDeliveriesToday(UUID clientId, UUID campaignId);
}
