package com.smartmarket.notification.application.usecase;

import com.smartmarket.notification.application.port.out.CampaignRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeletarCampanhaUseCase {

    private final CampaignRepositoryPort campaignRepository;

    public void execute(UUID id) {
        if (!campaignRepository.findById(id).isPresent()) {
            throw new IllegalArgumentException("Campanha não encontrada.");
        }
        campaignRepository.delete(id);
    }
}
