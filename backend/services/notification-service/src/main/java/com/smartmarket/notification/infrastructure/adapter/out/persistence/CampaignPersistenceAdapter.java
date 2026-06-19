package com.smartmarket.notification.infrastructure.adapter.out.persistence;

import com.smartmarket.notification.application.port.out.CampaignRepositoryPort;
import com.smartmarket.notification.domain.model.Campaign;
import com.smartmarket.notification.infrastructure.adapter.out.persistence.mapper.CampaignMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CampaignPersistenceAdapter implements CampaignRepositoryPort {

    private final SpringDataCampaignRepository repository;
    private final CampaignMapper mapper;

    @Override
    public Campaign save(Campaign campaign) {
        CampaignEntity entity = mapper.toEntity(campaign);
        CampaignEntity saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Campaign> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Campaign> findBySupermarketId(UUID supermarketId) {
        return repository.findBySupermarketId(supermarketId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Campaign> findActiveBySupermarketId(UUID supermarketId) {
        return repository.findBySupermarketIdAndStatus(supermarketId, "ATIVA").stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
