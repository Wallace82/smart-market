package com.smartmarket.notification.infrastructure.adapter.out.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataCampaignRepository extends JpaRepository<CampaignEntity, UUID> {
    Page<CampaignEntity> findBySupermarketId(UUID supermarketId, Pageable pageable);
    List<CampaignEntity> findBySupermarketId(UUID supermarketId);
    List<CampaignEntity> findBySupermarketIdAndStatus(UUID supermarketId, String status);
}
