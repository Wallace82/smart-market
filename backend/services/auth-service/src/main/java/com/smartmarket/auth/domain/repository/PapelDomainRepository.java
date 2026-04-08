package com.smartmarket.auth.domain.repository;

import com.smartmarket.auth.domain.model.Papel;
import com.smartmarket.auth.domain.model.PapelNome;

import java.util.Optional;

public interface PapelDomainRepository {
    Optional<Papel> findByNome(PapelNome nome);
}
