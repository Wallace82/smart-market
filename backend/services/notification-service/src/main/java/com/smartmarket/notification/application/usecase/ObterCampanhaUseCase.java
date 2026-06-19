package com.smartmarket.notification.application.usecase;

import com.smartmarket.notification.application.port.out.CampaignRepositoryPort;
import com.smartmarket.notification.domain.model.Campaign;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ObterCampanhaUseCase {

    private final CampaignRepositoryPort campaignRepository;

    public Optional<Campaign> execute(UUID id) {
        return campaignRepository.findById(id);
    }
}
