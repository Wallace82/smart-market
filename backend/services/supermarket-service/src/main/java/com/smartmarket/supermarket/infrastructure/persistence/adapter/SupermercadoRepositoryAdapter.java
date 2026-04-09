package com.smartmarket.supermarket.infrastructure.persistence.adapter;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.repository.SupermercadoDomainRepository;
import com.smartmarket.supermarket.infrastructure.persistence.SupermercadoEntity;
import com.smartmarket.supermarket.infrastructure.persistence.SupermercadoRepository;
import com.smartmarket.supermarket.infrastructure.persistence.mapper.SupermercadoMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class SupermercadoRepositoryAdapter implements SupermercadoDomainRepository {

    private final SupermercadoRepository jpaRepository;
    private final SupermercadoMapper mapper;

    public SupermercadoRepositoryAdapter(SupermercadoRepository jpaRepository, SupermercadoMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Supermercado> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Supermercado> findAll(int page, int size) {
        return jpaRepository.findAll(PageRequest.of(page, size)).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Supermercado> findByGestorId(UUID gestorId) {
        return jpaRepository.findByGestorId(gestorId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByCnpj(String cnpj) {
        return jpaRepository.existsByCnpj(cnpj);
    }

    @Override
    public Supermercado save(Supermercado supermercado) {
        SupermercadoEntity entity = mapper.toEntity(supermercado);
        SupermercadoEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }
}
