package com.smartmarket.notification.application.port.out;

import com.smartmarket.notification.domain.model.Campaign;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CampaignRepositoryPort {
    Campaign save(Campaign campaign);
    Optional<Campaign> findById(UUID id);
    List<Campaign> findBySupermarketId(UUID supermarketId);
    List<Campaign> findActiveBySupermarketId(UUID supermarketId);
    void delete(UUID id);
}
