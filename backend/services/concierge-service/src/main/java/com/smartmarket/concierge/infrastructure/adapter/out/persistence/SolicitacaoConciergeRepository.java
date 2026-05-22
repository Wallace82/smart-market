package com.smartmarket.concierge.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SolicitacaoConciergeRepository extends JpaRepository<SolicitacaoConciergeEntity, UUID> {
    
    List<SolicitacaoConciergeEntity> findBySupermercadoId(UUID supermercadoId);
    
    @Query("SELECT s FROM SolicitacaoConciergeEntity s ORDER BY s.prioridadeScore DESC, s.dataCriacao ASC")
    List<SolicitacaoConciergeEntity> findTopPriorities();

    long countBySupermercadoIdAndDataCriacaoAfter(UUID supermercadoId, java.time.LocalDateTime dataInicio);
}
