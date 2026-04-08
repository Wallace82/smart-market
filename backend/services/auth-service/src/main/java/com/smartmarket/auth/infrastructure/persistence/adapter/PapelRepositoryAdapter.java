package com.smartmarket.auth.infrastructure.persistence.adapter;

import com.smartmarket.auth.domain.model.Papel;
import com.smartmarket.auth.domain.model.PapelNome;
import com.smartmarket.auth.domain.repository.PapelDomainRepository;
import com.smartmarket.auth.infrastructure.persistence.PapelRepository;
import com.smartmarket.auth.infrastructure.persistence.mapper.PapelMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class PapelRepositoryAdapter implements PapelDomainRepository {

    private final PapelRepository jpaRepository;
    private final PapelMapper mapper;

    public PapelRepositoryAdapter(PapelRepository jpaRepository, PapelMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Papel> findByNome(PapelNome nome) {
        return jpaRepository.findByNome(nome).map(mapper::toDomain);
    }
}
