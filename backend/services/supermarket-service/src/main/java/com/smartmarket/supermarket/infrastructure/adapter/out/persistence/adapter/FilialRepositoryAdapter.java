package com.smartmarket.supermarket.infrastructure.adapter.out.persistence.adapter;

import com.smartmarket.supermarket.application.port.out.FilialDomainRepository;
import com.smartmarket.supermarket.domain.model.Filial;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.FilialEntity;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.FilialRepository;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.mapper.FilialMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class FilialRepositoryAdapter implements FilialDomainRepository {

    private final FilialRepository repository;
    private final FilialMapper mapper;

    public FilialRepositoryAdapter(FilialRepository repository, FilialMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Filial save(Filial filial) {
        FilialEntity entity = mapper.toEntity(filial);
        FilialEntity saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Filial> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Filial> findBySupermercadoId(UUID supermercadoId) {
        return repository.findBySupermercadoId(supermercadoId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
