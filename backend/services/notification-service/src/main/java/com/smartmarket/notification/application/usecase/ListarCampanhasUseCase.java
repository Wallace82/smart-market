package com.smartmarket.notification.application.usecase;

import com.smartmarket.notification.application.port.out.CampaignRepositoryPort;
import com.smartmarket.notification.domain.model.Campaign;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ListarCampanhasUseCase {

    private final CampaignRepositoryPort campaignRepository;

    public List<Campaign> execute(UUID supermarketId) {
        return campaignRepository.findBySupermarketId(supermarketId);
    }
}
