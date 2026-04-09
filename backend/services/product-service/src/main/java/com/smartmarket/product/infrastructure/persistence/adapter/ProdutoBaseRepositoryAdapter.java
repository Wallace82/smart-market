package com.smartmarket.product.infrastructure.persistence.adapter;

import com.smartmarket.product.domain.model.ProdutoBase;
import com.smartmarket.product.domain.repository.ProdutoBaseDomainRepository;
import com.smartmarket.product.infrastructure.persistence.ProdutoBaseEntity;
import com.smartmarket.product.infrastructure.persistence.ProdutoBaseRepository;
import com.smartmarket.product.infrastructure.persistence.mapper.ProdutoBaseMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ProdutoBaseRepositoryAdapter implements ProdutoBaseDomainRepository {

    private final ProdutoBaseRepository jpaRepository;
    private final ProdutoBaseMapper mapper;

    public ProdutoBaseRepositoryAdapter(ProdutoBaseRepository jpaRepository, ProdutoBaseMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<ProdutoBase> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<ProdutoBase> findAll(int page, int size) {
        return jpaRepository.findAll(PageRequest.of(page, size)).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProdutoBase> findByNomeContainingIgnoreCase(String nome) {
        return jpaRepository.findByNomeContainingIgnoreCase(nome).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public ProdutoBase save(ProdutoBase produto) {
        ProdutoBaseEntity entity = mapper.toEntity(produto);
        ProdutoBaseEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
