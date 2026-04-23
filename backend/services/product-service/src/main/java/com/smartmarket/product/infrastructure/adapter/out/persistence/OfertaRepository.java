package com.smartmarket.product.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OfertaRepository extends JpaRepository<OfertaSupermercadoEntity, UUID> {
    List<OfertaSupermercadoEntity> findBySupermercadoId(UUID supermercadoId);
    
    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM OfertaSupermercadoEntity o " +
           "WHERE o.supermercadoId = :supermercadoId " +
           "AND o.produtoBase.id = :produtoBaseId " +
           "AND o.ativo = true")
    boolean existsBySupermercadoIdAndProdutoBaseIdAndAtivoTrue(
        @Param("supermercadoId") UUID supermercadoId, 
        @Param("produtoBaseId") UUID produtoBaseId);
}

