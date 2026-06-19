package com.smartmarket.notification.application.usecase;

import com.smartmarket.notification.application.port.out.CampaignRepositoryPort;
import com.smartmarket.notification.domain.model.Campaign;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlterarStatusCampanhaUseCase {

    private final CampaignRepositoryPort campaignRepository;

    public Campaign execute(UUID id, String status) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Campanha não encontrada."));
        
        campaign.setStatus(status);
        campaign.setUpdatedAt(LocalDateTime.now());
        return campaignRepository.save(campaign);
    }
}
