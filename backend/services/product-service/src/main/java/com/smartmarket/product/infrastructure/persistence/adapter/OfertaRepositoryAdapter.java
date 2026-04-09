package com.smartmarket.product.infrastructure.persistence.adapter;

import com.smartmarket.product.domain.model.OfertaSupermercado;
import com.smartmarket.product.domain.repository.OfertaDomainRepository;
import com.smartmarket.product.infrastructure.persistence.OfertaRepository;
import com.smartmarket.product.infrastructure.persistence.OfertaSupermercadoEntity;
import com.smartmarket.product.infrastructure.persistence.mapper.OfertaMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class OfertaRepositoryAdapter implements OfertaDomainRepository {

    private final OfertaRepository jpaRepository;
    private final OfertaMapper mapper;

    public OfertaRepositoryAdapter(OfertaRepository jpaRepository, OfertaMapper mapper) {
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
    public boolean existsBySupermercadoIdAndProdutoBaseIdAndAtivoTrue(UUID supermercadoId, UUID produtoBaseId) {
        return jpaRepository.existsBySupermercadoIdAndProdutoBaseIdAndAtivoTrue(supermercadoId, produtoBaseId);
    }

    @Override
    public OfertaSupermercado save(OfertaSupermercado oferta) {
        OfertaSupermercadoEntity entity = mapper.toEntity(oferta);
        OfertaSupermercadoEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }
}
