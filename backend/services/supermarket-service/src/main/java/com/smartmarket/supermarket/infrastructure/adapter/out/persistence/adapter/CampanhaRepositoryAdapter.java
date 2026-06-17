package com.smartmarket.supermarket.infrastructure.adapter.out.persistence.adapter;

import com.smartmarket.supermarket.application.port.out.CampanhaDomainRepository;
import com.smartmarket.supermarket.domain.model.Campanha;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.CampanhaEntity;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.CampanhaRepository;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.mapper.CampanhaMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class CampanhaRepositoryAdapter implements CampanhaDomainRepository {

    private final CampanhaRepository repository;
    private final CampanhaMapper mapper;

    public CampanhaRepositoryAdapter(CampanhaRepository repository, CampanhaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Campanha save(Campanha campanha) {
        CampanhaEntity entity = mapper.toEntity(campanha);
        CampanhaEntity saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Campanha> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Campanha> findBySupermercadoId(UUID supermercadoId) {
        return repository.findBySupermercadoId(supermercadoId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
