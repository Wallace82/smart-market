package com.smartmarket.supermarket.infrastructure.adapter.out.persistence;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SupermercadoRepository extends JpaRepository<SupermercadoEntity, UUID> {
    List<SupermercadoEntity> findByGestorId(UUID gestorId);
    boolean existsByCnpj(String cnpj);

    /**
     * RF-06.2: Busca por proximidade usando fórmula de Haversine (distância em metros).
     * Retorna apenas supermercados com status ATIVO dentro do raio informado.
     * Ver ARCHITECTURE.md seção 8 para detalhes da estratégia.
     */
    @Query("""
        SELECT s FROM SupermercadoEntity s
        WHERE s.status = 'ATIVO'
          AND (6371000 * acos(
                cos(radians(:lat)) * cos(radians(s.latitude))
                * cos(radians(s.longitude) - radians(:lng))
                + sin(radians(:lat)) * sin(radians(s.latitude))
              )) <= :radiusMeters
        ORDER BY (6371000 * acos(
                cos(radians(:lat)) * cos(radians(s.latitude))
                * cos(radians(s.longitude) - radians(:lng))
                + sin(radians(:lat)) * sin(radians(s.latitude))
              )) ASC
    """)
    List<SupermercadoEntity> findNearbyByHaversine(
            @Param("lat") Double latitude,
            @Param("lng") Double longitude,
            @Param("radiusMeters") Integer radiusMeters);

    /**
     * RF-06.3: Busca por texto no endereço (CEP ou bairro parcial).
     * Retorna apenas supermercados ATIVOS.
     */
    @Query("""
        SELECT s FROM SupermercadoEntity s
        WHERE s.status = 'ATIVO'
          AND (:cep IS NULL OR s.endereco LIKE %:cep%)
          AND (:bairro IS NULL OR LOWER(s.endereco) LIKE LOWER(CONCAT('%', :bairro, '%')))
    """)
    List<SupermercadoEntity> findByAddressContaining(
            @Param("cep") String cep,
            @Param("bairro") String bairro,
            Pageable pageable);
}

