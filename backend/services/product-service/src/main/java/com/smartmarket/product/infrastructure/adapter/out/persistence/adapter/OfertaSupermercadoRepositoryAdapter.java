package com.smartmarket.product.infrastructure.adapter.out.persistence.adapter;

import com.smartmarket.product.domain.model.OfertaSupermercado;
import com.smartmarket.product.application.port.out.OfertaSupermercadoDomainRepository;
import com.smartmarket.product.infrastructure.adapter.out.persistence.OfertaSupermercadoEntity;
import com.smartmarket.product.infrastructure.adapter.out.persistence.OfertaSupermercadoRepository;
import com.smartmarket.product.infrastructure.adapter.out.persistence.mapper.OfertaMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class OfertaSupermercadoRepositoryAdapter implements OfertaSupermercadoDomainRepository {

    private final OfertaSupermercadoRepository jpaRepository;
    private final OfertaMapper mapper;

    public OfertaSupermercadoRepositoryAdapter(OfertaSupermercadoRepository jpaRepository, OfertaMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<OfertaSupermercado> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<OfertaSupermercado> findBySupermercadoId(UUID supermercadoId) {
        return jpaRepository.findBySupermercadoId(supermercadoId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public OfertaSupermercado save(OfertaSupermercado oferta) {
        OfertaSupermercadoEntity entity = mapper.toEntity(oferta);
        OfertaSupermercadoEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}


