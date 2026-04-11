package com.smartmarket.product.infrastructure.persistence.adapter;

import com.smartmarket.product.domain.model.TemaEncarte;
import com.smartmarket.product.domain.repository.TemaEncarteDomainRepository;
import com.smartmarket.product.infrastructure.persistence.TemaEncarteEntity;
import com.smartmarket.product.infrastructure.persistence.TemaEncarteRepository;
import com.smartmarket.product.infrastructure.persistence.mapper.TemaEncarteMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TemaEncarteRepositoryAdapter implements TemaEncarteDomainRepository {

    private final TemaEncarteRepository jpaRepository;
    private final TemaEncarteMapper mapper;

    public TemaEncarteRepositoryAdapter(TemaEncarteRepository jpaRepository, TemaEncarteMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public TemaEncarte save(TemaEncarte temaEncarte) {
        TemaEncarteEntity entity = mapper.toEntity(temaEncarte);
        TemaEncarteEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<TemaEncarte> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<TemaEncarte> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
