package com.smartmarket.notification.application.usecase;

import com.smartmarket.notification.application.dto.NotificationDeliveryResponse;
import com.smartmarket.notification.application.port.out.NotificationDeliveryRepositoryPort;
import com.smartmarket.notification.domain.model.NotificationDelivery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListarHistoricoUseCase {

    private final NotificationDeliveryRepositoryPort repository;

    public List<NotificationDeliveryResponse> execute(UUID campaignId, UUID clientId, String status, int page, int size) {
        List<NotificationDelivery> deliveries = repository.findHistory(campaignId, clientId, status, page, size);
        return deliveries.stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
    }

    public long count(UUID campaignId, UUID clientId, String status) {
        return repository.countHistory(campaignId, clientId, status);
    }

    private NotificationDeliveryResponse fromDomain(NotificationDelivery domain) {
        return NotificationDeliveryResponse.builder()
                .id(domain.getId())
                .campaignId(domain.getCampaignId())
                .clientId(domain.getClientId())
                .status(domain.getStatus())
                .sentAt(domain.getSentAt())
                .blockReason(domain.getBlockReason())
                .deepLink(domain.getDeepLink())
                .build();
    }
}
