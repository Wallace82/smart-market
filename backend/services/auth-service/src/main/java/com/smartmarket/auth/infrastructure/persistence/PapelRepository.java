package com.smartmarket.auth.infrastructure.persistence;

import com.smartmarket.auth.domain.model.PapelNome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PapelRepository extends JpaRepository<PapelEntity, UUID> {
    Optional<PapelEntity> findByNome(PapelNome nome);
}
