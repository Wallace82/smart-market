package com.smartmarket.product.infrastructure.persistence.adapter;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.repository.EncarteDigitalDomainRepository;
import com.smartmarket.product.infrastructure.persistence.EncarteDigitalEntity;
import com.smartmarket.product.infrastructure.persistence.EncarteDigitalRepository;
import com.smartmarket.product.infrastructure.persistence.mapper.EncarteDigitalMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class EncarteDigitalRepositoryAdapter implements EncarteDigitalDomainRepository {

    private final EncarteDigitalRepository jpaRepository;
    private final EncarteDigitalMapper mapper;

    public EncarteDigitalRepositoryAdapter(EncarteDigitalRepository jpaRepository, EncarteDigitalMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public EncarteDigital save(EncarteDigital encarteDigital) {
        EncarteDigitalEntity entity = mapper.toEntity(encarteDigital);
        EncarteDigitalEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<EncarteDigital> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<EncarteDigital> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<EncarteDigital> findBySupermercadoId(UUID supermercadoId) {
        return jpaRepository.findBySupermercadoId(supermercadoId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
