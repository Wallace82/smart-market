package com.smartmarket.notification.infrastructure.adapter.out.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SpringDataNotificationDeliveryRepository extends JpaRepository<NotificationDeliveryEntity, UUID> {
    
    boolean existsByCampaignIdAndClientIdAndMessageHashAndStatus(UUID campaignId, UUID clientId, String messageHash, String status);
    
    long countByClientIdAndCampaignIdAndSentAtAfter(UUID clientId, UUID campaignId, LocalDateTime sentAt);

    @Query("SELECT n FROM NotificationDeliveryEntity n WHERE " +
           "(:campaignId IS NULL OR n.campaignId = :campaignId) AND " +
           "(:clientId IS NULL OR n.clientId = :clientId) AND " +
           "(:status IS NULL OR n.status = :status) " +
           "ORDER BY n.sentAt DESC")
    Page<NotificationDeliveryEntity> findHistoryFiltered(
            @Param("campaignId") UUID campaignId,
            @Param("clientId") UUID clientId,
            @Param("status") String status,
            Pageable pageable);
}
